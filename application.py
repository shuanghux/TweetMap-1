# make sure ES is up and running
import requests
import json

from elasticsearch import Elasticsearch
from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS, cross_origin

import logging
# Add Logger
logger = logging.getLogger(__name__)
newTweets = []

es=Elasticsearch(['https://search-tweetmap-px7q55rz5bmnnz3iuzedyvr4ta.us-west-1.es.amazonaws.com/',])
application = Flask(__name__)
CORS(application)


@application.route('/')
def index():

    return render_template('index.html')

@application.route('/store', methods=['POST'])
def store():

    global newTweets
    header = request.headers.get('x-amz-sns-message-type')
    try:
        data = json.loads(request.data)
    except:
        pass

    if header == 'SubscriptionConfirmation' and 'SubscribeURL' in data:
        url = data['SubscribeURL']
        #Response to SNS
        response = requests.get(url)

        logger.info("Subscribed to SNS: " + url)
        return "Subscribed to SNS: " + url

    if header == 'Notification':
        logger.info(data['Message'])

        es.index(index='twittertrendv1', doc_type='tweet', body=json.loads(json.dumps(data['Message'])))
        newTweets.append(json.loads(data['Message']))
        return data['Message']

    if len(newTweets) > 100:
        newTweets = []

    return jsonify(**{"result":"OK"})

#update tweets for the front end
@application.route('/update', methods=['GET'])
def update():
    global newTweets
    if len(newTweets) > 0:
        updateTweets = []
        while len(newTweets) > 0 and len(updateTweets) < 10:
            updateTweets.append(newTweets.pop(0))       
        return jsonify(**{"result":updateTweets})

    else:
        return jsonify(**{"result":[]})


@application.route('/searchKey', methods=['GET'])   
def search():

    searchword = request.args.get('getQuote', '')

    jsonObj = es.search(index='twittertrendv1', size=10000, body={"query": {"match": {'text':{'query': searchword}}}})

    hitsArr = jsonObj["hits"]["hits"]

    postsArr = []

    for hitJsonObj in hitsArr:
        postsArr.append(hitJsonObj["_source"])

    submitJSON = {}
    submitJSON['index'] = len(hitsArr)
    submitJSON['results'] = postsArr

    return json.dumps(submitJSON)


if __name__ == "__main__":
    #application.debug = True
    application.threaded = True
    application.run()







        

    