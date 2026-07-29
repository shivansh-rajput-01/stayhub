let map;
if (l.geometry.coordinates.length != 0) {
  map = L.map("map").setView(
    [l.geometry.coordinates[1], l.geometry.coordinates[0]],
    13,
  );
} else {
  map = L.map("map").setView([28.61, 77.23], 13);
}
L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 12,
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
  },
).addTo(map);

let marker, circle;

if (l.geometry.coordinates.length != 0) {
  marker = L.marker([
    l.geometry.coordinates[1],
    l.geometry.coordinates[0],
  ]).addTo(map);
  circle = L.circleMarker(
    [l.geometry.coordinates[1], l.geometry.coordinates[0]],
    {
      color: "red", // Border color
      fillColor: "#f03", // Circle inner color
      fillOpacity: 0.5,
      radius: 50,
    },
  ).addTo(map);
  marker.bindPopup(
    `<b>${l.title}</b><br>Exact Location will be available after booking`,
  );
} else {
  marker = L.marker([28.61, 77.23]).addTo(map);
  marker.bindPopup("<b>Hello world!</b><br>I am a popup.");
}
