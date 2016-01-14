angular.module("starter")
    .controller('MainCtrl', ['$scope',
        function ($scope) {
            var list_of_point = [{ lat: -8.743299, lng: 115.1734029 }, { lat: -8.802304, lng: 115.235949 }];
            var map = {};
            var circle = {};
            var markers = [];
            var geocoder = new google.maps.Geocoder();
            var address = "Jalan sesetan";
            geocoder.geocode({ 'address': address }, function (results, status) {

                if (status == google.maps.GeocoderStatus.OK) {
                    var location = results[0].geometry.location;
                    //                   console.log(results[0].geometry.location.lat())
                    //                 console.log(results[0].geometry.location.lng())
                    map = L.map('map').setView([location.lat(), location.lng()], 0);

                    circle = L.circle([location.lat(), location.lng()], 3000, {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5
                    }).addTo(map);
                    circle.on({
                        mousedown: function () {
                            map.on('mousemove', function (e) {
                                for (var i = 0; i < markers.length; i++) {
                                    map.removeLayer(markers[i])
                                }
                                circle.setLatLng(e.latlng);

                                for (var i = 0; i < list_of_point.length; i++) {
                                    var lat_lang_point = new L.LatLng(list_of_point[i].lat, list_of_point[i].lng);
                                    if (e.latlng.distanceTo(lat_lang_point) < 3000) {
                                        var marker = new L.Marker(lat_lang_point, { draggable: true });
                                        map.addLayer(marker);
                                        markers.push(marker)

                                    }
                                }

                            });
                        }
                    });
                    map.on('mouseup', function (e) {
                        map.removeEventListener('mousemove');
                    })
                    
                     for (var i = 0; i < markers.length; i++) {
                                    map.removeLayer(markers[i])
                                }

                                for (var i = 0; i < list_of_point.length; i++) {
                                     var latLang = new L.LatLng(location.lat(), location.lng());
                                    var lat_lang_point = new L.LatLng(list_of_point[i].lat, list_of_point[i].lng);
                                    if (latLang.distanceTo(lat_lang_point) < 3000) {
                                        var marker = new L.Marker(lat_lang_point, { draggable: true });
                                        map.addLayer(marker);
                                        markers.push(marker)

                                    }
                                }

            



                    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        osmAttribution = 'Map data &copy; 2012 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
                        osm = new L.TileLayer(osmUrl, { maxZoom: 18, attribution: osmAttribution });

                    map.setView(new L.LatLng(location.lat(), location.lng()), 12).addLayer(osm);
                }
            });



        }]);