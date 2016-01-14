angular.module("starter")
    .controller('MainCtrl', ['$scope', '$ionicModal',
        function ($scope, $ionicModal) {
            var list_of_point = [{ lat: -8.743299, lng: 115.1734029, note: "Bandara" }, { lat: -8.802304, lng: 115.235949, note: "Nusa dua" }, { lat: -8.844827, lng: 115.185323, note: "Pandawa" }];
            $scope.map = new L.map('map');
            $scope.circle = {};
            var markers = [];
            $scope.position = {};
            $scope.radius = 3000;
            $scope.data = {};
            $scope.data.radius = 3000;
            var geocoder = new google.maps.Geocoder();

            $scope.searchAddress = function (data) {
                $scope.getListOfPointWhithinCircleWithRadus(data.address);
                $scope.radius = data.radius;
            }

            navigator.geolocation.getCurrentPosition(showPosition);
            function showPosition(position) {
                $scope.position = position.coords;
                $scope.getListOfPointWhithinCircleWithRadus("");
            }

            $scope.getListOfPointWhithinCircleWithRadus = function (address) {
                geocoder.geocode({ 'address': address }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results.length > 1) {
                            console.log(results[0])
                            $scope.results = results;
                            $ionicModal.fromTemplateUrl('select-modal.html', {
                                scope: $scope,
                                animation: 'slide-in-up'
                            }).then(function (modal) {
                                $scope.modal = modal;
                                $scope.modal.show();
                            });
                        }

                        else {
                            $scope.position = results[0].geometry.location;
                            $scope.position.latitude = results[0].geometry.location.lat();
                            $scope.position.longitude = results[0].geometry.location.lng();
                            $scope.setMap();
                        }
                    }
                    else {
                        $scope.setMap();
                    }
                });
            }

            $scope.setMap = function () {
                $scope.map.setView([$scope.position.latitude, $scope.position.longitude], 0);
                $scope.map.removeLayer($scope.circle);

                $scope.circle = L.circle([$scope.position.latitude, $scope.position.longitude], $scope.radius, {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5
                }).addTo($scope.map);
                $scope.circle.on({
                    mousedown: function () {
                        $scope.map.on('mousemove', function (e) {
                            for (var i = 0; i < markers.length; i++) {
                                $scope.map.removeLayer(markers[i])
                            }
                            $scope.circle.setLatLng(e.latlng);

                            for (var i = 0; i < list_of_point.length; i++) {
                                var lat_lang_point = new L.LatLng(list_of_point[i].lat, list_of_point[i].lng);
                                if (e.latlng.distanceTo(lat_lang_point) <= $scope.radius) {
                                    var marker = new L.Marker(lat_lang_point, { draggable: true });
                                    marker.bindPopup(list_of_point[i].note).openPopup();
                                    $scope.map.addLayer(marker);
                                    markers.push(marker)
                                }
                            }
                        });
                    }
                });
                $scope.map.on('mouseup', function (e) {
                    $scope.map.removeEventListener('mousemove');
                })

                for (var i = 0; i < markers.length; i++) {
                    $scope.map.removeLayer(markers[i])
                }

                for (var i = 0; i < list_of_point.length; i++) {
                    var latLang = new L.LatLng($scope.position.latitude, $scope.position.longitude);
                    var lat_lang_point = new L.LatLng(list_of_point[i].lat, list_of_point[i].lng);
                    if (latLang.distanceTo(lat_lang_point) <= $scope.radius) {
                        var marker = new L.Marker(lat_lang_point, { draggable: true });
                        marker.bindPopup(list_of_point[i].note).openPopup();
                        $scope.map.addLayer(marker);
                        markers.push(marker)
                    }
                }

                var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    osmAttribution = 'Map data &copy; 2012 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
                    osm = new L.TileLayer(osmUrl, { maxZoom: 18, attribution: osmAttribution });

                $scope.map.setView(new L.LatLng($scope.position.latitude, $scope.position.longitude), 12).addLayer(osm);
            }


            $scope.select_result = function (result) {
                $scope.modal.hide();
                $scope.position = result.geometry.location;
                $scope.position.latitude = result.geometry.location.lat();
                $scope.position.longitude = result.geometry.location.lng();
                $scope.setMap();
            }
        }]);