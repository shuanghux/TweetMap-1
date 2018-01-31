from kafka import KafkaConsumer
from textblob import TextBlob
import json
import config
import boto3
from geopy.geocoders import Nominatim

KAFKA_HOST = config.KAFKA_HOST
TOPIC = config.TOPIC
SNS_ARN = config.SNS_ARN
SNS_ACCESS_KEY = config.SNS_ACCESS_KEY
SNS_SECRET_KEY = config.SNS_SECRET_KEY
SNS_REGION_NAME = config.SNS_REGION_NAME
client = boto3.client('sns',
                      region_name=SNS_REGION_NAME,
                      aws_access_key_id=SNS_ACCESS_KEY,
                      aws_secret_access_key=SNS_SECRET_KEY,)
geolocator = Nominatim()

consumer = KafkaConsumer(TOPIC, bootstrap_servers=[KAFKA_HOST])
while True:
    try:
        for message in consumer:
            dataJSON = json.loads(message.value)
            text = dataJSON['text']
            created_at = dataJSON['created_at']
            user_name = dataJSON['user_name']
            user_image = dataJSON['user_image']
            coordinates = dataJSON['coordinates']
            testimonial = TextBlob(text)
            polarity = testimonial.sentiment.polarity
            location = geolocator.reverse((coordinates[1], coordinates[0]))
            country = location.raw['address']['country']
            country_code = location.raw['address']['country_code']
            tweet_obj = {'text': text,
                         'created_at': created_at,
                         'user_name': user_name,
                         'user_image': user_image,
                         'coordinates': coordinates,
                         'polarity': polarity,
                         'country': country,
                         'country_code': country_code}
            tweet_obj = json.dumps(tweet_obj)
            print tweet_obj
            # Ready to be send to SNS
            response = client.publish(
                TargetArn=SNS_ARN,
                Message=json.dumps({'default': 'tweetMessage'}),
                MessageStructure='json'
            )
    except Exception as e:
        print e
        continue
