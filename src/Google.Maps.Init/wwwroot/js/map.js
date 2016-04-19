
(function (w) {
    w['kjsmap'] = {
        map: null,
        Circle:undefined,
        mapOptions: {
            minZoomLevel: 3,
            center: { lat: 13.046034415549146, lng: 80.321044921875 }
        },
        SetPosition: function (s, v) {
            var self = this;
            ajax.call({
                url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + v,
                isasync: true,
                type: 'GET',
                success: function (data) {
                    var output = JSON.parse(data);
                    if (output.status === google.maps.GeocoderStatus.OK) {
                        s.Position = output.results[0].geometry.location;
                        var address = self.Parser.Address(output.results[0].address_components);
                        s.Marker = new google.maps.Marker({
                            position: new google.maps.LatLng(s.Position.lat, s.Position.lng),
                            city_name: address.locality,
                            country_code: address.country,
                            optimized: false,
                            id: output.results[0].place_id
                        });
                        s.Marker.setMap(self.map);
                    }
                }
            });
        },
        Parser: {
            Address: function (add) {
                var components = {};
                add.forEach(function (v1, k) {
                    v1.types.forEach(function (v2,k2) {
                        components[v2] = v1.long_name
                    });
                })
                return components;
            }
        },
        Form: {
            FromPort: {
                Value: '',
                Position: {},
                Marker: null,
                OnChange: function (s, e) {
                    this.Value = s.value;
                    kjsmap.SetPosition(this, this.Value);
                }
            },
            ToPort: {
                Value: '',
                Position: {},
                OnChange: function (s, e) {
                    this.Value = s.value;
                    kjsmap.SetPosition(this, this.Value);
                }
            },
            Search: function (s, e) {
                var start = this.FromPort.Marker.position;
                var end = this.ToPort.Marker.position;
                kjsmap.Direction.Service(!0,{
                    origin: start,
                    destination: end,
                    travelMode: google.maps.DirectionsTravelMode.TRANSIT,
                    transitOptions: { modes: [google.maps.TransitMode.TRAIN] }
                });
            },
            RangeChanged: function (s, e) {
                kjsmap.Circle.setRadius(s.value * 1000);
            }
        },
        RouteData:null,
        RoutesView: function (f) {
            if (f) {
                if (this.RouteData === null) {
                    var self = this;
                    ajax.call({
                        url: 'http://localhost:8081',
                        isasync: true,
                        type: 'GET',
                        success: function (data) {
                            self.RouteData = JSON.parse(data);
                            kjsmap.map.data.addGeoJson(self.RouteData);
                        }
                    });
                }
                else {
                    kjsmap.map.data.addGeoJson(this.RouteData);
                }
            }
            else {
                kjsmap.map.data.forEach(function (feature) { kjsmap.map.data.remove(feature); });
            }
        },
        Direction: {
            RenderMan: undefined,
            ServiceGuy: undefined,
            Service: function (d,options,callback) {
                if (!this.ServiceGuy) { this.ServiceGuy = new google.maps.DirectionsService(); }
                var self = this;
                this.ServiceGuy.route(options, function (r) {
                    if (d) { self.Display(!0, r); }
                    else { callback.call(kjsmap, r); }
                });
            },
            Display: function (n,r) {
                var renderGuy = (!n && this.RenderMan) ? this.RenderMan : new google.maps.DirectionsRenderer();
                renderGuy.setMap(kjsmap.map);
                renderGuy.setDirections(r);
                if (!n && !this.RenderMan) { this.RenderMan = renderGuy; }
            }
        }
    };
    w['ajax'] = function () {
        var getHttpreq = function () {
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            }
            else {
                return new ActiveXObject("Microsoft.XMLHTTP");
            }
        };
        return {
            xhttp: getHttpreq(),
            call: function (p) {
                this.xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        p.success(this.responseText);
                    }
                };
                this.xhttp.open(p.type, p.url, p.isasync);
                this.xhttp.send();
            },
        };
    }();
})(window);
function initMap() {
    var mapdiv = document.getElementById("map");
    if (mapdiv) {
        kjsmap.map = new google.maps.Map(mapdiv, {
            zoom: 4,
            minZoom: kjsmap.mapOptions.minZoomLevel,
            center: { lat: 13.046034415549146, lng: 80.321044921875 }
        });

        var posStart = new google.maps.LatLng(-85, -180);
        var posEnd = new google.maps.LatLng(85, 180);
        var allowedBounds = new google.maps.LatLngBounds(posStart, posEnd);

        kjsmap.Circle = new google.maps.Circle({
            strokeColor:'#000000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#F0FFFF',
            fillOpacity: 0.2,
            center: { lat: 13.089844954062787, lng: 80.29838562011719 },
            radius: 500,
            map: kjsmap.map
        });
        google.maps.event.addListener(kjsmap.map, "click", function (e) {
            console.log("Lat: " + e.latLng.lat());
            console.log("Lng: " + e.latLng.lng());
        });
        google.maps.event.addListener(kjsmap.map, 'center_changed', function (e) {
            if ((allowedBounds.getNorthEast().lat() > (kjsmap.map.getBounds().getNorthEast().lat()))
                    && (allowedBounds.getSouthWest().lat() < (kjsmap.map.getBounds().getSouthWest().lat()))) {
                lastValidCenter = kjsmap.map.getCenter();
                return;
            }
            kjsmap.map.panTo(lastValidCenter);
        });
    }    
};

