var path = 'api/index.php/';
app.controller('loginCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          //----check password

          $scope.confrmp = function() {
               var pass = $('#password').val();
               var cpass = $('#cpassword').val();
               if (cpass != pass) {

                    show_notification('Error', "Password doesn't match", '', 'no');
                    $('#password').val('');
                    $('#cpassword').val('');
               }
          }
          //----reset password
          $scope.resetPassword = function(frm_id) {
               if ($('#' + frm_id).valid()) {
                    $('#resetdiv').addClass('hide');
                    $scope.changepasword.user_id = $stateParams.userId;
                    $scope.changepasword.token = $stateParams.token;
                    $http({
                         method: "POST",
                         url: path + 'user/resetPassword',
                         data: $scope.changepasword
                    }).then(function mySucces(response) {
                         if (response.data.error == false) {
                              show_notification('Success', response.data.message, '#/login', 'no');
                              setTimeout(function() {
                                   body_sizer();
                              }, 300);
                         } else {
                              $('#resetdiv').removeClass('hide');
                              show_notification('Error', response.data.message, '', 'no');
                         }
                    });
               }
          }


          // ------ send password     
          $scope.send_password = function(frm_id) {
               if ($("#" + frm_id).valid()) {
                    $('#logindiv').addClass('hide');
                    $http({
                         method: "POST",
                         url: path + 'user/sendPassword',
                         data: $scope.user
                    }).then(function mySucces(response) {
                         if (response.data.error == false) {

                              show_notification('Success', response.data.message, '#/login', 'no');
                              setTimeout(function() {
                                   body_sizer();
                              }, 300);
                         } else {
                              $('#logindiv').removeClass('hide');
                              show_notification('Error', response.data.message, '', 'no');
                         }
                    });
               }
          }

          //-----login user
          $scope.login = function(frm_id) {
              
               if ($("#" + frm_id).valid()) {
                    $http({
                         method: "POST",
                         url: path + 'user/login',
                         data: $scope.user
                    }).then(function mySucces(response) {
                         debugger;
                         if (response.data.error == false) {
                              $cookies.put('userdata', JSON.stringify(response.data.data[0]));
                              $rootScope.userdata = response.data.data[0];
                              sessionStorage.setItem("userdata", JSON.stringify(response.data.data[0]));
                              window.location.href = '#/dashboard';
                              // show_notification('Success', response.data.message, '#/dashboard', 'no'); 
                              setTimeout(function() {
                                   body_sizer();
                              }, 300);
                         } else {
                              if (response.data.login_token == '1') {
                                   $('#myModal').modal('show');
                                   $rootScope.userPaymentData = response.data.data[0];
                              } else {
                                   $('#logindiv').removeClass('hide');
                                   show_notification('Error', response.data.message, '', 'no');
                              }
                         }
                    });
               }
          }


          $('#addPayment').click(function() {
               $("#myModal").removeClass('in');
               setTimeout(function() {
                    window.location.href = '#/addpayments';
               }, 1000)

          });
          debugger;
         $scope.send_str_url='';
          if ($stateParams.user_id) {
               $http({
                    method: "GET",
                    url: path + 'user/activation?user_id=' + $stateParams.user_id + '&token=' + $stateParams.token,
               }).then(function mySucces(response) {
                    debugger;
                    if (response.data.error == false) {
                         $scope.send_str_url = true;
                         $('#activation').removeClass('hide');
                    } else {
                         $('#already').removeClass('hide');
                         $scope.send_str_url = false;
                         
                    }
               });
          }

     }]).controller('registerCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }
          
          if (getParameterByName('plan_id')) {
               var id = getParameterByName('plan_id');
               $scope.plan_index = getParameterByName('plan_index');
               if (id != '' && id != undefined) {
                    $scope.registerdiv = true;
               }
          }

          $scope.checkplan = function(id) {
               debugger;
               $('#check_' + id).addClass('checked');
               if (id == 0) {
                    $('#check_' + id).addClass('checked');
                    $('#check_1').removeClass('checked');
                    $('#palnerror').html('');
               } else {
                    $('#check_' + id).addClass('checked');
                    $('#check_0').removeClass('checked');
                    $('#palnerror').html('');
               }
          }
          //----- get plan
//          $http({
//               method: "GET",
//               url: path + 'user/getPlan',
//               data: $scope.user
//          }).then(function mySucces(response) {
//               if (response.data.error == false) {
//                    $scope.plan = response.data.data.data;
//                    setTimeout(function() {
//                         if ($scope.plan_index != undefined && $scope.plan_index != '') {
//                              if ($scope.plan_index == 0) {
//                                   $('#check_' + $scope.plan_index).addClass('checked');
//                                   $('#palnerror').html('');
//                                   $('#check_1').removeClass('checked');
//                              } else {
//                                   $('#check_' + $scope.plan_index).addClass('checked');
//                                   $('#palnerror').html('');
//                                   $('#check_0').removeClass('checked');
//                              }
//                         }
//                    }, 100);
//               } else {
//                    show_notification('Error', response.data.data.message, '', 'no');
//               }
//          });

          $scope.signup = function(frm_id) {
               debugger;
               if($scope.registerUser==undefined){
                    $scope.registerUser={};
               }
               console.log($scope.registerUser);
               if($scope.registerUser.plan=='' || $scope.registerUser.plan==undefined){
                    setTimeout(function(){
                          $('#plan-error').html('');
                    },200);
                   
                    $( "#planDiv" ).after( "<p id='palnerror'>This field is required.</p>" );
                    $( "#palnerror" ).css( 'color','red');
                    $( "#palnerror" ).css( 'font-weight','700');
                }else {
                     $('#palnerror').html('');
                }
              
               if ($("#" + frm_id).valid()) {
                    
                    $('#signupDiv').addClass('hide');
                    $scope.registerUser.role_id = '1';
                    $http({
                         method: "POST",
                         url: path + 'user/signup',
                         data: $scope.registerUser
                    }).then(function mySucces(response) {
                         if (response.data.error == false) {
                              show_notification('Success', response.data.message, '#/login', 'no');
                              $scope.registerdiv = false;
                              $scope.logindiv = true;

                         } else {
                              $('#signupDiv').removeClass('hide');
                              show_notification('Error', response.data.message, '', 'no');
                         }
                    });
               }
          }
     }]).controller('customerCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }
          $http({
               method: "GET",
               url: path + 'user/chekToken?user_id=' + $rootScope.userdata.user_id,
          }).then(function mySucces(response) {
                    if (response.data.error == false) {
                         if (response.data.data[0].token == '') {
                              window.location.href = '#/limitedaccess';
                         }
                         $scope.userData = response.data.data;
                    } else {
                         $scope.userData = '';
                    }
          });
          $scope.globalFilter = function() {
               $scope.quoteDatatable.fnFilter($scope.search_report);
          };

     }]).controller('headerCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {

          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }
          $scope.logout = function() {
               $cookies.remove('userdata');
               window.location.href = '#/';
               //location.reload();
               $rootScope.userdata = '';
          };

     }]).controller('inventoryCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }
          $http({
               method: "GET",
               url: path + 'user/inventory',
          }).then(function mySucces(response) {
               if (response.data.error == false) {
                    $scope.inventoryReport = response.data.data;
               } else {
                    $scope.inventoryReport = '';
               }
          });
          $scope.globalFilter = function() {
               $scope.quoteDatatable.fnFilter($scope.search_inventory);
          };

     }]).controller('reimbursementsCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }
          $http({
               method: "GET",
               url: path + 'user/remb',
          }).then(function mySucces(response) {
               if (response.data.error == false) {

                    $scope.rembReport = response.data.data;
               } else {
                    $scope.rembReport = '';
               }
          });
          $scope.globalFilter = function() {
               $scope.quoteDatatable.fnFilter($scope.search_rem);
          };

     }]).controller('updateprofileCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }

          // tab selected
          $('#resetpassword').addClass('hide');
          $scope.updateprofile = function() {
               $('#updateprofile').removeClass('hide');
               $('#resetpassword').addClass('hide');
          }
          $scope.resetpassword = function() {
               $('#updateprofile').addClass('hide');
               $('#resetpassword').removeClass('hide');
               $('#resetpassword').addClass('active');

          }
          if ($stateParams.id) {
               $http({
                    method: "GET",
                    url: path + 'user/getUserProfile?user_id=' + $stateParams.id,
               }).then(function mySucces(response) {
                    if (response.data.error == false) {
                         $scope.user = response.data.data[0];
                    } else {
                         $scope.user = '';
                    }
               });
          }

          $scope.update = function(frm_id) {
               // if($("#"+frm_id).valid()) {

               $scope.user.user_id = $stateParams.id;
               $http({
                    method: "POST",
                    url: path + 'user/update',
                    data: $scope.user
               }).then(function mySucces(response) {
                    if (response.data.error == false) {

                         $cookies.put('userdata', JSON.stringify(response.data.data));
                         $rootScope.userdata = response.data.data;
                         sessionStorage.setItem("userdata", JSON.stringify(response.data.data));

                         show_notification('Success', response.data.message, '#/user/updatedprofile/' + $stateParams.id, 'no');

                    } else {
                         show_notification('Error', response.data.message, '', 'no');
                    }
               });
               // }
          }
          $scope.checkp = function() {
               var oldPass = $('#oldPassword').val();
               $http({
                    method: "GET",
                    url: path + 'user/checkpassword?password=' + oldPass + '&user_id=' + $rootScope.userdata.user_id,
               }).then(function mySucces(response) {
                    if (response.data.error == true) {
                         $("#Errorpasswordmsg").html(response.data.message);
                         $("#Errorpasswordmsg").css("color", "red");
                         $("#oldPassword").val('');
                    } else {
                         $("#Errorpasswordmsg").html("");
                    }
               });
          }
          $scope.confrmp = function() {
               var pass = $('#password').val();
               var cpass = $('#cpassword').val();
               if (cpass != pass) {

                    show_notification('Error', "Password doesn't match", '', 'no');
                    $('#password').val('');
                    $('#cpassword').val('');
               }
          }
          $scope.resetP = function() {
               $scope.changepasword.user_id = $rootScope.userdata.user_id;
               $http({
                    method: "POST",
                    data: $scope.changepasword,
                    url: path + 'user/resetP',
               }).then(function mySucces(response) {
                    if (response.data.error == false) {

                         // alert(response.data.message);
                         show_notification('Success', response.data.message, '', 'yes');
                         //  location.reload();

                    } else {
                         //alert(response.data.message);
                         show_notification('Error', response.data.message, '', 'no');
                    }
               });
          }


     }]).controller('paymentsCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }
          $http({
               method: "GET",
               url: path + 'user/dataRange',
          }).then(function mySucces(response) {
               if (response.data.error == false) {

                    $scope.paymentReport = response.data.data;
               } else {
                    $scope.paymentReport = '';
               }
          });

          $scope.globalFilter = function() {
               $scope.quoteDatatable.fnFilter($scope.search_order);
          };
     }]).controller('userCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }
          $scope.globalFilter = function() {
               $scope.quoteDatatable.fnFilter($scope.search_user);
          };

     }]).controller('userAddCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }
          $scope.addUser = function(frm_id) {
               if ($("#" + frm_id).valid()) {
                    $scope.user.created_by = $rootScope.userdata.user_id;
                    $scope.user.is_payment = '1';
                    $http({
                         method: "POST",
                         data: $scope.user,
                         url: path + 'user/addUser',
                    }).then(function mySucces(response) {
                         debugger;
                         if (response.data.error == false) {
                              show_notification('Success', response.data.message, '#/user_man', 'yes');

                         } else {
                              show_notification('Error', response.data.message, '', 'no');
                         }
                    });
               }
          }
     }]).controller('addPasswordCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {


          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }
          if ($stateParams.token && $stateParams.subUserId) {
               $http({
                    method: "GET",
                    url: path + 'user/subUserData?user_id=' + $stateParams.subUserId + '&token=' + $stateParams.token,
               }).then(function mySucces(response) {
                    if (response.data.error == false) {
                         $scope.user = response.data.data[0];
                         setTimeout(function() {
                              $scope.user = response.data.data[0];
                         }, 500);
                    } else {
                         $scope.user;
                    }
               });
          }
          $scope.addSubUserPass = function(frm_id) {
               if ($("#" + frm_id).valid()) {
                    $scope.user.user_id = $stateParams.subUserId;
                    $http({
                         method: "POST",
                         data: $scope.user,
                         url: path + 'user/addSubUserPass',
                    }).then(function mySucces(response) {
                         debugger;
                         if (response.data.error == false) {
                              show_notification('Success', response.data.message, '#/login', 'yes');
                         } else {
                              show_notification('Error', response.data.message, '', 'no');
                         }
                    });
               }
          }

     }]).controller('limitedaccessCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }
          $http({
               method: "GET",
               url: path + 'user/checkpostEmail?user_id=' + $rootScope.userdata.user_id,
          }).then(function mySucces(response) {
               if (response.data.error == false) {
                    $scope.user_email = response.data.data[0].user_email;

               } else {
                    $scope.user_email = '-';
               }
          });

     }]).controller('orderCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }
          
          $scope.filterFun =function(term){
               debugger;
               if(term==undefined){
                    term='';
               }
               var filter_data = {};
             
               if(filter_data.page == undefined || filter_data.page == '')
                    filter_data.page = 1;
               $http({
                    method: "GET",
                    url: path + 'user/orderDetail?limit=5&page=' + filter_data.page + '&user_id=' + $rootScope.userdata.user_id + '&role_id=' + $rootScope.userdata.role_id + '&created_by=' + $rootScope.userdata.created_by+'&term='+term
               }).then(function mySucces(response) {
                    debugger;
                    if (response.data.error == false) {
                         $scope.orderData = response.data.data;
                         $scope.total_order = response.data.total_record;

                         if (jQuery('#Pagination').data("twbs-pagination")) {
                              jQuery('#Pagination').twbsPagination('destroy');
                         }

                    jQuery('#Pagination').twbsPagination({
                         totalPages: response.data.total_page,
                         visiblePages: 5,
                         startPage: filter_data.page,
                         first: '<<',
                         last: '>>',
                         next: '>',
                         prev: '<',
                         onPageClick: function(event, page) {
                              $http({
                                   method: 'GET',
                                   async: true,
                                   url: path + 'user/orderDetail?limit=5&page=' + page + '&role_id=' + $rootScope.userdata.role_id + '&created_by=' + $rootScope.userdata.created_by + '&user_id=' + $rootScope.userdata.user_id}).
                                      then(function mySucces(response) {
                                           $scope.orderData = response.data.data;
                                           filter_data.page = page;
                                      });
                         }
                    });
               } else {
                    $scope.orderData = '-';
                    //show_notification('Error', 'No records available', '', 'no');
               }
          });
     }

     if($location.$$path == '/order')
          {
                 debugger;
              $scope.filterFun();
          }
          
          $scope.search = function(){
              var term=$('#orderID').val();
                $scope.filterFun(term);
        }
        
     }]).controller('inventoryadCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }
           if($stateParams.issueid){
               $http({
                    url: path + "user/getInventoryissue?issue_id="+$stateParams.issueid,
                    method: "GET",
                }).success(function(response) {
                     debugger;
                    if (response.error == false) {
                         $scope.inventory = response.data[0];
                         debugger;
                         $scope.desvc=$scope.inventory.issue;
                         console.log($scope.inventory);
                     } else {
                         show_notification('Error', response.message, '', 'no');
                    }
               });
          }
          $scope.addinventoryIssue=function(frm_id,type){
               if ($('#' + frm_id).valid()) {
                   $scope.inventory.user_id=$rootScope.userdata.user_id;
                   $scope.inventory.type=type;
                   console.log($scope.inventory);
                   $('#issusediv').addClass('hide');
                   $('#pleasewait').html('Please Wait...');
                   
                   $http({
                         url: path + "user/addinventoryIssue",
                         method: "POST",
                         data: $scope.inventory,
                     }).success(function(response){
                         debugger;
                        if (response.error == false) {
                             show_notification('Success', response.message, '#/inventoryad', 'yes');
                         } else {
                             show_notification('Error', response.message, '', 'no');
                        }
                   });
              }
          }
          $scope.openinventoryIssue = function() {
                    debugger;
                    var inventory_id=[];
                    var msku=[];
                    var a=[];
                    var transactionId=[];
                    var total=[];
                    var orderDate=[];
                    var reason=[];
                     var noreturnCount=0;
                     var order_count=[];
              $(':checkbox:checked').each(function(i){
                    transactionId[i] = $(this).attr("data-transactionId");
                 });
                if(Object.keys(transactionId).length==0){
                show_notification('Error' ,"Please select at least one checkbox" ,'','no');
                
           }else if(Object.keys(transactionId).length>3){
                 show_notification('Error' ,"You can select only 3 order." ,'','no');
           }else  { 
                         $("input:checkbox[name=inventory_id]:checked").each(function (i) {
                         inventory_id[i] = $(this).attr("id");
                         msku[i] = $(this).attr("data-msku");
                         transactionId[i] = $(this).attr("data-transactionId");
                         total[i] = $(this).attr("data-total");
                         orderDate[i] = $(this).attr("data-orderDate");
                         reason[i] = $(this).attr("data-reason");
                         
                         a.push({"inventory_id":inventory_id[i],"msku":msku[i],"transactionId":transactionId[i],"orderDate":orderDate[i],"total":total[i],"reason":reason[i]});
                      });
                         var msku='';
                         var transactionId='';
                         var msg='';
                         var summery='';
                        
                         for(var j=0;j<a.length;j++){
                             console.log(a);
                              var sym='';
                               var issueReson='';
                             if(j<a.length-1){
                                  sym =' | ';
                             }
                             msku +=a[j]['msku']+sym;
                             transactionId +=a[j]['transactionId']+sym;
                             
                             if(a[j]['reason']=='D' || a[j]['reason']=='E' || a[j]['reason']=='Q' || a[j]['reason']=='6'){
                                   issueReson ='Warehouse damaged';
                             }else if(a[j]['reason']=='M' || a[j]['reason']=='F' ){
                                   issueReson ='lost in the warehouse';

                             }else if(a[j]['reason']=='O' || a[j]['reason']=='N'){
                                   issueReson ='Destroyed';
                             }
                             msg +='On '+a[j]['orderDate']+' $'+a[j]['total']+' units of SKU '+a[j]['msku']+' were reported as '+issueReson+'. Please reimburse in full.';
                             msg +='\n';
                             summery+='\n';
                             summery+='SKU: '+a[j]['msku']+' - Please reimburse $'+(a[j]['total'])+' - Reason:'+issueReson;
                             summery+='';
                             
                        }
                        
                        if($rootScope.inventory==undefined){
                               $rootScope.inventory={};
                          }
                          $rootScope.inventory.issue= 'Hello \n'+msg  +  '\n In Summary:' + summery+'\n\nThanks, \n';;
                          $rootScope.inventory.mail_id= 'test@gmail.xom';
                          $rootScope.inventory.msku= msku;
                          $rootScope.inventory.transactionId= transactionId;
                          $rootScope.inventory.contactReason='Other FBA issue ';
                         window.location.href = '#/inventoryCase';
              }
                    
                    
                    
          }
          $scope.addIssue = function(frm_id) {
               if ($("#" + frm_id).valid()) {
                    debugger;
                    $scope.fbaissue.msku = $('#msku').val();
                     $('#issueModal').modal('hide');
                }
          }

          $http({
               method: "GET",
               url: path + 'user/inventoryDetail?user_id=' + $rootScope.userdata.user_id + '&role_id=' + $rootScope.userdata.role_id + '&created_by=' + $rootScope.userdata.created_by,
          }).then(function mySucces(response) {
               if (response.data.error == false) {
                    debugger;
                    $scope.inventoryDetailData = response.data.data.result;
                } else {
                    $scope.inventoryDetailData = '-';
               }
          });
          
//          var filter_data={};
//       
//        if(filter_data.page == undefined || filter_data.page == '')
//            filter_data.page = 1;
//        $http({               
//         method: "GET",
//         url: path + 'user/inventoryDetail?limit=5&page='+filter_data.page+'&user_id='+$rootScope.userdata.user_id+'&role_id=' + $rootScope.userdata.role_id + '&created_by=' + $rootScope.userdata.created_by,
//         }).then(function mySucces(response) {
//             if (response.data.error == false){
//                  debugger;
//                  console.log(response);
//                  $scope.inventoryDetailData = response.data.data.result;
//                  //$scope.orderData = response.data.data;
//                  $scope.total_order = response.data.data.total_record; 
//                  
//                  if(jQuery('#Pagination').data("twbs-pagination")) {
//                       jQuery('#Pagination').twbsPagination('destroy');
//                   }
//                   
//                   jQuery('#Pagination').twbsPagination({
//                        totalPages: response.data.total_page,
//                        visiblePages: 5,
//                        startPage :filter_data.page,
//                        first: '<<',
//                        last: '>>',
//                        next: '>',
//                        prev: '<',
//                        onPageClick: function(event, page) {
//                            $http({
//                                method: 'GET',
//                                async: true,
//                                url: path + 'user/inventoryDetail?limit=5&page='+page+'&user_id='+$rootScope.userdata.user_id+'&role_id=' + $rootScope.userdata.role_id + '&created_by=' + $rootScope.userdata.created_by}).
//                                then(function mySucces(response) {
//                                   $scope.inventoryDetailData = response.data.data.result;
//                                   filter_data.page = page;
//                            });
//                        }
//                    });
//              
//             } else {
//                $scope.inventoryDetailData='-';  
//             }
//         });
//         
         $scope.search = function(){
       
            if($scope.term != '' || $scope.term != undefined)
             console.log($scope.term) ;
               var filter_data={};
       
        if(filter_data.page == undefined || filter_data.page == '')
            filter_data.page = 1;
               $http({               
                method: "GET",
                url: path + 'user/inventoryDetail?limit=5&page='+filter_data.page+'&user_id='+$rootScope.userdata.user_id+'&role_id=' + $rootScope.userdata.role_id + '&created_by=' + $rootScope.userdata.created_by+'&term='+$scope.term,
                }).then(function mySucces(response) {
             if (response.data.error == false){
                  debugger;
                  console.log(response);
                  $scope.inventoryDetailData = response.data.data.result;
                  //$scope.orderData = response.data.data;
                  $scope.total_order = response.data.data.total_record; 
                  
                  if(jQuery('#Pagination').data("twbs-pagination")) {
                       jQuery('#Pagination').twbsPagination('destroy');
                   }
                   setTimeout(function(){
                         jQuery('#Pagination').twbsPagination({
                        totalPages: response.data.total_page,
                        visiblePages: 5,
                        startPage :filter_data.page,
                        first: '<<',
                        last: '>>',
                        next: '>',
                        prev: '<',
                        onPageClick: function(event, page) {
                            $http({
                                method: 'GET',
                                async: true,
                                url: path + 'user/inventoryDetail?limit=5&page='+page+'&user_id='+$rootScope.userdata.user_id+'&role_id=' + $rootScope.userdata.role_id + '&created_by=' + $rootScope.userdata.created_by}).
                                then(function mySucces(response) {
                                   $scope.inventoryDetailData = response.data.data.result;
                                   filter_data.page = page;
                            });
                        }
                    });
                   },500);
                   
               }
          });
         }
          $scope.globalFilter1 = function() {
               $scope.quoteDatatable1.fnFilter($scope.searchsubmited);
          };
           $scope.globalFilter2 = function() {
               $scope.quoteDatatable2.fnFilter($scope.searchresolved);
          };
     }]).controller('frontCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }
          $http({
               method: "GET",
               url: path + 'user/getPlan',
          }).then(function mySucces(response) {
               if (response.data.error == false) {
                    $scope.plan1 = response.data.data.data[0];
                    $scope.plan2 = response.data.data.data[1];
                    // $scope.destroyedByAmazonData=response.data.destroyedByAmazonData;
                    // $scope.holdingAccountData=response.data.holdingAccountData;
                    //$scope.misplacedData=response.data.misplacedData;
               } else {
                    //$scope.orderData = '-';
               }
          });


     }]).controller('dashboardCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
               
             
          }
          if($scope.user==undefined){
               $scope.user={};
                 $scope.user.user_id=$rootScope.userdata.user_id;
          }
          $scope.changeUser=function(){ 
               $rootScope.userdata.user_id =$scope.user.user_id;
               $cookies.put('userdata', JSON.stringify($rootScope.userdata));
                sessionStorage.setItem("userdata", JSON.stringify($rootScope.userdata));
               show_notification('Success', 'You have successfully changed the user. Go to Returns Manager to view data', '', 'no');
          }
          
           $http({
                    url: path + "user/allUserList",
                    method: "GET"
               }).success(function(response) {
   
                    if (response.error == false) {
                         $scope.userList=response.data;
                         
                         
                    } else {
                         //alert('token not get');
                     }
               });
