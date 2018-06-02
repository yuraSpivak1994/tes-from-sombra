(function() {
    angular.module('appModule')
        .controller('appController', ['appService', AppController])

    function AppController(appService) {
        var vm = this;
        vm.albums = [];
        vm.showModal = false;
        vm.isEdit;
        vm.albumEntety = {
            title: '',
            artist: '',
            country: '',
            company: '',
            price: '',
            year: '',
            logoUrl: ''
          };
        
        vm.editAlbum = function (album) {
            vm.albumEntety = angular.copy(album);
            vm.showModal = true;
            vm.isEdit = true;
        }

        vm.addAlbum = function() {
            vm.isEdit = false;
            vm.showModal = true;
        }
        
        vm.saveChanges = function () {
            if (vm.isEdit) {
                if (validateForm()) {
                    appService.updateAlbum(vm.albumEntety.id, fieldsToString(vm.albumEntety))
                    .then(function (data) {
                        updateAlbumInList(data);
                        vm.closeDialog();
                    });
                    return;
                }  
            } else {
                vm.saveNewAlbum();
            }
        }

        vm.closeDialog = function() {
            vm.showModal = false;
            if ('id' in vm.albumEntety) {
                delete vm.albumEntety.id;
            }
            resetEntety(this.albumEntety);
        }

        vm.saveNewAlbum = function() {
            if (validateForm()) {
                var reqData = JSON.stringify(fieldsToString(vm.albumEntety));
                appService.addAlbum(reqData)
                    .then(function(data) {
                        vm.albums.unshift(data);
                        resetEntety(vm.albumEntety);
                        vm.showModal = false;
                    })
            }
        }

        vm.removeAlbum = function (id) {
            var isConfirmed = confirm('Are you sure you want to delete this album ?');
            if (!isConfirmed) {
                return;
            }
            appService.deleteAlbum(id)
                .then(function () {
                    for(var i = 0; i < vm.albums.length; i++) {
                        if (vm.albums[i].id === id) {
                            vm.albums.splice(i, 1);
                            break;
                        }
                    }
                })
        }

        function resetEntety(entety) {
            Object.keys(entety)
                .forEach(function (key) { entety[key] = '' });
        }

        function updateAlbumInList(album) {
            for(var i = 0; i < vm.albums.length; i++) {
                if (vm.albums[i].id === album.id) {
                    vm.albums[i] = album;
                    break;
                }
            }
        }

        function validateForm() {
            var emptyFields = [];
            var isValid = true;
            Object.keys(vm.albumEntety).forEach(function(key) {
                if (!vm.albumEntety[key] && key !== 'logoUrl' && key !== 'id') {
                    isValid = false;
                    emptyFields.push(key);
                }
            })
            if (emptyFields.length) {
                alert(emptyFields.join(' ,') + ' fields are required')
            }
            return isValid;
        }

        function fieldsToString(entity) {
            const obj = {};
            for(var key in entity) {
                obj[key] = entity[key] + '';
            }
            return obj;
        }

        vm.init = function() {
            appService.getAlbums()
                .then(function (data) {
                    vm.albums = data;
            });
        }
        vm.init();
    }
})();
