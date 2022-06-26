
// We create the tile layer that will be the background of our map.
// Mapbox Styles API.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'streets-v11',
    accessToken: API_KEY
});
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'satellite-streets-v11',
    accessToken: API_KEY
});
// Create a base layer that holds both maps
let baseMaps = {
    Streets: streets,
    Satellite: satelliteStreets
};

// Create the map object with center, zoom level and default layer.
// ALT method to set the view. //let map = L.map('mapid').setView([30, 30], 2);
let map = L.map('mapid', {
    center: [39.5, -98.5],
    zoom: 3,
    layers: [streets]
});
// Pass map layers into layers control and add the layers control to map
L.control.layers(baseMaps).addTo(map);

// Retrieve the earthquake GeoJSON data.
let earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(earthquakeData).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data.
    console.log(data);
    //Function returns style data for earthquakes we plot.  Pass in the magnitude of eq to 
    //calculate radius
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: "#ffae42",
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    };
    // This function determines the radius of the earthquake marker based on its magnitude.
    // Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
    function getRadius(magnitude) {
        if (magnitude === 0) {
        return 1;
        }
        return magnitude * 4;
    };
    // Add circle markers for each event
    L.geoJSON(data, {
        // Add circleMarkers for each feature
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        // Set style using style function
        style: styleInfo
    }).addTo(map);
});
