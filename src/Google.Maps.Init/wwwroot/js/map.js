
var map = null;
var mapOptions = {
    minZoomLevel: 3

}
function initMap() {
    var mapdiv = document.getElementById("map");
    if (mapdiv) {
        map = new google.maps.Map(mapdiv, {
            zoom: 4,
            center: { lat: 13.046034415549146, lng: 80.321044921875 }
        });
                
        var posStart = new google.maps.LatLng(-85,-180);
        var posEnd = new google.maps.LatLng(85,180);
        var allowedBounds = new google.maps.LatLngBounds(posStart, posEnd);                

        google.maps.event.addListener(map, "click", function (e) {
            console.log("Lat: " + e.latLng.lat());
            console.log("Lng: " + e.latLng.lng());
        });

        google.maps.event.addListener(map, 'zoom_changed', function () {
            if (map.getZoom() < mapOptions.minZoomLevel) { map.setZoom(mapOptions.minZoomLevel); };
        });

        google.maps.event.addListener(map, 'center_changed', function () { checkBounds(); });

        function checkBounds() {
            if ((allowedBounds.getNorthEast().lat() > (map.getBounds().getNorthEast().lat()))
                && (allowedBounds.getSouthWest().lat() < (map.getBounds().getSouthWest().lat()))) {
                lastValidCenter = map.getCenter();                
                return;
            }
            map.panTo(lastValidCenter);            
        }
    }
}
function detectBrowser() {
    debugger;
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map");
    if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1) {
        mapdiv.style.width = '100%';
        mapdiv.style.height = '100%';
    } else {
        mapdiv.style.width = '600px';
        mapdiv.style.height = '800px';
    }
}
document.addEventListener("load", detectBrowser);
