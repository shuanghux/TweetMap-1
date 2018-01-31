# Import the necessary methods from tweepy library
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import json
import oauth2
from kafka import KafkaProducer
import config

# Variables that contains the user credentials to access Twitter API
access_token = config.access_token
access_token_secret = config.access_token_secret
consumer_key = config.consumer_key
consumer_secret = config.consumer_secret

# Variables that containing kafka credentials
KAFKA_HOST = config.KAFKA_HOST
TOPIC = config.TOPIC
producer = KafkaProducer(bootstrap_servers=[KAFKA_HOST])


consumer = oauth2.Consumer(key=consumer_key, secret=consumer_secret)
token = oauth2.Token(key=access_token, secret=access_token_secret)
client = oauth2.Client(consumer, token)
url = "https://api.twitter.com/1.1/trends/place.json?id=1"
resp, content = client.request(url)
# print json.loads(content)
trends = json.loads(content)[0]["trends"]
trends_keywords = []
for trend in trends:
    trends_keywords.append(trend["name"])
# print keywords

# This is a basic listener that just prints received tweets to stdout.
class StdOutListener(StreamListener):

    def __init__(self):
        self.counter = 0
        self.tweets_list = []

    def on_data(self, data):
        dataJSON = json.loads(data)
        try:
            text = dataJSON['text'].lower()
            # if any(x in text for x in keywords):
            if dataJSON['place'] is not None:
                self.counter += 1
                created_at = dataJSON['created_at']
                user_name = dataJSON['user']['name']
                user_image = dataJSON['user']['profile_image_url_https']
                x1 = dataJSON['place']['bounding_box']['coordinates'][0][0][0]
                x2 = dataJSON['place']['bounding_box']['coordinates'][0][2][0]
                y1 = dataJSON['place']['bounding_box']['coordinates'][0][0][1]
                y2 = dataJSON['place']['bounding_box']['coordinates'][0][1][1]
                
                coordinates = [(x1 + x2) / 2, (y1 + y2) / 2]
                if dataJSON['coordinates'] is not None:
                    coordinates = dataJSON['coordinates']['coordinates']
                tweet_dict = {'text': dataJSON['text'],
                              'created_at': created_at,
                              'user_name': user_name,
                              'user_image': user_image,
                              'coordinates': coordinates}
                print "Find a Match"
                tweetObj = json.dumps(tweet_dict)
                print tweetObj
                producer.send(TOPIC,tweetObj)
        except:
            pass
            # print dataJSON
        return True

    def on_error(self, status):
        print status
        if status == 420:
            # returning False in on_data disconnects the stream
            return False

if __name__ == '__main__':

    # This handles Twitter authetification and the connection to Twitter
    # Streaming API
    l = StdOutListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = Stream(auth, l)

    # This line filter Twitter Streams to capture data by the keywords:
    my_keywords = ["job", "hiring", "here", "Join", "team", "apply", "See", "sea", "star",
                    "latest", "home", "trump", "love", "NBA", "google", "python", "java",
                    "usc", "US", "UK", "soccer", "music", "football", "basketball", "CS",
                    "college", "hero", "car", "study", "EE", "Rockets", "Lakers", "news"]
    keywords = trends_keywords + my_keywords
    stream.filter(track=keywords)
