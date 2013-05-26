'use strict';

app.directive('imageUploader', function($timeout) {
    return {
        templateUrl: "/template/directives/imageUploader.html",
        replace: true,
        scope: {
            image: "="
        },
        link: function(scope, element, attrs, controller){
            log("link");

            scope.progressValue     = 0;
            scope.uploadedImageUrl  = "/img/logo.png";
            scope.showProgressBar   = false;

            scope.addPhoto = function(){
                log("addPhoto");

                // resetting the progress bar
                scope.progressValue     = 0;
                scope.uploadedImageUrl  = "";
                scope.image             = "";
                scope.errorMsg          = "";

                $("#fileChooser").click();
            }

            scope.fileChange = function(event, file){
                log("file change!", event);

                if (file != undefined){
                    var fileType = file.type;

                    if (isFileValid(fileType)) {
                        //sending the image
                        uploadImage(file);

                    } else {
                        scope.errorMsg = "not an image";
                    }
                }
            }

            function uploadComplete(evt) {
                log("uploadComplete", evt);

                if (evt.currentTarget.status == 200){ //case response "OK"
                    var jsonResponse = angular.fromJson(evt.currentTarget.responseText);
                    log("upload result is: " + jsonResponse.result);

                    scope.$apply(function(){
                        if (jsonResponse.result){
                            scope.uploadedImageUrl = jsonResponse.data.imgURL;
                            scope.image = jsonResponse.data.imgURL;
                        } else {
                            scope.errorMsg = jsonResponse.msg;
                        }
                        scope.showProgressBar   = false;
                    });
                }
            }

            function uploadImage( file ) {
                log("upload file: ", file);
                scope.showProgressBar = true;

                //sending the file
                var fd = new FormData();
                fd.append("image", file);
                fd.append("stage", "newGroup");

                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener("progress", uploadProgress, false);
                xhr.addEventListener("load", uploadComplete, false);
                xhr.addEventListener("error", uploadFailed, false);
                xhr.addEventListener("abort", uploadCanceled, false);
                xhr.open("POST", "/api/upload");
                xhr.send(fd);
            }

            function uploadProgress(evt) {
                log("uploadProgress");
                var progress;

                if (evt.lengthComputable) {
                    progress = Math.round(evt.loaded * 100 / evt.total)
                } else {
                    progress = null
                }

                if (progress != null && scope.progressValue < 100 ){
                    scope.$apply(function(){
                        scope.progressValue = progress;
                    });
                    log("progress: " + progress);
                }
            }
        }
    };

    function uploadFailed(evt) {
        log("uploadFailed");
        //log(res);
        //todo: show could not upload
    }

    function uploadCanceled (evt) {
        log("uploadCanceled");
        //log(res);
    }

    function isFileValid(fileType){
        var isValid = false;

        if (fileType != undefined) {
            var subType = fileType.substr(0,fileType.lastIndexOf('/'));
            if (subType == "image"){
                isValid = true;
            }
        }

        log("is file valid: " + isValid);

        return isValid;
    }
});