
angular.module('App').controller('CreateGroupCtrl', ['$scope', 'blockui', '$http', '$location','account',
    function($scope, blockui, $http, $location, account){

        $("#fileChooser").change(function (ev) {
            fileChooserOnChange();
        });

        // public var
        $scope.isShowError = false;
        $scope.photoErrorMsg = "";
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

        var uploadComplete = function(res) {
//            alert("complete - " + res.currentTarget.responseText);
            log("uploadComplete");
            var jsonResponse = angular.fromJson(res.currentTarget.responseText);
            log(jsonResponse);
            if (jsonResponse.result){
                showImage();
                //$scope.Group.image = json.image;
            } else {
                if (jsonResponse.msg.toLowerCase() == "toobig"){
                    $scope.photoErrorMsg = "The photo is too big";
                }
            }
        },
        uploadFailed = function(res) {
            //log("uploadFailed");
            //log(res);
            alert("failed");
            //todo: show could not upload
        },
        uploadCanceled = function(res) {
            alert("canceled");
            //log("uploadCanceled");
            //log(res);
        },
        uploadProgress =function(res) {
            log("uploadProgress");
            log(res);
        },
        fileChooserOnChange = function() {
            log("file chooser on change");

            var fileChooser = document.getElementById('fileChooser');
            var fileType = fileChooser.files[0].type;

            if (isFileValid(fileType)) {
                //sending the image
                uploadImage();

            } else {
                //todo: show please choose photo
            }

        },
        isFileValid = function(fileType){
            var isValid = false;

            if (fileType != undefined) {
                var subType = fileType.substr(0,fileType.lastIndexOf('/'));
                if (subType == "image"){
                    isValid = true;
                }
            }

            log("is file valid: " + isValid);

            return isValid;
        },
        showImage = function(){
            var fileChooser = document.getElementById('fileChooser');
            var file = fileChooser.files[0];

            var reader = new FileReader();
            reader.onload = (function (ev) {
                $("#photoImg").attr("src", ev.target.result).slideDown();
            });

            $("#photoImg").data("name", file.name);
            reader.readAsDataURL(file);
        },
        uploadImage = function() {
            var fileChooser = document.getElementById('fileChooser');
            var fd = new FormData();
            fd.append("image", fileChooser.files[0]);

            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", uploadProgress, false);
            xhr.addEventListener("load", uploadComplete, false);
            xhr.addEventListener("error", uploadFailed, false);
            xhr.addEventListener("abort", uploadCanceled, false);
            xhr.open("POST", "/api/upload");
            xhr.send(fd)
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
        $scope.addPhoto = function(){
            $("#fileChooser").click();
        };

        $scope.account = account;

    }]);
