// Global variables

// raw data array
var responseText;
var sampleStr;
var jsonArr;
var updateJsonArr;
// map object
var map;
var heatmap;
// detail html for each tweet
var webViewArr;
var markerSize = 0;
var markers;
var markerCluster;
var firstTime = true;
var isHeatmap = false;
var isSentiment = false;
var sentimentValue = 0;
var ico = {
	path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
	fillColor: '#42f4b3',
	fillOpacity: 0.8,
	scale: 0.5,
		  // strokeColor: 'gold',
		  // strokeWeight: 14
};

$(document).ready(function(){
	initMap();
});

function initMap() {
	$("#graph").hide();
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 2,
		center: {lat: 15, lng: 20 },
		styles:[
		{
			"elementType": "geometry",
			"stylers": [
			{
				"color": "#1d2c4d"
			}
			]
		},
		{
			"elementType": "labels.text.fill",
			"stylers": [
			{
				"color": "#8ec3b9"
			}
			]
		},
		{
			"elementType": "labels.text.stroke",
			"stylers": [
			{
				"color": "#1a3646"
			}
			]
		},
		{
			"featureType": "administrative.country",
			"elementType": "geometry.stroke",
			"stylers": [
			{
				"color": "#4b6878"
			}
			]
		},
		{
			"featureType": "administrative.land_parcel",
			"elementType": "labels.text.fill",
			"stylers": [
			{
				"color": "#64779e"
			}
			]
		},
		{
			"featureType": "administrative.province",
			"elementType": "geometry.stroke",
			"stylers": [
			{
				"color": "#4b6878"
			}
			]
		},
		{
			"featureType": "landscape.man_made",
			"elementType": "geometry.stroke",
			"stylers": [
			{
				"color": "#334e87"
			}
			]
		},
		{
			"featureType": "landscape.natural",
			"elementType": "geometry",
			"stylers": [
			{
				"color": "#023e58"
			}
			]
		},
		{
			"featureType": "poi",
			"elementType": "geometry",
			"stylers": [
			{
				"color": "#283d6a"
			}
			]
		},
		{
			"featureType": "poi",
			"elementType": "labels.text.fill",
			"stylers": [
			{
				"color": "#6f9ba5"
			}
			]
		},
		{
			"featureType": "poi",
			"elementType": "labels.text.stroke",
			"stylers": [
			{
				"color": "#1d2c4d"
			}
			]
		},
		{
			"featureType": "poi.park",
			"elementType": "geometry.fill",
			"stylers": [
			{
				"color": "#023e58"
			}
			]
		},
		{
			"featureType": "poi.park",
			"elementType": "labels.text.fill",
			"stylers": [
			{
				"color": "#3C7680"
			}
			]
		},
		{
			"featureType": "road",
			"elementType": "geometry",
			"stylers": [
			{
				"color": "#304a7d"
			}
			]
		},
		{
			"featureType": "road",
			"elementType": "labels.text.fill",
			"stylers": [
			{
				"color": "#98a5be"
			}
			]
		},
		{
			"featureType": "road",
			"elementType": "labels.text.stroke",
			"stylers": [
			{
				"color": "#1d2c4d"
			}
			]
		},
		{
			"featureType": "road.highway",
			"elementType": "geometry",
			"stylers": [
			{
				"color": "#2c6675"
			}
			]
		},
		{
			"featureType": "road.highway",
			"elementType": "geometry.stroke",
			"stylers": [
			{
				"color": "#255763"
			}
			]
		},
		{
			"featureType": "road.highway",
			"elementType": "labels.text.fill",
			"stylers": [
			{
				"color": "#b0d5ce"
			}
			]
		},
		{
			"featureType": "road.highway",
			"elementType": "labels.text.stroke",
			"stylers": [
			{
				"color": "#023e58"
			}
			]
		},
		{
			"featureType": "transit",
			"elementType": "labels.text.fill",
			"stylers": [
			{
				"color": "#98a5be"
			}
			]
		},
		{
			"featureType": "transit",
			"elementType": "labels.text.stroke",
			"stylers": [
			{
				"color": "#1d2c4d"
			}
			]
		},
		{
			"featureType": "transit.line",
			"elementType": "geometry.fill",
			"stylers": [
			{
				"color": "#283d6a"
			}
			]
		},
		{
			"featureType": "transit.station",
			"elementType": "geometry",
			"stylers": [
			{
				"color": "#3a4762"
			}
			]
		},
		{
			"featureType": "water",
			"elementType": "geometry",
			"stylers": [
			{
				"color": "#0e1626"
			}
			]
		},
		{
			"featureType": "water",
			"elementType": "labels.text.fill",
			"stylers": [
			{
				"color": "#4e6d70"
			}
			]
		}
		]
	});

}

function initVariables() {
	jsonArr = [];
	webViewArr = [];
	markers = [];
	updateJsonArr = [];
}

