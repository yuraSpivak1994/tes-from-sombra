(function () {
    angular.module('appModule')
        .service('appService', ['$http', AppService])

    function AppService($http) {
        this.getAlbums = function() {
            return $http.get('/albums/all')
                .then(function (response) {
                    var dataKeys = Object.keys(response.data);
                    for (var i = 0; i < dataKeys.length; i++) {
                        dataKeys[i] = response.data[dataKeys[i]];
                    }
                    return dataKeys;
                })
                .catch(catchError);
        }
        this.deleteAlbum = function(id) {
            return $http.delete('/albums/delete/' + id)
                    .catch(catchError);
        }
        
         this.addAlbum = function(album) {
            return $http.post('/albums/add', album)
                .then(function(response) {
                    return response.data;
                })
         }

         this.updateAlbum = function(id, album) {
             return $http.post('/albums/update/' + id, album)
                .then(function (response) {
                    return response.data;
             });
         }

         function catchError(err) {
            console.error(err.statusText);
        }
    }
})();



// function Oleh(callback) {
//     callback('Yura');
// }

// Oleh(function (response) {
//     debugger;
// });

