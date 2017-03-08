app.directive('header', function () {
    return {
        restrict: 'A',
        templateUrl: function(element, attrs) {
                return "views/header.html";
        }
    }
});
app.directive('frontheader', function () {
    return {
        restrict: 'A',
        templateUrl: function(element, attrs) {
                return "views/front_header.html";
        }
    }
});
app.directive('loading', ['$http', function ($http) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.isLoading = function () {
          return $http.pendingRequests.length > 0;
        };
        scope.$watch(scope.isLoading, function (value) {
      
          if (value) {
            element.removeClass('ng-hide');
          } else {
            element.addClass('ng-hide');
          }
        });
      }
    };
}]);

app.directive('loading1', ['$http', function ($http) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.isLoading = function () {
          return $http.pendingRequests.length > 0;
        };
        scope.$watch(scope.isLoading, function (value) {
          if (value) {
            element.removeClass('ng-hide');
          } else {
            element.addClass('ng-hide');
          }
        });
      }
    };
}]);
app.directive('left', function () {
    return {
        restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        templateUrl: function(element, attrs) {
                return "views/left.html";
        }
    }
});
app.directive('access', access);

  /** @ngInject */
  function access(authorization) {
    var directive = {
      restrict: 'A',
      link: linkFunc,
    };

    return directive;

    /** @ngInject */
    function linkFunc($scope, $element, $attrs) {
      
      var makeVisible = function () {
        $element.removeClass('hidden');
      };

      var makeHidden = function () {
        $element.addClass('hidden');
      };

      var determineVisibility = function (resetFirst) {
          
        var result;

        if (resetFirst) {
          makeVisible();
        }

        result = authorization.authorize(roles, $attrs.accessPermissionType);
        
        if (result === authorization.constants.authorised) {
          makeVisible();
        } else {
          makeHidden();
        }
      };
      var roles = $attrs.access.split(',');
      if (roles.length > 0) {
          determineVisibility(true);
      }
    }
  }