function getQuote() {
	if (isHeatmap) {heatmap.setMap(null);}
	isHeatmap = false;
	if (!firstTime) {
		removeMarkers();
		initVariables();
	}
	var keyword = $("#search_box").val();
	$.ajax({
		url: 'http://tweetymap.us-east-2.elasticbeanstalk.com/searchKey',
		// url: 'http://tweetymap.us-east-2.elasticbeanstalk.com/searchKey',
		type: 'GET',
	//dataType: 'json',
	data: {'getQuote': keyword},
	})
	.done(function(response) {
		console.log("success");
		responseText = response;
		processData(JSON.parse(response)["results"]);
		addMarkers();
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});

	setInterval(updateTweets, 30000);
	firstTime = false;
}

function updateTweets(){

	$.ajax({
		url: 'http://tweetymap.us-east-2.elasticbeanstalk.com/update',
		type: 'GET', 
		dataType: 'json',
	}).done(function(response) {
		console.log("update success");
		processUpdateData(response["result"]);
		updateMarkers();
	}).fail(function() {
		console.log("update error");
	});
}

function updateMarkers(){
	if (updateJsonArr.length!=0) {
		removeMarkers();

		for (var i in updateJsonArr) {

			jsonArr.push(updateJsonArr[i]);

		}
		addMarkers();
	}
	
}

function processUpdateData(response){
	updateJsonArr = response;
	console.log(updateJsonArr);
}

function processData(response) {
	jsonArr = response;
}


// return HTML string for given tweet json object
function generateWebView(jsonObj) {
	var contentHTML = "<div>";
	contentHTML += "<p>" + jsonObj["text"] + "\n</p>"
	contentHTML += "<p style='font-style: italic'> Created at: " + jsonObj["created_at"] + "\n</p>"
	contentHTML += "</div>"

	return contentHTML;
}


function addMarkers() {
	$("#graph").hide();
	$("#map").show();
	$("#text").html("");
	webViewArr = new Array();
	markers = new Array();
	markerSize = jsonArr.length;

	for (var i in jsonArr) {
		var currObj = jsonArr[i];
		//console.log(loc);
		var userName = currObj["user_name"];
		var contentHTML = generateWebView(currObj);
		webViewArr[i] = contentHTML;

		var marker = new google.maps.Marker({
			position: {lat:currObj["coordinates"][1], lng:currObj["coordinates"][0]},
			map: map,
			title: userName,
			icon: ico
		});
		markers[i] = marker;
		attachWebView(markers[i], webViewArr[i]);
	}
	markerCluster = new MarkerClusterer(map, 
		markers,
		{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});     
}

function heatMap() {
	isHeatmap = true;
	var heatmapData = [];
    var gradient = [
      'rgba(0, 255, 255, 0)',
      'rgba(0, 255, 210, 1)',
      'rgba(0, 255, 170, 1)',
      'rgba(0, 255, 130, 1)',
      'rgba(0, 255, 90, 1)',
      'rgba(0, 255, 50, 1)',
      'rgba(0, 255, 25, 1)',
      'rgba(0, 255, 0, 1)',
      'rgba(30, 255, 0, 1)',
      'rgba(60, 255, 0, 1)',
      'rgba(90, 255, 0, 1)',
      'rgba(130, 255, 0, 1)',
      'rgba(170, 255, 0, 1)',
      'rgba(210, 255, 0, 1)',
      'rgba(220, 255, 0, 1)',
      'rgba(235, 255, 0, 1)',
      'rgba(255, 255, 0, 1)',
      'rgba(255, 235, 0, 1)',
      'rgba(255, 220, 0, 1)',
      'rgba(255, 180, 0, 1)',
      'rgba(255, 140, 0, 1)',
      'rgba(255, 120, 0, 1)',
      'rgba(255, 80, 0, 1)',
      'rgba(255, 60, 0, 1)',
      'rgba(255, 40, 0, 1)',
      'rgba(255, 20, 0, 1)',
      'rgba(255, 0, 0, 1)',
    ]
    var gradients = new Array();
    gradients.push('rgba(0, 255, 255, 0)')
    // blue: rgb(0,0,255)
    for (var i = 0; i < 100; i++) {
    	var level = i/200;
    	var r = 0;
    	var g = parseInt(255);
    	var b = parseInt(255 * (0.5-level));
    	gradients.push('rgba(' + r.toString() +',' + g.toString() + ',' + b.toString() + ',1)');
    }
    // green: rgb(0,255,0)
    for (var i = 0; i < 100; i++) {
    	var level = i/200;
    	var r = parseInt(255 * level);
    	var g = parseInt(255 * (0.5-level));
    	var b = 0;
    	gradients.push('rgba(' + r.toString() +',' + g.toString() + ',' + b.toString() + ',1)');
    }
    // 1->red: rgb(255,0,0)

for (var i in jsonArr) {

	var currObj = jsonArr[i];

	var polarity = currObj["polarity"];
	var latLng = new google.maps.LatLng(currObj["coordinates"][1],currObj["coordinates"][0]);
	var weightedLoc = {
		location: latLng,
		weight: 1
		  //weight: Math.pow(2, polarity)
		};
		sentimentValue += parseFloat(polarity);
		heatmapData.push(weightedLoc);
	}

	heatmap = new google.maps.visualization.HeatmapLayer({
		data: heatmapData,
		dissipating: true,
		map: map            
	});

	heatmap.set('gradient', gradient);
	heatmap.set('radius', 16);
}

