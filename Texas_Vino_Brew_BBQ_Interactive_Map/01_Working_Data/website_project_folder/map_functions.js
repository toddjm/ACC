/**
 * Created by g0942179 on 10/19/2016.
 */
var map; // Initialize new Google Map
var RegionsLayer; // Regions Google Fusion Table Map overlay
var RegionsTable = "13QXyoXiSdVrQpu7XUHbJUv8ePprRFjiL-FpCXFpK"; // Regions Google Fusion Table
var RegionsColumn = "geometry"; // Regions Google Fusion Table column
var TrailsLayer; // Trails Google Fusion Table Map overlay
var TrailsTable = "1o_WRWBupRVT42rV3FhrFg25sxvtvvSasPuzx7CtL"; // Trails Google Fusion Table
var TrailsColumn = "geometry"; // Trails Google Fusion Table column
var VinoBrewBBQLayer; // Merge of Vino_Brew_BBQ and Markers Google Fusion Table Map overlay
var VinoBrewBBQTable = "1o1sezFZ4ACkNxdnaDXpLPZ1f50726NcnoAVXpkCM"; // Marge table ID
var VinoBrewBBQColumn = "geometry"; // Merge table column

// google.maps.LatLng class variables with centroid for Texas and each region
var TexasCentroid = new google.maps.LatLng (31.20616417, -99.98919937);
var BrazosCentroid = new google.maps.LatLng (31.0249185, -96.7867203428);
var ForestCentroid = new google.maps.LatLng (31.733945, -94.8448138846);
var FortsCentroid = new google.maps.LatLng (31.9826015, -99.449775469);
var HillCountryCentroid = new google.maps.LatLng (30.0381825, -98.8332940097);
var IndependenceCentroid = new google.maps.LatLng (29.2581915, -96.5145527265);
var LakesCentroid = new google.maps.LatLng (33.023145, -96.6150644396);
var MountainCentroid = new google.maps.LatLng (30.4871465, -104.026028443);
var PecosCentroid = new google.maps.LatLng (30.361035, -101.153074449);
var PlainsCentroid = new google.maps.LatLng (34.2930355, -101.259543199);
var TropicalCentroid = new google.maps.LatLng (27.312045, -98.4054598713);

function initialize() {
    google.maps.visualRefresh = true;
    var isMobile = (navigator.userAgent.toLowerCase().indexOf('android') > -1) ||
        (navigator.userAgent.match(/(iPod|iPhone|iPad|BlackBerry|Windows Phone|iemobile)/));
    if (isMobile) {
        var viewport = document.querySelector("meta[name=viewport]");
        viewport.setAttribute('content', 'initial-scale=1.0, user-scalable=no');
    }
    var mapDiv = document.getElementById('googft-mapCanvas');
    mapDiv.style.width = isMobile ? '100%' : '500px';
    mapDiv.style.height = isMobile ? '100%' : '500px';
    map = new google.maps.Map(mapDiv, {
        center: new google.maps.LatLng(31.319639241325053, -100.07709000000006),
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('googft-legend-open'));
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('googft-legend'));

    // Add Fusion Table Regions Map overlay
    RegionsLayer = new google.maps.FusionTablesLayer({
        map: map,
        heatmap: { enabled: false },
        query: {
            select: RegionsColumn,
            from: RegionsTable,
            where: ""
        },
        options: {
            styleId: 3,
            templateId: 3
        }
    });

    // Add Fusion Table Trails Map overlay
    TrailsLayer = new google.maps.FusionTablesLayer({
        map: map,
        heatmap: { enabled: false },
        query: {
            select: TrailsColumn,
            from: TrailsTable,
            where: ""
        },
        options: {
            styleId: 3,
            templateId: 3
        }
    });

    VinoBrewBBQLayer = new google.maps.FusionTablesLayer;
    ToggleLayer(VinoBrewBBQLayer, VinoBrewBBQTable, map);

    if (isMobile) {
        var legend = document.getElementById('googft-legend');
        var legendOpenButton = document.getElementById('googft-legend-open');
        var legendCloseButton = document.getElementById('googft-legend-close');
        legend.style.display = 'none';
        legendOpenButton.style.display = 'block';
        legendCloseButton.style.display = 'block';
        legendOpenButton.onclick = function() {
            legend.style.display = 'block';
            legendOpenButton.style.display = 'none';
        }
        legendCloseButton.onclick = function() {
            legend.style.display = 'none';
            legendOpenButton.style.display = 'block';
        }
    }
}

