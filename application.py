# make sure ES is up and running
import requests
import json

from elasticsearch import Elasticsearch
from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS, cross_origin



# print es.search(index="tweets", body={"query": {"match": {'text':{'query': "Bank"}}}})


# def store(data):

# 	for result in data:
# 		es.index(index='tweets', doc_type='listings', body=json.loads(json.dumps(data)))


#def search(target):

	#es.search(index="tweets", body={"query": {"match": {'text':{'query': target}}}})



es=Elasticsearch(['https://search-tweetmap-px7q55rz5bmnnz3iuzedyvr4ta.us-west-1.es.amazonaws.com/',])
application = Flask(__name__)
CORS(application)


@application.route('/')
def index():
	result = {"value": "Hello, world"}
	return jsonify(**result)

@application.route('/store', methods=['POST'])
def store():
	jsonData = request.get_json()
	#print json.dumps(jsonData)

	jsonArr = jsonData["matched_results"]


	#index every single post in ES
	for singlePost in jsonArr:

		es.index(index='posts', doc_type='tweets', body=singlePost)


	#search()

	return jsonify(**{"result":"OK"})




@application.route('/searchKey', methods=['GET'])	
def search():

	searchword = request.args.get('getQuote', '')

	jsonObj = es.search(index='posts', size=10000, body={"query": {"match": {'text':{'query': searchword}}}})

	#print json.dumps(jsonObj)


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







		

	