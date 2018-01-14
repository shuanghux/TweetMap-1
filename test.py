# make sure ES is up and running
import requests
import json

from elasticsearch import Elasticsearch
from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS, cross_origin

# es=Elasticsearch(['https://search-tweetmap-px7q55rz5bmnnz3iuzedyvr4ta.us-west-1.es.amazonaws.com/',])

# print es.search(index="tweets", body={"query": {"match": {'text':{'query': "Bank"}}}})


# def store(data):

# 	for result in data:
# 		es.index(index='tweets', doc_type='listings', body=json.loads(json.dumps(data)))


def search(target):

	es.search(index="tweets", body={"query": {"match": {'text':{'query': target}}}})



application = Flask(__name__)
CORS(application)


@application.route('/')
def index():
	result = {"value": "Hello, world"}
	return jsonify(**result)

@application.route('/store', methods=['POST'])
def store():
	jsonData = request.get_json()
	print json.dumps(jsonData)
	return "received"


if __name__ == "__main__":
	application.debug = True
	application.run()






		

	