// Zoom to centroid of Texas or selected region
function ZoomRegion() {
    var option = document.getElementById('region').value;
    if (option == "Texas") {
        map.setCenter(TexasCentroid);
        map.setZoom(5);
    }
    else if (option == "Brazos") {map.setCenter(BrazosCentroid)}
    else if (option == "Forest") {map.setCenter(ForestCentroid)}
    else if (option == "Forts") {map.setCenter(FortsCentroid)}
    else if (option == "HillCountry") {map.setCenter(HillCountryCentroid)}
    else if (option == "Independence") {map.setCenter(IndependenceCentroid)}
    else if (option == "Lakes") {map.setCenter(LakesCentroid)}
    else if (option == "Mountain") {map.setCenter(MountainCentroid)}
    else if (option == "Pecos") {map.setCenter(PecosCentroid)}
    else if (option == "Plains") {map.setCenter(PlainsCentroid)}
    else if (option == "Tropical") {map.setCenter(TropicalCentroid)}
    map.setZoom(6);
}

// Enable autosearch dropdown.
function autoSearch() {
    var store = document.getElementById('store').value;
    if (store) {
        store = store.replace(/'/g, '\\\'');
        var where = "NAME CONTAINS IGNORING CASE '" +
            store + "'";

        VinoBrewBBQLayer.setOptions({
            query: {
                select: VinoBrewBBQColumn,
                from: VinoBrewBBQTable,
                where: where
            }
        });
    }
};

// Search VinoBrewBBQLayer based on using textbox input
function SearchLayer(VinoBrewBBQLayer, VinoBrewBBQTable, map) {
    var store = document.getElementById('StoreTextInput').value;
    var search = "NAME CONTAINS IGNORING CASE '" + store + "'";

    if (!VinoBrewBBQLayer.getMap()) {
        VinoBrewBBQLayer.setMap(map);
    }
    VinoBrewBBQLayer.setOptions({
        query: {
            select: VinoBrewBBQColumn,
            from: VinoBrewBBQTable,
            where: search
        },
    });
    // Check all toggle checkboxes when performing search.
    document.getElementById('WineryCheckbox').checked = true;
    document.getElementById('BreweryCheckbox').checked = true;
    document.getElementById('BBQStandCheckbox').checked = true;
}

// Filter VinoBrewBBQLayer based on checkbox selection.
function ToggleLayer(VinoBrewBBQLayer, VinoBrewBBQTable, map) {
    var where = generateWhere();

    if (where) {
        if (!VinoBrewBBQLayer.getMap()) {
            VinoBrewBBQLayer.setMap(map);
        }
        VinoBrewBBQLayer.setOptions({
            query: {
                select: VinoBrewBBQColumn,
                from: VinoBrewBBQTable,
                where: where
            },
            options: {
                styleId: 4,
                templateId: 4
            }
        });
    } else {
        VinoBrewBBQLayer.setMap(null);
    }
    // Clear search textbox when toggling layers.
    document.getElementById('StoreTextInput').value = "";
}

// Generate a where clause from the checkboxes. If no boxes
// are checked, return an empty string.
function generateWhere() {
    var filter = [];
    var boxes = document.getElementsByName('box');
    var where;

    for (var i = 0, box; box = boxes[i]; i++) {
        if (box.checked) {
            var boxName = box.value.replace(/'/g, '\\\'');
            filter.push("'" + boxName + "'");
        }
    }
    if (filter.length) {
        where = "'MARKER' IN (" + filter.join(',') + ')';
    }
    return where;
}

function drawMap(response) {
    var numRows = response.rows.length;

    // Create the list of results for display of autocomplete.
    var results = [];
    for (var i = 0; i < numRows; i++) {
        results.push(response.rows[i][0]);
    }

    // Use the results to create the autocomplete options.
    $('#store').autocomplete({
        source: results,
        minLength: 2
    });
};

google.maps.event.addDomListener(window, 'load', initialize);
