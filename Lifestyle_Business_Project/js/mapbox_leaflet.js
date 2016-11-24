/**
 * Created by Todd on 11/23/2016.
 */
var mymap = L.map('mapid').setView([17.182376, -88.976662], 10);
var mbURL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidG9kZG00OSIsImEiOiJjaXZpcHRvNncwMWYwMnVsdjJpaHA0bGFsIn0.wdmjaSOZF78xmDuruV5V0w';
var mbAttr =  'ACC GIS | Icons Courtesy of <a href="https://mapicons.mapsmarker.com">Map Icons Collection</a> | Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';

// Mapbox basemap and layer toggle control
outdoors = L.tileLayer(mbURL, {
    attribution: mbAttr,
    maxZoom: 18,
    id: 'mapbox.outdoors',
}).addTo(mymap);

satellite = L.tileLayer(mbURL, {
    attribution: mbAttr,
    maxZoom: 18,
    id: 'mapbox.satellite',
});

runBikeHike = L.tileLayer(mbURL, {
    attribution: mbAttr,
    maxZoom: 18,
    id: 'mapbox.run-bike-hike',
});

var baseLayers = {
    "Terrain": outdoors,
    "Satellite": satellite,
    "Run-Bike-Hike": runBikeHike
};


var birdIcon = L.icon({
    iconUrl: 'img/bird_icon.png',

    iconSize:     [32, 37], // size of the icon
    iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -37] // point from which the popup should open relative to the iconAnchor
});

var hotelIcon = L.icon({
    iconUrl: 'img/hotel_icon.png',

    iconSize:     [32, 37], // size of the icon
    iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -37] // point from which the popup should open relative to the iconAnchor
});

// Add business location with custom marker in Leaflet
var marker = L.marker([17.182376, -88.976662], {icon: birdIcon}).addTo(mymap);
marker.bindPopup("<strong>Birds of Belize</strong><br>Cayo District, Belize").openPopup();

// Add nearby locations of resorts as GeoJSON layer with custom icons
var hotelLayer = L.geoJson(birdResorts, {
    onEachFeature: geojsonPopup,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon: hotelIcon});
    }
}).addTo(mymap);

// Bind popup to GeoJSON feature with 'name' attribute from GeoJSON file
function geojsonPopup(feature, layer) {
    if (feature.properties.name) {
        layer.bindPopup(feature.properties.name);
    }
}

var featureLayers = {
    "Bird-watching Resorts": hotelLayer
};

L.control.layers(baseLayers, featureLayers).addTo(mymap);