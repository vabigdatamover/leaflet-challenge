// Creating map object
var map = L.map("map", {
    //DC lat & lon with a wide focus of 6
    center: [38.89511, -77.03637],
    zoom: 6
  });
  
  // Adding tile layer
 
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 11,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(map);


  
  // Earthquake GeoJSON variable

  var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  
  
  // Grabbing our GeoJSON data..
  d3.json(link, function(data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data).addTo(map);
  });
  
  