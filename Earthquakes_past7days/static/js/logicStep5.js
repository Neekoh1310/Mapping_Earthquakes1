
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

/// Create the earthquake layer
let earthquakes = new L.layerGroup();
/// Define an object that contains the overlays
let overlays = {
    Earthquakes: earthquakes
};

/// Pass map layers into layers control and add the layers control to map
/// allows user to change which layers are visible
L.control.layers(baseMaps, overlays).addTo(map);

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
            fillColor: getColor(feature.properties.mag),
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
    // This function determines the color of the circle based on the magnitude of the earthquake.
    function getColor(magnitude) {
        if (magnitude > 5) {
        return "#ea2c2c";
        }
        if (magnitude > 4) {
        return "#ea822c";
        }
        if (magnitude > 3) {
        return "#ee9c00";
        }
        if (magnitude > 2) {
        return "#eecc00";
        }
        if (magnitude > 1) {
        return "#d4ee00";
        }
        return "#98ee00";
    };

    // Add circle markers for each event
    L.geoJSON(data, {
        
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        // Create a popup for each circleMarker to display magnitude and location
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }

        }).addTo(earthquakes);
    
    ///Adds earthquakes Layer to Map
    earthquakes.addTo(map)


    ////////////// LEGEND //////////////////
    // create legend control object
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend');
            const magnitudes = [0, 1, 2, 3, 4, 5];
            const colors = [
                "#98ee00",
                "#d4ee00",
                "#eecc00",
                "#ee9c00",
                "#ea822c",
                "#ea2c2c"
                ];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < magnitudes.length; i++) {
            console.log(colors[i])
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
                // ? evaluates condition truthy/falsey and result_if_true : result_if_false
        }
    
        return div;
    };
    
    legend.addTo(map);
});