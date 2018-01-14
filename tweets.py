#Import the necessary methods from tweepy library
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import json
import requests

#Variables that contains the user credentials to access Twitter API 
access_token = "3764071997-WtuX11SMGpSyndG7VjMSqm1gHD8F3jhtOn4R45F"
access_token_secret = "LXFAGzLp50IrNTXUSVPiqbmkV5CH8qNVe3MYzWZL7hx5A"
consumer_key = "TcBTqilB4H9pYgM1R4qE8lA6n"
consumer_secret = "Iajsu8xtqVm3Do8EYBWsLPH3fgJGBs19QzQRKZGskP1qf3LmVx"


#This is a basic listener that just prints received tweets to stdout.
class StdOutListener(StreamListener):

    def __init__(self):
        self.counter = 0
        self.tweets_list = []

    def on_data(self, data):
        keywords = ["basketball","soccer","music","sport","car","food","war","job","hello"]
        dataJSON = json.loads(data)
        try:
            text = dataJSON['text'].lower()
            if any(x in text for x in keywords):
                if dataJSON['coordinates'] is not None:
                    self.counter += 1
                    created_at = dataJSON['created_at']
                    user_name = dataJSON['user']['name']
                    user_image = dataJSON['user']['profile_image_url_https']
                    coordinates = dataJSON['coordinates']['coordinates']
                    tweet_dict = {'text': dataJSON['text'],
                        		'created_at': created_at,
                	       		'user_name': user_name,
                                'user_image': user_image,
                                'coordinates': coordinates}
                    self.tweets_list.append(tweet_dict)
                    print "Find a Match"
                    print self.counter
                    print json.dumps(tweet_dict)
                    if self.counter == 5:                        
                        print self.tweets_list
                        self.counter = 0                        
                        r = requests.post("http://127.0.0.1:5000/store",json={"matched_results":self.tweets_list})
                        print "post"
                        print(r.status_code, r.reason, r.text)
                        self.tweets_list = []
        except:
            print "error"
            pass
        return True

    def on_error(self, status):
        print status
        if status == 420:
            #returning False in on_data disconnects the stream
            return False

if __name__ == '__main__':

    #This handles Twitter authetification and the connection to Twitter Streaming API
    l = StdOutListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = Stream(auth, l)

    #This line filter Twitter Streams to capture data by the keywords: 'python', 'javascript', 'ruby'
    keywords = ["basketball", "soccer", "music", "sport", "car", "food", "war", "job", "hello"]
    stream.filter(track=keywords)