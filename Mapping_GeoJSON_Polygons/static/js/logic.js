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
    'Satellite Streets': satelliteStreets
};

// Create the map object with center, zoom level and default layer.
// ALT method to set the view. //let map = L.map('mapid').setView([30, 30], 2);
let map = L.map('mapid', {
    center: [43.7, -79.3],
    zoom: 11,
    layers: [streets]
});
// Pass map layers into layers control and add the layers control to map
L.control.layers(baseMaps).addTo(map);

// Accessing the Toronto neighborhoods GeoJSON URL.
let torontoHoods = "https://raw.githubusercontent.com/Neekoh1310/Mapping_Earthquakes1/main/torontoNeighborhoods.json";
// Grabbing GeoJSON data 
d3.json(torontoHoods).then(function(data) {
    console.log(data);
    //Create GeoJSON layer with the retrieved data
    L.geoJSON(data, {
        style: function(feature) {
            return {
                color: "blue",
                weight: 1,
                fillColor: "yellow"
            }        
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h2>" + feature.properties.AREA_NAME + "<h2>")
        }
    }).addTo(map);
});