//angular.module('App')
app.controller('CreateGroupCtrl', ['$scope', 'blockui', '$http', '$location','account',
    function($scope, blockui, $http, $location, account){

        //litenting to file chooser of the image on change event
        $("#fileChooser").change(function (ev) {
            fileChooserOnChange();
        });

        // public var
        $scope.account                  = account;
        $scope.isShowError              = false;
        $scope.isUploadSuccess          = false;
        $scope.errorInDataBaseSaving    = false;
        $scope.progressValue            = 0;

        $scope.Group = {
            name     : "",
            address  : {
                country: "",
                street: "",
                city: "",
                house: "",
                apartment: ""
            },
            image: ""
        };

        var uploadComplete = function(evt) {
            log("uploadComplete");

            var jsonResponse = angular.fromJson(evt.currentTarget.responseText);
            log(jsonResponse);

            if (jsonResponse.result){
                $scope.isUploadSuccess = true;
                showImage();
                $scope.Group.image = jsonResponse.data.imgURL;
            } else {
                $scope.isUploadSuccess = false;
                if (jsonResponse.msg == "tooBig"){
                    $scope.photoErrorMsg = "The photo is too big";
                }
            }
            $scope.$apply();
        },
        uploadFailed = function(evt) {
            log("uploadFailed");
            //log(res);
            //todo: show could not upload
        },
        uploadCanceled = function(evt) {
            log("uploadCanceled");
            //log(res);
        },
        uploadProgress =function(evt) {
            log("uploadProgress");
            //log(evt);
            var progress;

            if (evt.lengthComputable) {
                progress = Math.round(evt.loaded * 100 / evt.total)
            } else {
                progress = null
            }

            if (progress != null && $scope.progressValue < 100 ){
                $scope.progressValue = progress;
                $scope.$apply();
            }

            log("progress: " + progress);
        },
        fileChooserOnChange = function() {
            log("file chooser on change");

            var fileChooser = document.getElementById('fileChooser');
            if (fileChooser.files != undefined){
                var fileType = fileChooser.files[0].type;

                if (isFileValid(fileType)) {
                    //sending the image
                    uploadImage();

                } else {
                    //todo: show please choose photo
                }
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
            fd.append("stage", "newGroup");

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
