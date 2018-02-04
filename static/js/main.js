// Global variables

// raw data array
var responseText;
var sampleStr;
var jsonArr;
// map object
var map;
var heatmap;
// detail html for each tweet
var webViewArr;
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
		url: 'http://tweetymap.us-east-2.elasticbeanstalk.com//searchKey',
		// url: 'http://tweetymap.us-east-2.elasticbeanstalk.com/searchKey',
		type: 'GET',
	//dataType: 'json',
	data: {'getQuote': keyword},
	})
	.done(function(response) {
		console.log("success");
		responseText = response;
		processData(JSON.parse(response)["results"]);

	// heatMap();
	addMarkers();
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	firstTime = false;
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

function heatMap() {
	isHeatmap = true;
	var heatmapData = [];
	// var gradient = [
	// 	'rgba(0, 255, 255, 0)',
	// 	'rgba(0, 255, 255, 1)',
	// 	'rgba(0, 191, 255, 1)',
	// 	'rgba(0, 127, 255, 1)',
	// 	'rgba(0, 63, 255, 1)',
	// 	'rgba(0, 0, 255, 1)',
	// 	'rgba(0, 0, 223, 1)',
	// 	'rgba(0, 0, 191, 1)',
	// 	'rgba(0, 0, 159, 1)',
	// 	'rgba(0, 0, 127, 1)',
	// 	'rgba(63, 0, 91, 1)',
	// 	'rgba(127, 0, 63, 1)',
	// 	'rgba(191, 0, 31, 1)',
	// 	'rgba(255, 0, 0, 1)'
	// ]
	// var gradient = [
 //          'rgba(0, 255, 255, 0)',
 //          'rgba(0, 255, 255, 1)',
 //          'rgba(0, 191, 255, 1)',
 //          'rgba(0, 127, 255, 1)',
 //          'rgba(0, 63, 255, 1)',
 //          'rgba(0, 0, 255, 1)',
 //          'rgba(0, 0, 223, 1)',
 //          'rgba(0, 0, 191, 1)',
 //          'rgba(0, 0, 159, 1)',
 //          'rgba(0, 0, 127, 1)',
 //          'rgba(63, 0, 91, 1)',
 //          'rgba(127, 0, 63, 1)',
 //          'rgba(191, 0, 31, 1)',
 //          'rgba(255, 0, 0, 1)'
 //        ]
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

	// var json = {"countries_msg_vol": {
	// 	"CA": {"tweets": 0, "polarity": 0},"GB": {"tweets": 0, "polarity": 0},"AU": {"tweets": 0, "polarity": 0},"DE": {"tweets": 0, "polarity": 0},"AX": {"tweets": 0, "polarity": 0},"AF": {"tweets": 0, "polarity": 0},"AL": {"tweets": 0, "polarity": 0},"DZ": {"tweets": 0, "polarity": 0},"AS": {"tweets": 0, "polarity": 0},"AD": {"tweets": 0, "polarity": 0},
	// 	"AO": {"tweets": 0, "polarity": 0},"AI": {"tweets": 0, "polarity": 0},"AQ": {"tweets": 0, "polarity": 0},"AG": {"tweets": 0, "polarity": 0},"AR": {"tweets": 0, "polarity": 0},"AM": {"tweets": 0, "polarity": 0},"AW": {"tweets": 0, "polarity": 0},"AU": {"tweets": 0, "polarity": 0},"AT": {"tweets": 0, "polarity": 0},"AZ": {"tweets": 0, "polarity": 0},
	// 	"BS": {"tweets": 0, "polarity": 0},"BH": {"tweets": 0, "polarity": 0},"BD": {"tweets": 0, "polarity": 0},"BB": {"tweets": 0, "polarity": 0},"BY": {"tweets": 0, "polarity": 0},"BE": {"tweets": 0, "polarity": 0},"BZ": {"tweets": 0, "polarity": 0},"BJ": {"tweets": 0, "polarity": 0},"BM": {"tweets": 0, "polarity": 0},"BT": {"tweets": 0, "polarity": 0},
	// 	"BO": {"tweets": 0, "polarity": 0},"BA": {"tweets": 0, "polarity": 0},"BW": {"tweets": 0, "polarity": 0},"BV": {"tweets": 0, "polarity": 0},"BR": {"tweets": 0, "polarity": 0},"IO": {"tweets": 0, "polarity": 0},"BN": {"tweets": 0, "polarity": 0},"BG": {"tweets": 0, "polarity": 0},"BF": {"tweets": 0, "polarity": 0},"BI": {"tweets": 0, "polarity": 0},
	// 	"KH": {"tweets": 0, "polarity": 0},"CM": {"tweets": 0, "polarity": 0},"CA": {"tweets": 0, "polarity": 0},"CV": {"tweets": 0, "polarity": 0},"KY": {"tweets": 0, "polarity": 0},"CF": {"tweets": 0, "polarity": 0},"TD": {"tweets": 0, "polarity": 0},"CL": {"tweets": 0, "polarity": 0},"CN": {"tweets": 0, "polarity": 0},"CX": {"tweets": 0, "polarity": 0},
	// 	"CC": {"tweets": 0, "polarity": 0},"CO": {"tweets": 0, "polarity": 0},"KM": {"tweets": 0, "polarity": 0},"CG": {"tweets": 0, "polarity": 0},"CD": {"tweets": 0, "polarity": 0},"CK": {"tweets": 0, "polarity": 0},"CR": {"tweets": 0, "polarity": 0},"CI": {"tweets": 0, "polarity": 0},"HR": {"tweets": 0, "polarity": 0},"CU": {"tweets": 0, "polarity": 0},
	// 	"CY": {"tweets": 0, "polarity": 0},"CZ": {"tweets": 0, "polarity": 0},"DK": {"tweets": 0, "polarity": 0},"DJ": {"tweets": 0, "polarity": 0},"DM": {"tweets": 0, "polarity": 0},"DO": {"tweets": 0, "polarity": 0},"TP": {"tweets": 0, "polarity": 0},"EC": {"tweets": 0, "polarity": 0},"EG": {"tweets": 0, "polarity": 0},"SV": {"tweets": 0, "polarity": 0},
	// 	"GQ": {"tweets": 0, "polarity": 0},"ER": {"tweets": 0, "polarity": 0},"EE": {"tweets": 0, "polarity": 0},"ET": {"tweets": 0, "polarity": 0},"FK": {"tweets": 0, "polarity": 0},"FO": {"tweets": 0, "polarity": 0},"FJ": {"tweets": 0, "polarity": 0},"FI": {"tweets": 0, "polarity": 0},"FR": {"tweets": 0, "polarity": 0},"FX": {"tweets": 0, "polarity": 0},
	// 	"GF": {"tweets": 0, "polarity": 0},"PF": {"tweets": 0, "polarity": 0},"TF": {"tweets": 0, "polarity": 0},"GA": {"tweets": 0, "polarity": 0},"GM": {"tweets": 0, "polarity": 0},"GE": {"tweets": 0, "polarity": 0},"DE": {"tweets": 0, "polarity": 0},"GH": {"tweets": 0, "polarity": 0},"GI": {"tweets": 0, "polarity": 0},"GR": {"tweets": 0, "polarity": 0},
	// 	"GL": {"tweets": 0, "polarity": 0},"GD": {"tweets": 0, "polarity": 0},"GP": {"tweets": 0, "polarity": 0},"GU": {"tweets": 0, "polarity": 0},"GT": {"tweets": 0, "polarity": 0},"GG": {"tweets": 0, "polarity": 0},"GN": {"tweets": 0, "polarity": 0},"GW": {"tweets": 0, "polarity": 0},"GY": {"tweets": 0, "polarity": 0},"HT": {"tweets": 0, "polarity": 0},
	// 	"HM": {"tweets": 0, "polarity": 0},"HN": {"tweets": 0, "polarity": 0},"HU": {"tweets": 0, "polarity": 0},"IS": {"tweets": 0, "polarity": 0},"IN": {"tweets": 0, "polarity": 0},"ID": {"tweets": 0, "polarity": 0},"IR": {"tweets": 0, "polarity": 0},"IQ": {"tweets": 0, "polarity": 0},"IE": {"tweets": 0, "polarity": 0},"IM": {"tweets": 0, "polarity": 0},
	// 	"IL": {"tweets": 0, "polarity": 0},"IT": {"tweets": 0, "polarity": 0},"JM": {"tweets": 0, "polarity": 0},"JP": {"tweets": 0, "polarity": 0},"JE": {"tweets": 0, "polarity": 0},"JO": {"tweets": 0, "polarity": 0},"KZ": {"tweets": 0, "polarity": 0},"KE": {"tweets": 0, "polarity": 0},"KI": {"tweets": 0, "polarity": 0},"KR": {"tweets": 0, "polarity": 0},
	// 	"KP": {"tweets": 0, "polarity": 0},"KW": {"tweets": 0, "polarity": 0},"KG": {"tweets": 0, "polarity": 0},"LA": {"tweets": 0, "polarity": 0},"LV": {"tweets": 0, "polarity": 0},"LB": {"tweets": 0, "polarity": 0},"LS": {"tweets": 0, "polarity": 0},"LR": {"tweets": 0, "polarity": 0},"LY": {"tweets": 0, "polarity": 0},"LI": {"tweets": 0, "polarity": 0},
	// 	"LT": {"tweets": 0, "polarity": 0},"LU": {"tweets": 0, "polarity": 0},"MO": {"tweets": 0, "polarity": 0},"MK": {"tweets": 0, "polarity": 0},"MG": {"tweets": 0, "polarity": 0},"MW": {"tweets": 0, "polarity": 0},"MY": {"tweets": 0, "polarity": 0},"MV": {"tweets": 0, "polarity": 0},"ML": {"tweets": 0, "polarity": 0},"MT": {"tweets": 0, "polarity": 0},
	// 	"MH": {"tweets": 0, "polarity": 0},"MQ": {"tweets": 0, "polarity": 0},"MR": {"tweets": 0, "polarity": 0},"MU": {"tweets": 0, "polarity": 0},"YT": {"tweets": 0, "polarity": 0},"MX": {"tweets": 0, "polarity": 0},"FM": {"tweets": 0, "polarity": 0},"MD": {"tweets": 0, "polarity": 0},"MC": {"tweets": 0, "polarity": 0},"MN": {"tweets": 0, "polarity": 0},
	// 	"ME": {"tweets": 0, "polarity": 0},"MS": {"tweets": 0, "polarity": 0},"MA": {"tweets": 0, "polarity": 0},"MZ": {"tweets": 0, "polarity": 0},"MM": {"tweets": 0, "polarity": 0},"NA": {"tweets": 0, "polarity": 0},"NR": {"tweets": 0, "polarity": 0},"NP": {"tweets": 0, "polarity": 0},"NL": {"tweets": 0, "polarity": 0},"AN": {"tweets": 0, "polarity": 0},
	// 	"NC": {"tweets": 0, "polarity": 0},"NZ": {"tweets": 0, "polarity": 0},"NI": {"tweets": 0, "polarity": 0},"NE": {"tweets": 0, "polarity": 0},"NG": {"tweets": 0, "polarity": 0},"NU": {"tweets": 0, "polarity": 0},"NF": {"tweets": 0, "polarity": 0},"MP": {"tweets": 0, "polarity": 0},"NO": {"tweets": 0, "polarity": 0},"OM": {"tweets": 0, "polarity": 0},
	// 	"PK": {"tweets": 0, "polarity": 0},"PW": {"tweets": 0, "polarity": 0},"PS": {"tweets": 0, "polarity": 0},"PA": {"tweets": 0, "polarity": 0},"PG": {"tweets": 0, "polarity": 0},"PY": {"tweets": 0, "polarity": 0},"PE": {"tweets": 0, "polarity": 0},"PH": {"tweets": 0, "polarity": 0},"PN": {"tweets": 0, "polarity": 0},"PL": {"tweets": 0, "polarity": 0},
	// 	"PT": {"tweets": 0, "polarity": 0},"PR": {"tweets": 0, "polarity": 0},"QA": {"tweets": 0, "polarity": 0},"RO": {"tweets": 0, "polarity": 0},"RU": {"tweets": 0, "polarity": 0},"RW": {"tweets": 0, "polarity": 0},"SH": {"tweets": 0, "polarity": 0},"KN": {"tweets": 0, "polarity": 0},"LC": {"tweets": 0, "polarity": 0},"PM": {"tweets": 0, "polarity": 0},
	// 	"VC": {"tweets": 0, "polarity": 0},"WS": {"tweets": 0, "polarity": 0},"SM": {"tweets": 0, "polarity": 0},"ST": {"tweets": 0, "polarity": 0},"SA": {"tweets": 0, "polarity": 0},"SN": {"tweets": 0, "polarity": 0},"RS": {"tweets": 0, "polarity": 0},"SC": {"tweets": 0, "polarity": 0},"SL": {"tweets": 0, "polarity": 0},"SG": {"tweets": 0, "polarity": 0},
	// 	"SK": {"tweets": 0, "polarity": 0},"SI": {"tweets": 0, "polarity": 0},"SB": {"tweets": 0, "polarity": 0},"SO": {"tweets": 0, "polarity": 0},"ZA": {"tweets": 0, "polarity": 0},"ES": {"tweets": 0, "polarity": 0},"LK": {"tweets": 0, "polarity": 0},"SD": {"tweets": 0, "polarity": 0},"SR": {"tweets": 0, "polarity": 0},"SJ": {"tweets": 0, "polarity": 0},
	// 	"SZ": {"tweets": 0, "polarity": 0},"SE": {"tweets": 0, "polarity": 0},"CH": {"tweets": 0, "polarity": 0},"SY": {"tweets": 0, "polarity": 0},"TW": {"tweets": 0, "polarity": 0},"TJ": {"tweets": 0, "polarity": 0},"TZ": {"tweets": 0, "polarity": 0},"TH": {"tweets": 0, "polarity": 0},"TL": {"tweets": 0, "polarity": 0},"TG": {"tweets": 0, "polarity": 0},
	// 	"TK": {"tweets": 0, "polarity": 0},"TO": {"tweets": 0, "polarity": 0},"TT": {"tweets": 0, "polarity": 0},"TN": {"tweets": 0, "polarity": 0},"TR": {"tweets": 0, "polarity": 0},"TM": {"tweets": 0, "polarity": 0},"TC": {"tweets": 0, "polarity": 0},"TV": {"tweets": 0, "polarity": 0},"UG": {"tweets": 0, "polarity": 0},"UA": {"tweets": 0, "polarity": 0},
	// 	"AE": {"tweets": 0, "polarity": 0},"GB": {"tweets": 0, "polarity": 0},"US": {"tweets": 0, "polarity": 0},"UM": {"tweets": 0, "polarity": 0},"UY": {"tweets": 0, "polarity": 0},"UZ": {"tweets": 0, "polarity": 0},"VU": {"tweets": 0, "polarity": 0},"VA": {"tweets": 0, "polarity": 0},"VE": {"tweets": 0, "polarity": 0},"VN": {"tweets": 0, "polarity": 0},
	// 	"VG": {"tweets": 0, "polarity": 0},"VI": {"tweets": 0, "polarity": 0},"WF": {"tweets": 0, "polarity": 0},"YE": {"tweets": 0, "polarity": 0},"ZM": {"tweets": 0, "polarity": 0},"ZW": {"tweets": 0, "polarity": 0}
	// }};

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


