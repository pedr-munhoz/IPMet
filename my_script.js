var cities = {
   counter : 0,
   0 : 1
};

function reqListener () {
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "prev.xml");
oReq.send();
var my_xml;
var jsonText;


function loadDataToHTML(){
   // extraia a 'location' do HTTP GET ou URI
   var city = window.location.search.substr(10,1000);
   if (city === ""){
      city = 0;
   }

   var data = cities[city];
   if (data == undefined){
      city = 0;
      data = cities[city];
   }

   my_xml = oReq.responseXML;
   jsonText = JSON.stringify(xmlToJson(my_xml));
   attCities(jsonText);

   document.getElementById("city_name").textContent = data["name"];
   document.getElementById("city_max").textContent = data["max"];
   document.getElementById("city_min").textContent = data["min"];
   //document.getElementById("city_updated").textContent = data["updated"];
}

// Changes XML to JSON
function xmlToJson(xml) {

	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
      	// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};

function attCities(jt) {
   var x = JSON.parse(jt);
   var c;
   for(var i=0;i<20;i++){
      c = true;
      for(var j=0; j<cities.counter;j++){
         if(cities[j]["name"] == x["previsao-cidades"].cidade[i]["@attributes"].nome){
            cities[j].max = x["previsao-cidades"].cidade[i]["temperatura-maxima"]["#text"];
            cities[j].min = x["previsao-cidades"].cidade[i]["temperatura-minima"]["#text"];
            c = false;
         }
      }
      if(c){
         cities[cities.counter] = {
            name : x["previsao-cidades"].cidade[i]["@attributes"].nome,
            max : x["previsao-cidades"].cidade[i]["temperatura-maxima"]["#text"],
            min : x["previsao-cidades"].cidade[i]["temperatura-minima"]["#text"]
         };
         var art = document.getElementById("cities_list");
         if (art != null) {
            var new_button = document.createElement("A");
            new_button.text = cities[cities.counter]["name"];
            new_button.href = "index.html?location=" + cities.counter;
            art.add(new_button);
            cities[cities.counter]["name"] = x["previsao-cidades"].cidade[i]["@attributes"].nome;
            cities[cities.counter].max = x["previsao-cidades"].cidade[i]["temperatura-maxima"]["#text"];
            cities[cities.counter].min = x["previsao-cidades"].cidade[i]["temperatura-minima"]["#text"];
         }
         (cities.counter)++;
      }
   }
}

function load() {
   console.log("dzxnthed");
   var art = document.getElementById("cities_list");
   if (art == null){
      loadDataToHTML();
      loadDataToHTML();
   }
}

window.addEventListener('load', load, false );