app.directive('exampleDatatable',function ($rootScope,$http,$compile) {

    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            scope.quoteDatatable = elem.dataTable({
                "serverSide": true,
                "bLengthChange": false,
                "bInfo" : false,
                "bJqueryUI": true,
                "bSort":true,
                "bsearching": true,
                "bProcessing": true,
                "sDom": 'C<"clear">R<"leftside"><"scrolltbl"rt><"bottomside"ilp>',
               // "ajax": 'api/index.php/'+attrs.url,
                "ajax":{"url": 'api/index.php/'+attrs.url,"beforeSend": function(xhr){
                }},
                "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                    $compile(nRow)(scope);
                },
                initComplete: function (){

                }
            });
        }
    }
});
app.directive('exampleDatatable1',function ($rootScope,$http,$compile) {
     return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            scope.quoteDatatable1 = elem.dataTable({
                "serverSide": true,
                "bLengthChange": false,
                "bInfo" : false,
                "bJqueryUI": true,
                "bSort":true,
                "bsearching": true,
                "bProcessing": true,
                "sDom": 'C<"clear">R<"leftside"><"scrolltbl"rt><"bottomside"ilp>',
               // "ajax": 'api/index.php/'+attrs.url,
                "ajax":{"url": 'api/index.php/'+attrs.url,"beforeSend": function(xhr){
                }},
                "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                    $compile(nRow)(scope);
                },
                initComplete: function (){

                }
            });
        }
    }
});
app.directive('exampleDatatable2',function ($rootScope,$http,$compile) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            scope.quoteDatatable2 = elem.dataTable({
                "serverSide": true,
                "bLengthChange": false,
                "bInfo" : false,
                "bJqueryUI": true,
                "bSort":true,
                "bsearching": true,
                "bProcessing": true,
                "sDom": 'C<"clear">R<"leftside"><"scrolltbl"rt><"bottomside"ilp>',
               // "ajax": 'api/index.php/'+attrs.url,
                "ajax":{"url": 'api/index.php/'+attrs.url,"beforeSend": function(xhr){
                }},
                "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                    $compile(nRow)(scope);
                },
                initComplete: function (){

                }
            });
        }
    }
});
app.directive('exampleDatatable3',function ($rootScope,$http,$compile) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            scope.quoteDatatable3 = elem.dataTable({
                "serverSide": true,
                "bLengthChange": false,
                "bInfo" : false,
                "bJqueryUI": true,
                "bSort":true,
                "bsearching": true,
                "bProcessing": true,
                "sDom": 'C<"clear">R<"leftside"><"scrolltbl"rt><"bottomside"ilp>',
               // "ajax": 'api/index.php/'+attrs.url,
                "ajax":{"url": 'api/index.php/'+attrs.url,"beforeSend": function(xhr){
                }},
                "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                    $compile(nRow)(scope);
                },
                initComplete: function (){

                }
            });
        }
    }
});
app.directive('exampleDatatable4',function ($rootScope,$http,$compile) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            scope.quoteDatatable4 = elem.dataTable({
                "serverSide": true,
                "bLengthChange": false,
                "bInfo" : false,
                "bJqueryUI": true,
                "bSort":true,
                "bsearching": true,
                "bProcessing": true,
                "sDom": 'C<"clear">R<"leftside"><"scrolltbl"rt><"bottomside"ilp>',
               // "ajax": 'api/index.php/'+attrs.url,
                "ajax":{"url": 'api/index.php/'+attrs.url,"beforeSend": function(xhr){
                }},
                "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                    $compile(nRow)(scope);
                },
                initComplete: function (){

                }
            });
        }
    }
});
app.directive('exampleDatatable5',function ($rootScope,$http,$compile) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            scope.quoteDatatable5 = elem.dataTable({
                "serverSide": true,
                "bLengthChange": false,
                "bInfo" : false,
                "bJqueryUI": true,
                "bSort":true,
                "bsearching": true,
                "bProcessing": true,
                "sDom": 'C<"clear">R<"leftside"><"scrolltbl"rt><"bottomside"ilp>',
               // "ajax": 'api/index.php/'+attrs.url,
                "ajax":{"url": 'api/index.php/'+attrs.url,"beforeSend": function(xhr){
                }},
                "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                    $compile(nRow)(scope);
                },
                initComplete: function (){

                }
            });
        }
    }
});
app.directive('validateemail',function ($rootScope,$http) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {

           elem.bind('blur',function() {
            var element_id = this.id;
            var email_id = this.value;
            var rowId = $("#email").attr('data-rowId');
            if(email_id != '') {
            $http({
                  method: "get",
                  url: 'api/index.php/user/ValidateEmail?email_id='+email_id+'&rowId='+rowId
                }).then(function mySucces( response ) {
                    if(response.data.data > 0) {
                        $("#errMessage_"+element_id).remove();
                        $("#"+element_id).after("<div id='errMessage_"+element_id+"' style='color:red;text-align:left;font-size:12px'>This email is already in use.</div>");
                    } else {
                            
                    } 
                },function myError(response) {
                alert(response.data.message);
                  //show_notification('Error', response.data.message, '','no');
                });
                } else {
                  $("#errMessage_"+element_id).remove();  
                }
            
            
            var element_value = this.value;
            if(element_value != '') {
            var re = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if(!re.test(element_value))
            {
                $("#errMessage_"+element_id).remove(); 
                $('#'+element_id).val();
                $(this).after("<div id='errMessage_"+element_id+"' style='color:red;text-align:left;font-size:12px;'>Please enter valid email address.</div>");
            } else {
            $("#errMessage_"+element_id).remove(); 
            }
            } else {
            $("#errMessage_"+element_id).remove();     
            }
           });
        }
      }
});


