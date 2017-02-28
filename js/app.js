  var app = angular.module('myapp', [
  'ngRoute','ngSanitize','ngMaterial','ngMessages','ngCookies','ui.router','datatables','material.svgAssetsCache','ui.bootstrap']);
  app.config(['$stateProvider','$urlRouterProvider',
  function($stateProvider,$urlRouterProvider) {
  /** @ngInject */
    $urlRouterProvider.otherwise("/login");
    $stateProvider.
//    state('/', {
//        url: '/',
//        templateUrl: 'views/front.html',
//        controller: 'frontCtrl',
//        headeruse: 'frontguest', 
//      }).
     state('/login', {
        url: '/login',
        templateUrl: 'views/login.html',
        headeruse: 'frontguest',
        controller: 'loginCtrl', 
      }).state('/forgotPass', {
        url: '/forgotPass',
        templateUrl: 'views/forgotPass.html',
        headeruse: 'frontguest',
        controller: 'loginCtrl', 
      }).state('/resetPassword/:token/:userId', {
        url: '/resetPassword/:token/:userId',
        templateUrl: 'views/resetPass.html',
        headeruse: 'frontguest',
        controller: 'loginCtrl',
      }).state('/addPassword/:token/:subUserId', {
        url: '/addPassword/:token/:subUserId',
        templateUrl: 'views/addPassword.html',
        headeruse: 'frontguest',
        controller: 'addPasswordCtrl',
      }).state('/account_activation/:token/:user_id', {
        url: '/account_activation/:token/:user_id',
        templateUrl: 'views/login.html',
        headeruse: 'frontguest',
        controller: 'loginCtrl',
        data: {
          access: {
            requiredPermissions:['1','2','3','4','5']
          }
        }
      }).state('/dashboard', {
        url: '/dashboard',
        templateUrl: 'views/dashboard.html',
        controller: 'dashboardCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'dashboard',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2','3','4','5']
          }
        }
      }).state('/customer', {
        url: '/customer',
        templateUrl: 'views/customer.html',
        controller: 'customerCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'customer',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2','3','4','5']
          }
        }
      }).state('/user', {
        url: '/user',
        templateUrl: 'views/user.html',
        controller: 'userCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'user',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2']
          }
        }
      }).state('/userlist', {
        url: '/userlist',
        templateUrl: 'views/userlist.html',
        controller: 'userlistCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'user',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2']
          }
        }
      }).state('/user_man', {
        url: '/user_man',
        templateUrl: 'views/user_man.html',
        controller: 'user_manCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'user_man',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2']
          }
        }
      }).state('/addUser', {
        url: '/addUser',
        templateUrl: 'views/addUser.html',
        controller: 'userAddCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'user_man',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2']
          }
        }
      }).state('/inventory ', {
        url: '/inventory',
        templateUrl: 'views/inventory.html',
        controller: 'inventoryCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'inventory',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2','3','4','5']
          }
        }
      }).state('/reimbursements ', {
        url: '/reimbursements',
        templateUrl: 'views/reimbursements.html',
        controller: 'reimbursementsCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'reimbursements',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2']
          }
        }
      }).state('/user/updatedprofile/:id ', {
        url: '/user/updatedprofile/:id',
        templateUrl: 'views/updateprofile.html',
        controller: 'updateprofileCtrl',
        headeruse: 'forguest',
        leftactivetab: 'setting',
        leftuse: 'forsetting',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2','3','4','5']
          }
        }
      }).state('/payments ', {
        url: '/payments',
        templateUrl: 'views/payments.html',
        controller: 'paymentsCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'payments',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2','3','4','5']
          }
        }
      }).state('/addpayments',{
          url: '/addpayments',
          templateUrl: 'views/addpayments.html',
          controller: 'addpaymentsCtrl',
          headeruse: 'frontguest',
          leftuse: 'forsetting',
          leftactivetab: 'payments',
          loginRequired:'No',
        data: {
          access: {
            requiredPermissions:['1','2','3','4','5']
          }
        }

      })  .state('/order ', {
        url: '/order',
        templateUrl: 'views/order.html',
        controller: 'orderCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'order',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2','3','4','5']
          }
        }
      }).state('/refundManager ', {
        url: '/refundManager',
        templateUrl: 'views/refundManager.html',
        controller: 'refundManagerCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'refundManager',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2']
          }
        }
      }).state('/addCase ', {
        url: '/addCase',
        templateUrl: 'views/addCase.html',
        controller: 'refundManagerCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'refundManager',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2']
          }
        }
      }).state('/inventoryCase ', {
        url: '/inventoryCase',
        templateUrl: 'views/inventoryCase.html',
        controller: 'inventoryadCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'inventoryad',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2']
          }
        }
      }).state('/caseView/:issueid ', {
        url: '/caseView/:issueid',
        templateUrl: 'views/caseView.html',
        controller: 'refundManagerCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'refundManager',
        loginRequired:'No',
        data: {
          access: {
            requiredPermissions:['1','2']
          }
        }
      }).state('/inventoryView/:issueid ', {
        url: '/inventoryView/:issueid',
        templateUrl: 'views/inventoryView.html',
        controller: 'inventoryadCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'inventoryad',
        loginRequired:'No',
        data: {
          access: {
            requiredPermissions:['1','2']
          }
        }
      }).state('/addDiscrep', {
        url: '/addDiscrep',
        templateUrl: 'views/addDiscrep.html',
        controller: 'refundManagerCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'refundManager',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2']
          }
        }
      }).state('/amazon_integration', {
        url: '/amazon_integration',
        templateUrl: 'views/amazonIntegration.html',
        controller: 'amazonIntegrationCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'amazon_integration',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2','3','4','5']
          }
        }
      }).state('/refundManager/view/:id ', {
        url: '/refundManager/view/:id',
        templateUrl: 'views/refundManagerView.html',
        controller: 'refundManagerCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'refundManager',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2']
          }
        }
      }).state('/inventoryad ', {
        url: '/inventoryad',
        templateUrl: 'views/inventoryAd.html',
        controller: 'inventoryadCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'inventoryad',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2']
          }
        }
      }).state('/register ', {
        url: '/register',
        headeruse: 'frontguest',
        templateUrl: 'views/register.html',
        controller: 'registerCtrl'
      }).state('/limitedaccess ', {
        url: '/limitedaccess',
        templateUrl: 'views/limitedaccess.html',
        controller: 'limitedaccessCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'limitedaccess',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2','3','4','5']
          }
        }
      }).state('/caseLog ', {
        url: '/caseLog',
        templateUrl: 'views/caseLog.html',
        controller: 'caseLogCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'caseLog',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2','3','4','5']
          }
        }
      }).state('/inventoryCaseLog ', {
        url: '/inventoryCaseLog',
        templateUrl: 'views/inventoryCaseLog.html',
        controller: 'inventoryCaseLogCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'inventoryCaseLog',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2','3','4','5']
          }
        }
      }).state('/caselogView/:issue_id ', {
        url: '/caselogView/:issue_id',
        templateUrl: 'views/caselogView.html',
        controller: 'caseLogCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'caseLog',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2','3','4','5']
          }
        }
      }).state('/caselogEdit/:issue_id ', {
        url: '/caselogEdit/:issue_id',
        templateUrl: 'views/caselogEdit.html',
        controller: 'caselogEditCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'caseLog',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2','3','4','5']
          }
        }
   }).state('/inventorycaseEdit/:issue_id ', {
        url: '/inventorycaseEdit/:issue_id',
        templateUrl: 'views/inventorycaseEdit.html',
        controller: 'inventorycaseEditCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'inventoryCaseLog',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2','3','4','5']
          }
        }
      }).state('/skuhistory/:sku ', {
        url: '/skuhistory/:sku',
        templateUrl: 'views/skuhistory.html',
        controller: 'skuhistoryCtrl',
        headeruse: 'forguest',
        leftuse: 'forsetting',
        leftactivetab: 'inventoryad',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2','3','4','5']
          }
        }
        
      }).state('/editRembId/:inventory_id/:reason ', {
        url: '/editRembId/:inventory_id/:reason',
        templateUrl: 'views/editRembId.html',
        controller: 'editRembIdCtrl',
        headeruse: 'forguest',
        leftactivetab: 'inventoryad',
        loginRequired:'Yes',
        data: {
          access: {
            requiredPermissions:['1','2','3','4','5']
          }
        }
      })
  }]);
 app.run(['$rootScope', '$cookies','$state','authorization',function($rootScope,$cookies,$state,authorization) {

  $rootScope.$on('$stateChangeStart', function(event, toState) {
        if($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
        {
          $rootScope.userdata = JSON.parse($cookies.get('userdata'));
        }

      if(toState.data !== undefined && toState.data.access !== undefined) {
        authorised = authorization.authorize(toState.data.access.requiredPermissions,toState.data.access.permissionCheckType);
        if(authorised === authorization.constants.loginRequired) {
          event.preventDefault();
          $state.go('/login');
        } else if(authorised === authorization.constants.notAuthorised){
          event.preventDefault();
        
          if($rootScope.userdata.role_id != undefined) {
              //$state.go('/euser_booking_view');
          } else {
              $cookies.remove('userdata');
              window.location.href = '#/login';
              $rootScope.userdata = '';
          }
        }
      }
  });

      // On this we are checking authentication.

 $rootScope.$on('$stateChangeSuccess', function(event, toState) {
          
           var hash = window.location.hash.substr(1);
           var hash1 = window.location.hash.substr(1);
           var userProfile=hash1.split('/');
            var caseView = hash.indexOf("caseView");
            var inventoryView = hash.indexOf("inventoryView");
           var account_activation = hash.indexOf("account_activation");
           var account_register = hash.indexOf("register?plan_id");
           var forgotPass = hash.indexOf("forgotPass");
           var resetPassword = hash.indexOf("resetPassword");
           var addPassword = hash.indexOf("addPassword");
          
           var addpayments = hash.indexOf("addpayments");
           if(hash == '/login' && $cookies.get('userdata') !== undefined)             {
              $state.go('/dashboard');
             location.reload();
           }
          
          
          if($cookies.get('userdata') === undefined && (hash !== '/register') &&  (hash !== '/') && (account_activation == -1) && (addpayments == -1) && (account_register== -1) && (forgotPass == -1) && (resetPassword== -1) && (addPassword == -1) && (caseView == -1) && (inventoryView == -1)) {
              window.location.href = '#/login';
          }
         
          if($rootScope.userdata!==undefined  &&  hash  != '/login' &&  hash  != '/register' && userProfile[2] !='updatedprofile'){
               if($rootScope.userdata.amazonStatus!=3){
                    window.location.href = '#/amazon_integration';
               }
          }
          
          if(toState.headeruse !== undefined) {
              $rootScope.headeruse = toState.headeruse;
          } else {
            $rootScope.headeruse = "";
          }
           if(toState.leftuse !== undefined)
              $rootScope.leftuse = toState.leftuse;
          else
            $rootScope.leftuse = "";
          if(toState.leftactivetab !== undefined)
              $rootScope.leftactivetab = toState.leftactivetab;
          else
            $rootScope.leftactivetab = "";
       
       
         setTimeout(function(){
           body_sizer();   
           $(window).scroll(function(){
               body_sizer();
            })
         },500);
           
        
    });

 }]);
