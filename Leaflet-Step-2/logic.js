//Plate Data
//var platesJSON = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

//Gray Mapbox background, Base Gray Layer
var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
})

//Satellite Layer
var satmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-satellite",
  accessToken: API_KEY
})


//Outdoors Layers https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?
var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
})

//  // Create overlay object to hold our overlay layer
//   var overlayMaps = {
//     Earthquakes: earthquakes,
//     Plates: plates
//   }; 

var faults = L.tileLayer("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json", {
  maxZoom: 18,
})
var geoData = L.tileLayer("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",{
  maxZoom: 18,
})

// Creating map object
var myMap = L.map("map", {
  center: [38.89511, -77.03637],
  zoom: 6,
  layers: [graymap, satmap, outdoors, faults, geoData]

});

graymap.addTo(myMap)


var basemaps = {
  "Satellite Map": satmap,
  "Gray Map": graymap, 
  "Outdoors": outdoors,
  "Earthquakes": geoData,
  "Plates": faults
}

L.control.layers(basemaps).addTo(myMap)

// Load in geojson data
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Grab data with d3
d3.json(geoData, function (data) {

  // Perform a GET request to the query URL
  d3.json(faults, function(data2) {
    //createFeatures(data.features, data2.features);
    })

  // This function returns the style data for each of the earthquakes we plot on
  // the map. We pass the magnitude of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // This function determines the color of the marker based on the magnitude of the earthquake.
  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#eecc00";
    case magnitude > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }


  L.geoJson(data, {

    pointToLayer: function (feature, latlong){
      return L.circleMarker(latlong);
    },

    style: styleInfo,

    

    // Binding a pop-up to each layer
    onEachFeature: function (feature, layer) {

      layer.bindPopup("Earthquake Magnitude: " + feature.properties.mag + "<br>Earthquake Location:<br>" + feature.properties.place);
    }
  }).addTo(myMap);

//add legend on Bottom Right Corner
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  //Dom Utility that puts legend into DIV & Info Legend
  var div = L.DomUtil.create('div', 'info legend'),
    //Magnitude Grades, stops at 5 magnitude
    grades = [0, 1, 2, 3, 4, 5];
    
  //Legend Label Earthquake <break> Magnitude  
  div.innerHTML+='Eathquake<br>Magnitude<br><hr>'

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};
//Adds Legend to myMap
legend.addTo(myMap);

});


