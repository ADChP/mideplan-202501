var map = L.map('map').setView([9.70, -84.2], 8);



function getFeatureStyle(feature) {
        const value = feature.properties.proyectos;

        if (value > 21) {
            return { color: 'black', fillColor: '#045a8d', weight: 1, opacity: 1, fillOpacity: 1 };
        } else if (value > 15) {
            return { color: 'black', fillColor: '#2b8cbe', weight: 1, opacity: 1, fillOpacity: 1 };
        } else if (value > 10) {
            return { color: 'black', fillColor: '#74a9cf', weight: 1, opacity: 1, fillOpacity: 1 };
        } else if (value > 5) {
            return { color: 'black', fillColor: '#bdc9e1', weight: 1, opacity: 1, fillOpacity: 1 };
        } else if (value > 0) {
            return { color: 'black', fillColor: '#f1eef6', weight: 1, opacity: 1, fillOpacity: 1 };
        }
        else {
            return { color: 'black', fillColor: '#3d3d3d', weight: 1, opacity: 1, fillOpacity: 1 };
        }
};


function onEachFeature(feature, layer) {
    layer.bindPopup('Número de proyectos: ' + feature.properties.proyectos);
};

/*function filtro(feature, layer) {
        const value = feature.properties.codigo_dist;

        if (value == 60110) {
            return false;
        } else {
            return true;
        }
};*/

fetch("./geojson/dist.json")
.then(res => res.json())
.then(data => {L.geoJson(data,{
    style: getFeatureStyle,
    onEachFeature: onEachFeature
    //filter: filtro
}).addTo(map);});