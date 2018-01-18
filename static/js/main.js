// Global variables

// raw data array
var responseText;
var sampleStr;
var jsonArr;
// map object
var map;
// detail html for each tweet
var webViewArr;
var markers;
var markerCluster;
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
}

function getQuote() {

	var keyword = $("#search_box").val();
	$.ajax({
		url: 'http://tweetymap.us-east-2.elasticbeanstalk.com/searchKey',
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
}

function processData(response) {
	jsonArr = response;
	// 
	
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
	webViewArr = new Array(jsonArr.length);
	markers = new Array(jsonArr.length);

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
	removeMarkers();
	reloadMap();
	initVariables();
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
	// 	markers,
	// 	{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
	markerCluster.clearMarkers();
}

function reloadMap() {
	map.setCenter({lat: 29, lng: 28 });
	map.setZoom(2);
}


