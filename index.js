/*
Elaborado por Andrés David Chavarría Palma
Área de planificación regional
Ministerio de Planificación Regional
*Uso interno*
*/

//1. Inicializacion de mapa
var map = L.map('map');
map.setMaxZoom(13);
map.setMinZoom(7);

//2. Creacion de paneles
map.createPane('regiones');
map.getPane('regiones').style.zIndex = 410;
map.getPane('regiones').style.pointerEvents = 'none';

map.createPane('pob');
map.getPane('pob').style.zIndex = 420;

//3. Area limite
var limite = [[5.3984065477386203,-87.2473226597352749],[11.3239629393258152,-82.4451300157126923]];
L.rectangle(limite, {color: "#ff7800", weight: 1, fillOpacity: 0.3}).addTo(map);
map.fitBounds(limite);

//4. Creacion de boton de escala inicial
const boton1 = L.control({ position: 'topright' });
boton1.onAdd = () => {
    const buttonDiv = L.DomUtil.create('button', 'boton');

    buttonDiv.innerHTML = 'Volver a la escala inicial';
    buttonDiv.style.backgroundColor = '#04AA6D';
    buttonDiv.style.border = 'none';
    buttonDiv.style.color = 'white';
    buttonDiv.style.padding = '15px 32px';
    buttonDiv.style.textAlign = 'center';
    buttonDiv.style.textDecoration = 'none';
    buttonDiv.style.display = 'inline-block';
    buttonDiv.style.fontSize = '16px';
    buttonDiv.addEventListener('click', () => map.flyToBounds(limite,{duration:0.25}));
    return buttonDiv;
};
boton1.addTo(map)

//5. Panel de control de capas
control_capas = L.control.layers(null,null,{collapsed:false}).addTo(map);

//6. Distritos
function estilo_gj1(feature) {
        const value = feature.properties.proyectos;
        if (value > 20) {
            return { color: 'black', fillColor: '#045a8d', weight: 1, opacity: 1, fillOpacity: 1 };
        } else if (value > 15) {
            return { color: 'black', fillColor: '#2b8cbe', weight: 1, opacity: 1, fillOpacity: 1 };
        } else if (value > 10) {
            return { color: 'black', fillColor: '#74a9cf', weight: 1, opacity: 1, fillOpacity: 1 };
        } else if (value > 5) {
            return { color: 'black', fillColor: '#bdc9e1', weight: 1, opacity: 1, fillOpacity: 1 };
        } else if (value > 0) {
            return { color: 'black', fillColor: '#f1eef6', weight: 1, opacity: 1, fillOpacity: 1 };
        } else {
            return { color: 'black', fillColor: '#3d3d3d', weight: 1, opacity: 1, fillOpacity: 1 };
        }
};

function oef_gj1(feature, layer) {
    layer.bindPopup('Número de proyectos: ' + 
        feature.properties.proyectos +
        '<br>' +
        'Provincia: ' +
        feature.properties.provincia +
        '<br>' +
        'Cantón: ' +
        feature.properties.canton +
        '<br>' +
        'Distrito: ' +
        feature.properties.distrito);
};

fetch("./geojson/dist.json")
.then(res => res.json())
.then(data => {

capa = L.geoJson(data,{
    style: estilo_gj1,
    onEachFeature: oef_gj1
}).addTo(map);

});

    // 6.1 Leyenda
const legend = L.control({position: 'bottomright'});
legend.onAdd = () => {
    const div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += 'Proyectos de inversión pública' + '<br>' + '<br>';
    div.innerHTML += '<i style="background:#045a8d"></i> ' + '21 o más proyectos' + '<br>';
    div.innerHTML += '<i style="background:#2b8cbe"></i> ' + '16 - 20' + '<br>';
    div.innerHTML += '<i style="background:#74a9cf"></i> ' + '11 - 15' + '<br>';
    div.innerHTML += '<i style="background:#bdc9e1"></i> ' + '6 - 10' + '<br>';
    div.innerHTML += '<i style="background:#f1eef6"></i> ' + '1 - 5' + '<br>';
    div.innerHTML += '<i style="background:#3d3d3d"></i> ' + 'No hay proyectos';
    return div
};
legend.addTo(map);

const legend2 = L.control({position: 'bottomright'});
legend2.onAdd = () => {
    const div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += 'IDS (Área de desarrollo relativo)' + '<br>' + '<br>';
    div.innerHTML += '<i style="background:#1d8026"></i> ' + 'Mayor' + '<br>';
    div.innerHTML += '<i style="background:#83daaa"></i> ' + 'Medio' + '<br>';
    div.innerHTML += '<i style="background:#f4d1c7"></i> ' + 'Bajo' + '<br>';
    div.innerHTML += '<i style="background:#fa161e"></i> ' + 'Muy bajo' + '<br>';
    div.innerHTML += '<i style="background:#3d3d3d"></i> ' + 'No aplica';
    return div
};
legend2.addTo(map);

// 7. Regiones
fetch("./geojson/regiones.json")
.then(res => res.json())
.then(data => {

capa = L.geoJson(data,
    {
    color: '#cdda0f',
    fillOpacity: 0,
    pane:'regiones'
    }).addTo(map);
});

//8. Poblados
const puntos_simbologia = {
    radius: 5,
    fillColor: "#000",
    color: "#fff",
    weight: 2,
    opacity: 1,
    fillOpacity: 1,
    pane: 'pob'
};

fetch("./geojson/poblados.geojson")
.then(res => res.json())
.then(data => {

capa = L.geoJson(data,{
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng,puntos_simbologia);
    },
    onEachFeature: function(feature, layer) {
        layer.bindTooltip(feature.properties.NOMBRE)
    }
}).addTo(map);

});

//9. IDS
function estilo_gj2(feature) {
        const value2 = feature.properties.ard;
        if (value2 == 'Mayor') {
            return { color: 'black', fillColor: '#1d8026', weight: 1, opacity: 1, fillOpacity: 1 };
        } else if (value2 == 'Medio') {
            return { color: 'black', fillColor: '#83daaa', weight: 1, opacity: 1, fillOpacity: 1 };
        } else if (value2 == 'Bajo') {
            return { color: 'black', fillColor: '#f4d1c7', weight: 1, opacity: 1, fillOpacity: 1 };
        } else if (value2 == 'Muy bajo') {
            return { color: 'black', fillColor: '#fa161e', weight: 1, opacity: 1, fillOpacity: 1 };
        } else {
            return { color: 'black', fillColor: '#3d3d3d', weight: 1, opacity: 1, fillOpacity: 1 };
        }
};

function oef_gj2(feature, layer) {
    layer.bindPopup('Área de desarrollo relativo: ' + 
        feature.properties.ard +
        '<br>' +
        'Provincia: ' +
        feature.properties.provincia +
        '<br>' +
        'Cantón: ' +
        feature.properties.canton +
        '<br>' +
        'Distrito: ' +
        feature.properties.distrito);
};

fetch("./geojson/ids.geojson")
.then(res => res.json())
.then(data => {

capa = L.geoJson(data,
    {
        style:estilo_gj2,
        onEachFeature: oef_gj2
    }
);

control_capas.addOverlay(capa, 'IDS 2023');

});