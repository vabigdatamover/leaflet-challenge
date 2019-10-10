// Creating map object
var myMap = L.map("map", {
  center: [38.89511, -77.03637],
  zoom: 6
});

// Initialize all of the LayerGroups we'll be using
var layers = {
  SATELLITE: new L.LayerGroup(),
  GREYSCALE: new L.LayerGroup(),
  OUTDOORS: new L.LayerGroup(),
  FAULT_LINE: new L.LayerGroup(),
  EARTHQUAKES: new L.LayerGroup()
};

// Create the map with our layers
var map = L.map("map-id", {
  center: [38.89511, -77.03637],
  zoom: 6,
  layers: [
    layers.SATELLITE,
    layers.GREYSCALE,
    layers.OUTDOORS,
    layers.FAULT_LINE,
    layers.EARTHQUAKES
  ]
});

var overlays = {
  "Satellite": layers.SATELLITE,
  "Greyscale": layers.GREYSCALE,
  "Outdoors": layers.OUTDOORS,
  "Fault Line": layers.FAULT_LINE,
  "Earthquakes": layers.EARTHQUAKES
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Adding tile layer
// L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.streets",
//   accessToken: API_KEY
// }).addTo(myMap);

//Gray Map Option
//var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
 attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
 maxZoom: 18,
 id: "mapbox.streets",
 accessToken: API_KEY
}).addTo(myMap);

// Load in geojson data
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var geojson;

//Grab data with d3
d3.json(geoData, function(data) {

  // Create a new choropleth layer
  geojson = L.choropleth(data, {

    // Define what  property in the features to use
    // valueProperty: "MHI2016",

    // Set color scale
    scale: ["#3e7f22", "#7f4f22"],

    // Number of breaks in step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Earthquake Magnitude: " + feature.properties.mag + "<br>Earthquake Location:<br>" + feature.properties.place);
    }
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Earthquake Scale</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

  // When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map
info.addTo(map);

});


