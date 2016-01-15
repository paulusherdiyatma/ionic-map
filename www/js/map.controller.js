angular.module("starter")
    .controller('MainCtrl', ['$scope', '$ionicModal', '$http',
        function ($scope, $ionicModal, $http) {
            var list_of_point = [{ lat: -8.743299, lng: 115.1734029, note: "Bandara" }, { lat: -8.802304, lng: 115.235949, note: "Nusa dua" }, { lat: -8.844827, lng: 115.185323, note: "Pandawa" }];
            $scope.map = new L.map('map');
            $scope.circle = {};
            var markers = [];
            $scope.position = {};
            $scope.radius = 3000;
            $scope.data = {};

            var options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
            navigator.geolocation.getCurrentPosition(showPosition, error, options);
            function showPosition(position) {
                $scope.position = position.coords;
                $scope.setMap();
            }

            function error(error) {

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

            $scope.getLocation = function (val) {
                return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
                    params: {
                        address: val,
                        components: "country:AU",
                        sensor: false

                    }
                }).then(function (response) {
                    return response.data.results.map(function (item) {
                        return item;
                    });
                });
            };

            $scope.onSelect = function (item, model, label) {
                $scope.position = {};
                $scope.position.latitude = item.geometry.location.lat;
                $scope.position.longitude = item.geometry.location.lng;
                $scope.setMap();
            }

            $scope.radiusChange = function (radius) {
                $scope.radius = radius;
                $scope.setMap();
            }
        }]);