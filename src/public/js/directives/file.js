
app.directive('file', function(){
    return {
        scope: {
            file: '=',
            fileChange: '='
        },
        link: function(scope, el, attrs){

            el.bind('change', function(event){
                scope.$apply(function(){
                    var files = event.target.files;
                    var file = files[0];
                    scope.file = file ? file : undefined;

                    scope.fileChange(event, file);
                });
            });
        }
    };
});