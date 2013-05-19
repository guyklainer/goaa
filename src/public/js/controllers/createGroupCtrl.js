
angular.module('App').controller('CreateGroupCtrl', ['$scope', 'blockui', '$http', '$location','account',
    function($scope, blockui, $http, $location, account){

        // public var
        $scope.isShowError = false;
        $scope.errorInDataBaseSaving = false;
        $scope.Group = {
            name     :"",
            address  : 		{ country:"",
                              city: "",
                              street: "",
                              house:"",
                              apartment: "" },
            image    : ""
        };

        $("#fileChooser").change(function (ev) {
            fileChooserOnChange(ev, this);
        });
        var fileChooserOnChange = function(ev, _this) {
            log("file chooser on change");

            showImage(ev, _this);

            var isValid = false;
            var fileName = $("#photoImg").data("name");

            log("filename: ");
            log(fileName);

            if (fileName != undefined) { //case there is a photo

                // validate file extention is correct
                var extension = fileName.substr((fileName.lastIndexOf('.') + 1));

                log("extension");
                log(extension);

                switch (extension) {
                    case 'jpeg':
                    case 'jpg':
                    case 'png':
                    case 'gif':
                        isValid = true;
                        break;
                }

                if (isValid) {
                    $("#uploadImageForm").submit();

                } else {
                    //todo show error please choose photo
                }
            }
        },
        showImage = function(ev, _this){
            var reader = new FileReader();
            reader.onload = (function (ev) {
                $("#photoImg").attr("src", ev.target.result).fadeIn();
            });

            var file = _this.files[0];
            $("#photoImg").data("name", file.name);
            reader.readAsDataURL(file);
        };

        // public functions
        $scope.groupcreator = function() {

            log("group is: ");
            log($scope.Group);

            blockui.block();

            $http.post('/creategroup',$scope.Group)
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    blockui.unblock();
                    //todo show general error
                })
                .success(function(data, status, headers, config) {
                    log(data);
                    if (data != null && !data.result) //case failed
                    {
                        if(data.msg == "groupExist")
                        {
                            $scope.isShowError = true;
                        }
                        if(data.msg == "groupNotSavedToDB")
                        {
                            $scope.errorInDataBaseSaving = true;
                        }

                        blockui.unblock();

                    } else  if (data != null && data.result){ //case success
                        blockui.unblock();
                        $scope.isShowError = false;

                        $location.path('/home');
                    } else { //case invalid
                        blockui.unblock();

                        //check for error
                    }
                });
        };
        $scope.addPhoto = function (group){
            log("sending to upload image");

//            blockui.block();
              $("#fileChooser").click();
        };

        $scope.account = account;

    }]);