function showHeatmap(){
	if (!isHeatmap) {
		$("#graph").hide();
		$("#map").show();
		$("#text").html("");
		removeMarkers();     
		heatMap();
	}

}

function showSentiment(){
	if (isSentiment) {d3.selectAll("svg").remove();}

	isSentiment = true;
	$("#text").html("Overall sentiment is " + parseFloat(Math.round(sentimentValue * 100) / 100).toFixed(2) +"%");
	$("#map").hide();
	$("#graph").show();

	var sentiments = new Object();

	for (var i in jsonArr) {
		var currObj = jsonArr[i];
		var country = currObj["country"];
		var country_code = currObj["country_code"].toUpperCase();
		var polarity = currObj["polarity"];

		if(!sentiments.hasOwnProperty(country_code)){
			sentiments[country_code] = {
				"num_of_tweets" : 1,
				"polarity" : polarity,
				"country" : country
			}
		} else {
			var oldNum = sentiments[country_code]["num_of_tweets"];
			var oldPol = sentiments[country_code]["polarity"];
			sentiments[country_code]["num_of_tweets"]++;
			sentiments[country_code]["polarity"] = (oldPol * oldNum + polarity) / (oldNum + 1);
		}
	}





	// D3 Bubble Chart 

	var diameter = 500;

	var svg = d3.select('#graph').append('svg')
	.attr('width', diameter)
	.attr('height', diameter);

	var bubble = d3.layout.pack()
	.size([diameter, diameter])
	.value(function(d) {return d.size;})
	.padding(8);

	// generate data with calculated layout values
	var nodes = bubble.nodes(processData(sentiments))
							.filter(function(d) { return !d.children; }); // filter out the outer bubble
							var node = svg.selectAll('.node')
							.data(nodes)
							.enter().append("g")
							.attr("class", "node")
							.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

	node.append('circle').attr('r', function(d) { return d.r; }).style("fill", function(d) {
		console.log(d.polarity);
			  // parseInt(d.polarity);
		var color = getSentimentColor(d.polarity);
		console.log("rgb(" + color.red.toString() + ", " + color.green.toString() + ", 0)");
		return "rgb(" + parseInt(color.red).toString() + ", " + parseInt(color.green).toString() + ", 0)"
	});

	node.append('text')
			.attr("dy", ".3em")
			.style("text-anchor", "middle")
			.text(function(d) { return (d.r==0? "":d.className.toUpperCase()) });
			
	function processData(data) {
		var obj = data;
		var newDataSet = [];
		Object.keys(obj).forEach(function(curr){
			var currObj = {name: curr, className : curr,  size: parseInt(sentiments[curr]["num_of_tweets"]), polarity : parseFloat(sentiments[curr]["polarity"])};
			console.log(currObj);
			newDataSet.push(currObj);
		})
		// for(var prop in obj) {
		// 	console.log(parseInt(obj[prop]["tweets"]));
		// 	newDataSet.push({name: prop, className: prop.toLowerCase(), size: parseInt(obj[prop]["tweets"]), polarity: parseFloat(obj[prop]["polarity"])});
		// }
		return {children: newDataSet};
	}
}

function getSentimentColor(polarity) {
	// 0 as negative, 255 as positive
	var level = (polarity + 1) / 2 * 255;
	var green = level;
	var red = 255 - level;
	var obj = new Object();
	obj['green'] = green;
	obj['red'] = red;
	console.log("color: ");
	console.log(obj);
	return obj;
}

function attachWebView(marker, message) {
	var infowindow = new google.maps.InfoWindow({
		content: message,
		maxWidth: 200
	});
	marker.addListener('mouseover', function() {
		infowindow.open(marker.get('map'), marker);
	});
	marker.addListener('mouseout', function() {
		infowindow.close();
	});
}


function clearAll(){
	d3.selectAll("svg").remove();
	if (isSentiment) {
		$("#text").html("");
		$("#map").show();
		$("#graph").hide();
	}
	if ($("#search_box").val()) {
		$("#search_box").val("");
	}
	removeMarkers();
	initVariables();
	firstTime = true;
	if (isHeatmap) {
		$("#text").html("");
		heatmap.setMap(null);
	}
}

function removeMarkers() {
	markers.forEach(function(marker){
		marker.setMap(null);
		marker = null;
	});
	for ( var i=0; i < markerCluster.length; i++) {
		markerCluster[i].setMap(null);
	}
// markerCluster = new MarkerClusterer(map, 
//    markers,
//    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
	markerCluster.clearMarkers();
}

function reloadMap() {
	map.setCenter({lat: 29, lng: 28 });
	map.setZoom(2);
}