app.directive('validateemailformat',function ($rootScope,$http) {
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
       elem.bind('blur',function() {
        var element_id = this.id;
        var element_value = this.value;
        if(element_value != '') {
          var re = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          if(!re.test(element_value))
          {
            $("#errMessage_"+element_id).remove(); 
            $(this).after("<div id='errMessage_"+element_id+"' style='color:red;text-align:left;font-size:12px;'>Please enter valid email address.</div>");
          } else {
            $("#errMessage_"+element_id).remove(); 
          }
          } else {
            $("#errMessage_"+element_id).remove();     
          }
       });
}
}
});

app.directive('fileUploaders',function () {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
        elem.uploadFile({
		url:path +"user/fileUpload/",
		fileName:"myfile",
                         dragDrop: true,
                         returnType: "json",
                         showDelete: true,
                         showPreview:true,
                         previewHeight:100,
                         previewWidth:100,
                         allowedTypes:"xls,csv,doc,pdf,txt",
                         statusBarWidth:300,
                         dragdropWidth:300,
                onSelect:function(files)
                {
                    files[0].name;
                    files[0].size;
                    return true; //to allow file submission.
                },
                onSuccess:function(files,data,xhr,pd)
                {
                  
                  if(scope.reply_file == undefined){
                     scope.reply_file =[];
                  }
                  scope.reply_file.push(data);
                   $("#eventsmessage").html($("#eventsmessage").html()+"<br/>Success for: "+JSON.stringify(data));
                },
                afterUploadAll:function(obj,data)
                {
                    console.log(scope.reply_file);
                        $("#eventsmessage").html($("#eventsmessage").html()+"<br/>All files are uploaded.");
                },
                onLoad:function(obj)
                {
                    
                },
                deleteCallback: function (data, pd) {
                    for (var i = 0; i < data.length; i++) {
                        $.post(path +"facility/deletefacilityimage/", {op: "delete",name: data[i]},
                            function (resp,textStatus, jqXHR) {
                                //Show Message	
                               
                            });
                    }
                    pd.statusbar.hide(); //You choice.

                },  
            });
        }
    }
});

app.directive('dateTimePicker',function () {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            elem.datetimepicker({
               format: "dd-mm-yyyy hh:ii",
                autoclose: true,
                todayBtn: true,
                startDate: new Date(),
                minuteStep: 10
            });
        }
    }
});
app.directive('dt1',function () {
        debugger;
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
          
           elem.datepicker({
            dateFormat: "yy-mm-dd",
            //minDate: 0,
            onSelect: function (date) {
               var dt2 = $('#toDate');
                var startDate = $(this).datepicker('getDate');
                var minDate = $(this).datepicker('getDate');
                console.log(minDate);
                dt2.datepicker('setDate', minDate);
                //startDate.setDate(startDate.getDate() + 30);
                //sets dt2 maxDate to the last day of 30 days window
               //dt2.datepicker('option', 'maxDate', startDate);
                dt2.datepicker('option', 'minDate', minDate);
                //$(this).datepicker('option', 'minDate', minDate);
            }
        });
        }
    }
});
 app.directive('dt2',function () {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            elem.datepicker({
            dateFormat: "yy-mm-dd"
        });
        }
    }
});

app.directive('dashboardDatatable',function ($rootScope,$http,$compile) {
     return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            scope.dashboardDatatable = elem.dataTable({
                "serverSide": true,
                "bLengthChange": false,
                "bInfo" : false,
                "bJqueryUI": true,
                "bSort":true,
                "bsearching": false,
                "bProcessing": true,
                "sDom": 'C<"clear">R<"leftside"><"scrolltbl"rt><"bottomside"ilp>',
               // "ajax": 'api/index.php/'+attrs.url,
                "ajax":{"url": 'api/index.php/'+attrs.url,"beforeSend": function(xhr){
                }},
                "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                    $compile(nRow)(scope);
                },
                initComplete: function (){

                }
            });
        }
    }
});