//          setTimeout(function() {
//               body_sizer();
//          }, 100)


     }]).controller('activationCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }


     }]).controller('refundManagerCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }
          $scope.globalFilter = function() {
               $scope.quoteDatatable.fnFilter($scope.search_refund);
          };
        
          $scope.resolvedcase=function(order_id){
               $http({
               method: "GET",
               url: path + 'user/changesubmitedcase?order_id=' + order_id,
          }).then(function mySucces(response) {

               if (response.data.error == false) {
                    
                } else {
               
               }
          });
          }
          $scope.viewCase=function(order_id){
               $http({
                         method: "GET",
                         url: path + 'user/getIssueId?order_id='+order_id,
                    }).then(function mySucces(response) {
                         debugger;
                         if (response.data.error == false) {
                             window.location.href = '#/caselogView/'+response.data.data.issue_id;
                         } else {
                              show_notification('Error' ,response.data.message,'','no');
                         }
                    });
          }
          $scope.openIssue = function(msku) {
               $('.error').html('');
               $('#contactReason').val('');
               $('#issue').val('');
               $('#issueModal').modal('show');
               $('#msku').val(msku);
          }
          $scope.addDiscrepIssue=function(){
               debugger;
            var order_count=[];
              $(':checkbox:checked').each(function(i){
                    order_count[i] = $(this).attr("data-orderid");
                 });
               var selectcheckbox= Object.keys($scope.dis).length;
                if(selectcheckbox==0){
                    show_notification('Error' ,"Please select at least one checkbox" ,'','no');
               }else if(Object.keys(order_count).length>5){
                         show_notification('Error' ,"You can select only 5 order." ,'','no');
               }else {
                    var val = [];
                    var total=0;
                     $(':checkbox:checked').each(function(i){
                      val[i] = $(this).attr("data-total");
                      var price= (val[i]) * (-1);
                      total += parseFloat(price);
                    });
                     var totalPrice=total.toFixed(2);
                    if(totalPrice>300){
                          show_notification('Error' ,'The total value of the cases you have selected is more than <b>$300</b>. Please select less number of cases so that the total amount remains below <b>$300</b>. <br /> Your total refund amount <b>$'+totalPrice +'.</b>','','no');
                    }else {
                         var orderCase=''
                          var msg='';
                          var nodisCount=0;
                          $(':checkbox:checked').each(function(i){
                                   var refundAmount = $(this).attr("data-total");
                                   var order_id = $(this).attr("data-orderid");
                                     msg +="\n ";
                                             if(nodisCount==0 ){
                                                  msg +=' Upon reviewing our records, the reimbursement amount issued for Order ID '+order_id+' was '+refundAmount*(-1)+', it does not match $$$ which is the amount that was refunded to the customer. Please reimburse the difference of '+refundAmount*(-1)+'. \n';
                                             }else{
                                                  msg +=' In addition, Upon reviewing our records, the reimbursement amount issued for Order ID '+order_id+' was $$$, it does not match '+refundAmount *(-1)+' which is the amount that was refunded to the customer. Please reimburse the difference of '+refundAmount *(-1)+'. \n';
                                             }
                                                  orderCase+='\n';
                                                  orderCase+='Order ID '+order_id+' - Please reimburse '+refundAmount *(-1)+' - Reason: Refund Reimbursement Discrepancy';
                                                  nodisCount++;
                                         
                                 });
                                 if($rootScope.dis==undefined){
                                   $rootScope.dis={};
                                 } 
                                  $rootScope.dis.issue='Hello \n'+msg+'\n In Summary:'+orderCase+ '\nThanks,';
                                   window.location.href = '#/addDiscrep';
                    }

               }
          }

          $scope.MarkResolveIsuue = function() {
debugger;
               var Resolveorder = [];
               $(':checkbox:checked').each(function(i) {
                    Resolveorder[i] = $(this).attr("data-orderid");
               });
               console.log(Resolveorder);
               if (Resolveorder.length == 0) {
                    show_notification('Error', "Please select at least one checkbox", '', 'no');
               }
               $http({
                    url: path + "user/markresolvedescrepency",
                    method: "POST",
                    data: Resolveorder,
               }).success(function(response) {
                    debugger;
                    if (response.error == false) {
                         show_notification('Success', response.message, '#/refundManager', 'yes');
                    } else {
                         show_notification('Error', response.message, '', 'no');
                    }
               });
          }
          $scope.addIssue = function() {
               if($scope.reimeli==undefined){
               $scope.reimeli={};
             } 
             var order_count=[];
              $(':checkbox:checked').each(function(i){
                    order_count[i] = $(this).attr("data-orderid");
                 });
                if(Object.keys($scope.reimeli).length==0){
                show_notification('Error' ,"Please select at least one checkbox" ,'','no');
                
           }else if(Object.keys(order_count).length>3){
                 show_notification('Error' ,"You can select only 3 order." ,'','no');
           }else  {
                var flag=false;
                    if (Object.keys(order_count).length !=1 && Object.keys($scope.reimeli).length !=0) {
                         var val = [];
                         var total=0;
                         $(':checkbox:checked').each(function(i){
                           val[i] = $(this).attr("data-total");
                           var price= (val[i]) * (-1);
                           total += parseFloat(price);
                         });
                         var totalPrice=total.toFixed(2);
                    if(totalPrice>300){
                         flag=false;
                              show_notification('Error' ,'The total value of the cases you have selected is more than <b>$300</b>. Please select less number of cases so that the total amount remains below <b>$300</b>. <br /> Your total refund amount <b>$'+totalPrice +'.</b>','','no');
                    } else {
                         flag=true;
                    }
               } else {
                    flag= true;
               }
               if(flag==true){
                    var refundAmount=[];
                         var orderrefunddays=[];
                         var refundreturn=[];
                         var noreturn=[];
                         var order_id=[];
                         var refundDate=[];
                         var orderDate=[];
                          var a=[];
                          var noreturnCount=0;
                          var yesreturnCount=0;
                              $(':checkbox:checked').each(function(i){
                                   refundAmount[i] = $(this).attr("data-total");
                                   orderrefunddays[i] = $(this).attr("data-orderrefunddays");
                                   refundreturn[i] = $(this).attr("data-refundreturn");
                                   noreturn[i] = $(this).attr("data-noreturn");
                                   order_id[i] = $(this).attr("data-orderid");
                                   orderDate[i] = $(this).attr("data-orderDate");
                                   refundDate[i] = $(this).attr("data-refundDate");
                                   
                                  a.push({"refundamount":refundAmount[i],"orderrefunddays":orderrefunddays[i],"refundreturn":refundreturn[i],"noreturn":noreturn[i],"order_id":order_id[i],"refundDate":refundDate[i],"orderDate":orderDate[i]});
                                });
                              $rootScope.caseData=a;
                              var orderCase=''
                              var msg='';
                              var mulOrderId='';
                             
                               for(var j=0;j<a.length;j++){
                                    console.log(a);
                                     var sym=''
                                    if(j<a.length-1){
                                         sym =' | ';
                                    }
                                    mulOrderId +=a[j]['order_id']+sym;
                                    if(a[j]['orderrefunddays']<31) {
                                         if(a[j]['refundreturn']>0){
                                              var refunreturndays=a[j]['refundreturn'];
                                         }else{
                                              var refunreturndays=(a[j]['refundreturn'])*(-1);
                                         }
                                         
                                         if(a[j]['noreturn']==''){
                                               msg +="\n ";
                                             if(noreturnCount==0 ){
                                                  msg +='Looking through the details of order ID '+a[j]['order_id']+' it appears this customer was refunded  $'+(a[j]['refundamount'])*(-1)+' but the customer never actually returned the item and it is more then '+refunreturndays+' days since the refund. Please review this order and issue a reimbursement for $'+(a[j]['refundamount'])*(-1)+'. I appreciate your help with this matter. \n';
                                             }else{
                                                  msg +='In addition, Looking through the details of order ID '+a[j]['order_id']+' it appears this customer was refunded  $'+(a[j]['refundamount'])*(-1)+' but the customer never actually returned the item and it is more then '+refunreturndays+' days since the refund. Please review this order and issue a reimbursement for $'+(a[j]['refundamount'])*(-1)+'. I appreciate your help with this matter. \n';
                                             }
                                                  orderCase+='\n';
                                                  orderCase+='Order ID '+a[j]['order_id']+' - Please reimburse $'+(a[j]['refundamount'])*(-1)+' - Reason: No Customer Return ';
                                                 
                                                  noreturnCount++;
                                         }else if(a[j]['noreturn']!='' && a[j]['refundreturn']>=31){
                                                        msg +=" \n ";
                                                  if(noreturnCount==0 ){
                                                        msg +='Looking through the details of Order ID '+a[j]['order_id']+' it appears this customer was refunded $'+(a[j]['refundamount'])*(-1)+' and returned the item more then '+refunreturndays+' days after the refund. \n';
                                             }else {
                                                     msg +='In addition, Looking through the details of order ID '+a[j]['order_id']+' it appears this customer was refunded  $'+(a[j]['refundamount'])*(-1)+' but the customer never actually returned the item and it is more then '+refunreturndays+' days since the refund. Please review this order and issue a reimbursement for $'+(a[j]['refundamount'])*(-1)+'. I appreciate your help with this matter \n';
                                             }
                                              orderCase+='\n';
                                              orderCase+='Order ID '+a[j]['order_id']+' - Please reimburse $'+(a[j]['refundamount'])*(-1)+' - Reason: Late Return Shipment';
                                             orderCase+='';
                                                  
                                             noreturnCount++;
                                          }
                                   }else if(a[j]['orderrefunddays']>=31){ 
                                        msg +='\n';
                                        if(noreturnCount==0 ){
                                        msg +='Looking through the details of Order ID '+a[j]['order_id']+' it appears this customer was refunded $'+(a[j]['refundamount'])*(-1)+' on $'+a[j]['refundDate']+' and had ordered the product on '+a[j]['orderDate']+', more than 30 days before the refund was sent. \n Amazon policy states: \n "In most cases, customers have a 30-day window in which they can request to return an item. In addition, they have 30 days after they request a return to ship the item back to Amazon." \n Therefore, because this refund was against Amazon policy, please reimburse $'+(a[j]['refundamount'])*(-1)+'. \n';
                                   }else {
                                         msg +='In addition,  Looking through the details of Order ID '+a[j]['order_id']+' it appears this customer was refunded $'+(a[j]['refundamount'])*(-1)+' on '+a[j]['refundDate']+' and had ordered the product on '+a[j]['orderDate']+', more than 30 days before the refund was sent. \n Amazon policy states: \n "In most cases, customers have a 30-day window in which they can request to return an item. In addition, they have 30 days after they request a return to ship the item back to Amazon." \n Therefore, because this refund was against Amazon policy, please reimburse $'+(a[j]['refundamount'])*(-1)+'. \n';
                                   }
                                        orderCase+='\n';
                                        orderCase+='Order ID '+a[j]['order_id']+' - Please reimburse $'+(a[j]['refundamount'])*(-1)+' - Reason: Late Return';
                                         noreturnCount++;
                                   }
                          }
                          if($rootScope.reimeli==undefined){
                               $rootScope.reimeli={};
                          }
                          $rootScope.reimeli.issue= 'Hello \n'+msg  +  '\n In Summary:' + orderCase+'\n\nThanks, \n';
                          $rootScope.reimeli.mail_id= $rootScope.userdata.email;
                          $rootScope.reimeli.order_id= mulOrderId;
                          $rootScope.reimeli.contactReason='Customers and orders | Other customer and order issues | Order ID: '+ mulOrderId;
                          window.location.href = '#/addCase';
               }
                }
           }
           if($location.$path == '/addCase'){
                if($rootScope.reimeli!='' && $rootScope.reimeli !=undefined ){
                     
                }else {
                      window.location.href = '#/refundManager';
                }
          }
          
         $scope.customerIssue=function(frm_id,type){
              debugger;
              if ($('#' + frm_id).valid()) {
                   $scope.reimeli.user_id=$rootScope.userdata.user_id;
                   $scope.reimeli.type=type;
                   console.log($scope.reimeli);
                   $('#issusediv').addClass('hide');
                   $('#pleasewait').html('Please Wait...');
                   
                   $http({
                    url: path + "user/customerIssue",
                    method: "POST",
                    data: $scope.reimeli,
                }).success(function(response) {
                     debugger;
                    if (response.error == false) {
                         show_notification('Success', response.message, '#/refundManager', 'yes');
                     } else {
                         show_notification('Error', response.message, '', 'no');
                    }
               });
              }
             
         }
           $scope.globalFilter = function() {
               $scope.quoteDatatable.fnFilter($scope.search_orderId);
          };
           $scope.globalFilter1 = function() {
               $scope.quoteDatatable1.fnFilter($scope.searchReimbursement);
          };
           $scope.globalFilter2 = function() {
               $scope.quoteDatatable2.fnFilter($scope.searchFullyReimbursement);
          };
           $scope.globalFilter3 = function() {
               $scope.quoteDatatable3.fnFilter($scope.searchdiscrepency);
          };
          $scope.globalFilter4 = function() {
               $scope.quoteDatatable4.fnFilter($scope.searchsubmittedcase);
          };
          $scope.globalFilter5 = function() {
               $scope.quoteDatatable5.fnFilter($scope.searchresolvedcase);
          };
          if($stateParams.id){
                $http({
                    url: path + "user/refundOrderDetail?order_id="+$stateParams.id+'&user_id=' + $rootScope.userdata.user_id,
                    method: "GET",
                }).success(function(response) {
                     debugger;
                    if (response.error == false) {
                         $scope.orderDetail = response.data[0];
                     } else {
                         show_notification('Error', response.message, '', 'no');
                    }
               });
          }
          
          if($stateParams.issueid){
               $http({
                    url: path + "user/getCustomerissue?issue_id="+$stateParams.issueid,
                    method: "GET",
                }).success(function(response) {
                     debugger;
                    if (response.error == false) {
                         $scope.case = response.data[0];
                         debugger;
                         $scope.desvc=$scope.case.issue;
                         console.log($scope.case);
                     } else {
                         show_notification('Error', response.message, '', 'no');
                    }
               });
          }

     }]).controller('addpaymentsCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userPaymentData == 'undefined' || $rootScope.userPaymentData == '') {
               window.location.href = '#/login';
          }
          $(function() {
               var $form = $('#payment-form');
               $form.submit(function(event) {
                    $form.find('.submit').prop('disabled', true);

                    Stripe.card.createToken($form, stripeResponseHandler);
                    return false;
               });
          });


          function stripeResponseHandler(status, response) {
               var $form = $('#payment-form');

               if (response.error) { // Problem!

                    $form.find('.payment-errors').text(response.error.message);
                    $form.find('.submit').prop('disabled', false);

               } else {
                    $('.payment-errors').html('');
                    var token = response.id;
                    $form.append($('<input type="hidden" id="stripeToken" name="stripeToken" ng-model="token">').val(token));
                    $scope.submitPayment();
               }
          };

          $scope.submitPayment = function() {
               var token = $('#stripeToken').val();
               $scope.cardDetail.token = token;
               $scope.cardDetail.uname = $rootScope.userPaymentData.email;
               $scope.cardDetail.plan = $rootScope.userPaymentData.plan;
              $scope.cardDetail.user_id = $rootScope.userPaymentData.user_id;
               if ($scope.cardDetail.exp_month > 12) {

                    $scope.error = true;
                    $scope.expmonth = 'Please Insert the correct Month values';
                    return;
               } else {
                    $scope.expmonth = '';
               }

               if ($scope.cardDetail.cvc > 999) {
                    $scope.error = true;
                    $scope.expmonth = 'Please Insert the correct CVC values';
                    return;
               } else {
                    $scope.expmonth = '';
               }
               $('#paymentBtn').hide();
               $('#showLoder').show();
               $('#showLoderText').show();
               $http({
                    url: path + "user/stripePayments",
                    method: "post",
                    data: $scope.cardDetail
               }).success(function(response) {
                    if (response.error == false) {
                         $rootScope.userdata = response.data[0];
                         sessionStorage.setItem("userdata", JSON.stringify(response.data[0]));
                         show_notification('Success', response.message, '#/login', 'yes');
                    } else {
                         $('#paymentBtn').show();
                         show_notification('Error', response.message, '', 'no');
                    }
               });
          }

     }]).controller('user_manCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          $scope.globalFilter = function() {
               $scope.quoteDatatable.fnFilter($scope.search_user);
          };
          
     }]).controller('amazonIntegrationCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }
           $http({
                    url: path + "user/getUserData?user_id="+$rootScope.userdata.user_id,
                    method: "GET"
               }).success(function(response) {
                    if (response.error == false) {
                         $scope.userdata = response.data[0];
                    } else {
                     }
               });
               $scope.openStep2=function(){
                    $('#step2').removeClass('hide');
               }
               $scope.openStep3=function(){
                    $('#loading').addClass('hide');
                    $http({
                    url: path + "user/getUserToken?user_id="+$rootScope.userdata.user_id,
                    method: "GET"
               }).success(function(response) {
                    debugger;
                    if (response.error == false) {
                         $('#loading1').addClass('hide');
                         $scope.userToken = response.data[0];
                          $('#step2').removeClass('hide');
                         $('#step3').removeClass('hide');
                         $('#step4').removeClass('hide');
                         $('#loaderDiv').addClass('hide');
                         clearInterval(timer);
                    } else {
                         //alert('token not get');
                     }
               });
                    //$('#step3').removeClass('hide');
               }
               var timer = setInterval( $scope.openStep3, 5000);
 }]).controller('caseLogCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }
          $scope.addDraftcustomerIssue = function() {
               debugger;
                    if($scope.inventory==undefined){
                    $scope.inventory={};
                  } 
                  var issue_id=[];
                  var user_id=[];
                   $(':checkbox:checked').each(function(i){
                         issue_id[i] = $(this).attr("data-issue_id");
                         user_id[i] = $(this).attr("data-user_id");
                      });
                      $scope.inventory.issue_ids=issue_id;
                      $scope.inventory.user_ids=user_id;
                      if(Object.keys(issue_id).length==0){
                     show_notification('Error' ,"Please select at least one checkbox" ,'','no');

                }else if(Object.keys(issue_id).length>3){
                      show_notification('Error' ,"You can select only 3 order." ,'','no');
                }else  {
                         $http({
                        url: path + "user/sendDraftCase",
                        method: "POST",
                        data:$scope.inventory
                   }).success(function(response) {
                        debugger;
                             if (response.error == false) {
                                  show_notification('Success', response.message, '#/caseLog', 'yes');
                             } else {
                                  show_notification('Error', response.message, '', 'no');
                             }
                   });
                }
            
           }
          $scope.mydisabled=true;
            $scope.addCaseId=function(id,type){
                 if(type=='case'){
                         $('#caseIdDiv').removeClass('hide');
                         $('#casecross').removeClass('hide');
                         $('#rembIdDiv').addClass('hide');
                         $('#statusDiv').addClass('hide');
                          $('#rembcross').addClass('hide');
                          $('#statuscross').addClass('hide');
                          $('#notebtn').addClass('hide');
                          $scope.mydisabled=true;
                         $('#caseId').val(id);
                 }else if(type=="remb") {
                      $('#rembIdDiv').removeClass('hide');
                      $('#rembcross').removeClass('hide');
                      $('#statusDiv').addClass('hide');
                      $('#caseIdDiv').addClass('hide');
                       $('#casecross').addClass('hide');
                       $('#statuscross').addClass('hide');
                       $('#notebtn').addClass('hide');
                       $scope.mydisabled=true;
                      
                      $('#rembId').val(id);
                 }else if(type=="status"){
                      $('#statusDiv').removeClass('hide');
                      $('#statuscross').removeClass('hide');
                      $('#rembIdDiv').addClass('hide');
                      $('#caseIdDiv').addClass('hide');
                      $('#rembcross').addClass('hide');
                      $('#casecross').addClass('hide');
                      $('#notebtn').addClass('hide');
                      $scope.mydisabled=true;
                      $('#issue_status').val(id);
                  }
                  else if(type=="notes"){
                       debugger;
                      $('#statusDiv').addClass('hide');
                      $('#statuscross').addClass('hide');
                      $('#rembIdDiv').addClass('hide');
                      $('#caseIdDiv').addClass('hide');
                      $('#rembcross').addClass('hide');
                      $('#casecross').addClass('hide');
                      
                      $('#notebtn').removeClass('hide');
                      $('#note').val(id);
                      $scope.mydisabled=false;
                  }
          }
          $scope.status=function(){
               debugger;
               setTimeout(function(){
                    $('#rembpencil').addClass('hide');
               },100);
            
          }
          $scope.removeId=function(type){
                  $('#caseIdDiv').addClass('hide');
                  $('#rembIdDiv').addClass('hide');
                  $('#statusDiv').addClass('hide');
                  $('#rembcross').addClass('hide');
                  $('#casecross').addClass('hide');
                  $('#statuscross').addClass('hide');
          }
          $scope.saveCaseData=function(type,issue_id){
               $scope.saveCaseData={};
               $scope.saveCaseData.issue_id=issue_id;
               if(type=='case'){
                    $scope.saveCaseData.caseId=$('#caseId').val();
               }else if(type=="remb"){
                    $scope.saveCaseData.rembId=$('#rembId').val();
               }else if(type=="status"){
                    $scope.saveCaseData. issuse_status=$('#issue_status').val();
                    $scope.saveCaseData. order_id=$('#order_id').val();
               }else if(type=="notes"){
                    $scope.saveCaseData. note=$('#note').val();
                    $scope.saveCaseData. order_id=$('#order_id').val();
               }
               console.log($scope.saveCaseData);
                $http({
                    url: path + "user/saveCaseData",
                    method: "POST",
                    data:$scope.saveCaseData
               }).success(function(response) {
                    debugger;
                         if (response.error == false) {
                              show_notification('Success', response.message, '#/caselogView/'+$scope.saveCaseData.issue_id, 'yes');
                         } else {
                              show_notification('Error', response.message, '', 'no');
                         }
               });
               
          }
          if($stateParams.issue_id){
                         $http({
                              url: path + "user/caselogDetail?user_id="+$rootScope.userdata.user_id+'&issue_id='+$stateParams.issue_id,
                              method: "GET"
                         }).success(function(response) {
                              debugger;
                              if (response.error == false) {
                                   $scope.caseLog=response.data.caseLog[0];
                                   $scope.caseLogDetail=response.data.caseLogMesgDetail;
                                   console.log($scope.caseLogDetail);
                                   setTimeout(function(){
                                        $('#accordion-0').addClass('open');
                                   $('#accordion-0').css('display','block');
                                   },100);

                              } else {
                                   //alert('token not get');
                               }
                         });
          }
          $scope.acc=function(id){
               $("[id^=accordion]").removeClass('open');
               $('[id^=accordion]').css('display','none');
               $('#accordion-'+id).addClass('open');
               $('#accordion-'+id).css('display','block');
          }
          
          $scope.globalFilter = function() {
               $scope.quoteDatatable.fnFilter($scope.search_orderId);
          };
          $scope.globalFilter1 = function() {
               $scope.quoteDatatable1.fnFilter($scope.draft);
          };
}]).controller('userlistCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }
//          $scope.changeUser=function(){
//               debugger
//  
//               $rootScope.userdata.user_id =$scope.user.user_id;
////               sessionStorage.setItem("userdata", JSON.stringify(userdata));
//               show_notification('Success', 'You have successfully changed the user. Go to Returns Manager to view data', '', 'no');
//          }
          
           $http({
                    url: path + "user/allUserList",
                    method: "GET"
               }).success(function(response) {
                    debugger;
                    if (response.error == false) {
                         $scope.userList=response.data;
                         
                         
                    } else {
                         //alert('token not get');
                     }
               });
 
}]).controller('caselogEditCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }
          
          if($stateParams.issue_id){
                         $http({
                    url: path + "user/caseLogData?user_id="+$rootScope.userdata.user_id+'&issue_id='+$stateParams.issue_id,
                    method: "GET"
               }).success(function(response) {
                    debugger;
                    if (response.error == false) {
                         $scope.caseLogData=response.data[0];
                    } else {
                         //alert('token not get');
                     }
               });
          }
          $scope.editCase=function(frm_id){
                 if ($('#' + frm_id).valid()) {
                    $http({
                         method: "POST",
                         url: path + 'user/editCase',
                         data: $scope.caseLogData
                    }).then(function mySucces(response) {
                         if (response.data.error == false) {
                              show_notification('Success', response.data.message, '#/caseLog', 'no');
                         } else {
                              $('#resetdiv').removeClass('hide');
                              show_notification('Error', response.data.message, '', 'no');
                         }
                    });
               }
          }
          
 }]).controller('inventoryCaseLogCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          }
          $scope.addDraftinventoryIssue=function(){
                    debugger;
                    if($scope.inventory==undefined){
                    $scope.inventory={};
                  } 
                  var issue_id=[];
                  var user_id=[];
                   $(':checkbox:checked').each(function(i){
                         issue_id[i] = $(this).attr("data-issue_id");
                         user_id[i] = $(this).attr("data-user_id");
                      });
                      $scope.inventory.issue_ids=issue_id;
                      $scope.inventory.user_ids=user_id;
                      if(Object.keys(issue_id).length==0){
                     show_notification('Error' ,"Please select at least one checkbox" ,'','no');

                }else if(Object.keys(issue_id).length>3){
                      show_notification('Error' ,"You can select only 3 order." ,'','no');
                }else  {
                         $http({
                        url: path + "user/sendDraftInventoryCase",
                        method: "POST",
                        data:$scope.inventory
                   }).success(function(response) {
                        debugger;
                             if (response.error == false) {
                                  show_notification('Success', response.message, '#/inventoryCaseLog', 'yes');
                             } else {
                                  show_notification('Error', response.message, '', 'no');
                             }
                   });
                }
          }
          $scope.globalFilter = function() {
               $scope.quoteDatatable.fnFilter($scope.search_inventorycaseLog);
          };
          $scope.globalFilter1 = function() {
               $scope.quoteDatatable1.fnFilter($scope.search_inventorydraftLog);
          };
}]).controller('inventorycaseEditCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$stateParams', '$cookies', function($rootScope, $scope, $window, $http, $location, $stateParams, $cookies) {
          if ($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
          {
               $rootScope.userdata = JSON.parse($cookies.get('userdata'));
          };
          
          if($stateParams.issue_id){
                         $http({
                    url: path + "user/inventoryCaseData?user_id="+$rootScope.userdata.user_id+'&issue_id='+$stateParams.issue_id,
                    method: "GET"
               }).success(function(response) {
                    debugger;
                    if (response.error == false) {
                         $scope.inventoryCaseData=response.data[0];
                    } else {
                         //alert('token not get');
                     }
               });
          }
          $scope.editInventoryCase=function(frm_id){
                 if ($('#' + frm_id).valid()) {
                    $http({
                         method: "POST",
                         url: path + 'user/editInventoryCase',
                         data: $scope.inventoryCaseData
                    }).then(function mySucces(response) {
                         if (response.data.error == false) {
                              show_notification('Success', response.data.message, '#/inventoryCaseLog', 'no');
                         } else {
                              $('#resetdiv').removeClass('hide');
                              show_notification('Error', response.data.message, '', 'no');
                         }
                    });
               }
          }
}]);
     