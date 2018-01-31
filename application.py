# make sure ES is up and running
import requests
import json

from elasticsearch import Elasticsearch
from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS, cross_origin

es = Elasticsearch(
    ['https://search-tweetmap-px7q55rz5bmnnz3iuzedyvr4ta.us-west-1.es.amazonaws.com/', ])
application = Flask(__name__)
CORS(application)


@application.route('/')
def index():
        # result = {"value": "Hello, world"}
        # return jsonify(**result)
    return render_template('index.html')


@application.route('/store', methods=['POST'])
def store():

    jsonData = request.get_json()

    jsonArr = jsonData["matched_results"]

    for singlePost in jsonArr:

        es.index(index='sentimentaltweets', doc_type='tweets', body=singlePost)

    return jsonify(**{"result": "OK"})


@application.route('/searchKey', methods=['GET'])
def search():

    searchword = request.args.get('getQuote', '')

    jsonObj = es.search(index='sentimentaltweets', size=10000, body={
                        "query": {"match": {'text': {'query': searchword}}}})

    # print json.dumps(jsonObj)

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
    # application.threaded = True
    application.run()
