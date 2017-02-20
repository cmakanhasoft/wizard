app.filter('range', function() {
  return function(input, total, type) {
    total = parseInt(total);
    var d = new Date();
    var n = d.getFullYear();
    for (var i=1; i<=total; i++) {
      if(type=="year"){
        input.push(n);
        n = n+1;
      } else{
        input.push(i);
      }
    }
    return input;
  };
});
// This is to prevent unauthorized access.authorization by user level.
app.factory('authorization', authorization);

function authorization($rootScope) {
    var service = {
      authorize: authorize,
      constants: {
        authorised: 0,
        notAuthorised: 2
      }
    };
    return service;
    function authorize(requiredPermissions, permissionCheckType) {
      var result = service.constants.authorised,
          user = $rootScope.userdata,
          loweredPermissions = [],
          hasPermission = true,
          permission;
      permissionCheckType = permissionCheckType || 'atLeastOne';
        
       if($rootScope.userdata == null) {
            return false;
       }
       if (requiredPermissions) {
          loweredPermissions = [];
          loweredPermissions.push(user.role_id);
            
          for(var i = 0; i < requiredPermissions.length; i += 1) {
              permission = requiredPermissions[i].toLowerCase();

              if (permissionCheckType === 'combinationRequired') {
                  hasPermission = hasPermission && loweredPermissions.indexOf(permission) > -1;
                  // if all the permissions are required and hasPermission is false there is no point carrying on
                  if (hasPermission === false) {
                      break;
                  }
              } else if (permissionCheckType === 'atLeastOne') {
                  hasPermission = loweredPermissions.indexOf(permission) > -1;
                  // if we only need one of the permissions and we have it there is no point carrying on
                  if (hasPermission) {
                      break;
                  }
              }
          }

          result = hasPermission ?
                   service.constants.authorised :
                   service.constants.notAuthorised;
      }

      return result;
    }
  }
app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl) {
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd,{
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(responce) {
            
         //sessionStorage.setItem("res",responce);
        })
        .error(function(){
        });
    }
}]);
// This is to prevent unauthorized access.authorization by user level.
app.factory('authorization', authorization);
function authorization($rootScope) {
    var service = {
      authorize: authorize,
      constants: {
        authorised: 0,
        notAuthorised: 2
      }
    };
    return service;
    function authorize(requiredPermissions, permissionCheckType) {
      var result = service.constants.authorised,
          user = $rootScope.userdata,
          loweredPermissions = [],
          hasPermission = true,
          permission;
      permissionCheckType = permissionCheckType || 'atLeastOne';
        
       if($rootScope.userdata == null) {
            return false;
       }
       if (requiredPermissions) {
          loweredPermissions = [];
          loweredPermissions.push(user.role_id);
            
          for(var i = 0; i < requiredPermissions.length; i += 1) {
              permission = requiredPermissions[i].toLowerCase();

              if (permissionCheckType === 'combinationRequired') {
                  hasPermission = hasPermission && loweredPermissions.indexOf(permission) > -1;
                  // if all the permissions are required and hasPermission is false there is no point carrying on
                  if (hasPermission === false) {
                      break;
                  }
              } else if (permissionCheckType === 'atLeastOne') {
                  hasPermission = loweredPermissions.indexOf(permission) > -1;
                  // if we only need one of the permissions and we have it there is no point carrying on
                  if (hasPermission) {
                      break;
                  }
              }
          }

          result = hasPermission ?
                   service.constants.authorised :
                   service.constants.notAuthorised;
      }

      return result;
    }
  }
app.filter('pro_rated_rent', function($filter) {
  return function(value ,index) {
      var sum =0;
      var val = value[index].amount;
      var Pro_rated_rent = document.getElementById("Pro_rated_rent").checked;
      if(val != undefined && Pro_rated_rent == true) {   
            var lease_start = $("#lease_start").val();
            var d = new Date(lease_start);
            var date = d.getDate();
            var month = d.getMonth() + 1;
            var year = d.getFullYear();
            var no_of_days = getDaysInMonth(month,year);
            var remainig_days  = (no_of_days + 1) - date;
            var pro_rented = (val/no_of_days) * remainig_days; 
            sum = parseFloat(pro_rented.toFixed(2));
      } 
      return sum;
  };
});
//Booking Calculation.
app.filter('bookingCalculation', function($http,$rootScope,$filter) {
    return function(BookingItem,type,Booking,TaxArray,Tax_id,index,other_param) {
      if($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
      {
        $rootScope.userdata = JSON.parse($cookies.get('userdata'));
      }
      
      if(BookingItem == undefined)
         return 0;
      
      var premium_percentage = 0;
      var no_deposit_fee = 0;
      var no_deposit_type = '';
      var no_of_days = 0;
      //Globle Variable Declation.
      if($rootScope.userdata.master_data.premium_percentage != undefined && $rootScope.userdata.master_data.premium_percentage != '') {
         premium_percentage = parseInt($rootScope.userdata.master_data.premium_percentage);
      }
      if($rootScope.userdata.master_data.no_deposit_type != undefined && $rootScope.userdata.master_data.deposite_fees != undefined) {
         no_deposit_fee = parseFloat($rootScope.userdata.master_data.deposite_fees);
         no_deposit_type = $rootScope.userdata.master_data.no_deposit_type;
      }
      if(Booking.lease_start_date != undefined && Booking.lease_end_date != undefined && Booking.lease_start_date != '' && Booking.lease_end_date != '')       {
          no_of_days = Noofdays(Booking.lease_start_date,Booking.lease_end_date);
      }
      if(Booking.lease_start_date != undefined) {
        var NoOfDaysInMonthArray = getMonthDays(Booking.lease_start_date); 
        var NoOfDaysInMonth = NoOfDaysInMonthArray.no_of_days;
        var RemainDaysInMonth = NoOfDaysInMonthArray.remaining_days;
     }
     if(type == 'totalAmount') {
          var amount = 0;
          var unit_amount = 0;
          var pro_rated_rent = 0;
          var premium = 0;
          var no_deposit = 0;
          var no_deposit_amount = 0;
          var discount = 0;
          var type = '';
          var credit_due = 0;
          var RowwiseArray = []; 
          var Obj = {}; 
          var remaining_discount = 0;
          var gr_amount = 0;
          var pro_rated_rent_before_disc = 0;
          var used_credit = 0;
          var previous_due = 0;
          var remaning_due = 0;
          $.each(BookingItem, function(key, data) {
              if(Booking.is_pro_rated != undefined && (Booking.is_pro_rated == 'Yes' || Booking.is_pro_rated == true)) {
               //Pro Rated Rent.
               if(data.unit_type_id != undefined && data.amount != undefined) {
                 if(Booking.billing_type == 'monthly') {
                   amount = parseFloat(data.amount);
                   unit_amount = parseFloat(data.amount);
                  //Premium.
                   if(premium_percentage !== 0 && no_of_days > 0 && no_of_days < 90) {
                      premium = (amount * (premium_percentage / 100));
                      amount = parseFloat(amount) + parseFloat(premium);
                   }
                   if(Booking.previous_due != undefined && Booking.previous_due != '') {
                       previous_due = parseFloat(Booking.previous_due);
                       if(remaning_due != 'empty' && remaning_due != 0) {
                           previous_due = parseFloat(remaning_due);
                       }
                       if(parseFloat(previous_due) >= parseFloat(amount)) {
                           used_credit = parseFloat(amount); 
                           remaning_due = parseFloat(previous_due) - parseFloat(amount);
                       } else if(parseFloat(Booking.previous_due) < parseFloat(amount)) {
                           used_credit = parseFloat(previous_due);
                           remaning_due = 'empty';
                       }
                   }
                   
                   //No Deposite.
                   pro_rated_rent_before_disc = parseFloat((amount / NoOfDaysInMonth) *  RemainDaysInMonth);
                   
                  if(Booking.is_no_deposited != undefined && (Booking.is_no_deposited == 'Yes' || Booking.is_no_deposited == true) && no_deposit_fee != 0 && no_deposit_type === 'percentage') {
                     no_deposit_amount = (amount * (no_deposit_fee / 100));
                   } else {
                     no_deposit_amount = 0;
                   }
                   
                   //Discount.
                   if(Booking.scheme_id != undefined && Booking.scheme_id !=0 && Booking.discount_type != undefined && Booking.discount != undefined) {
                     if(Booking.discount_type == 'percentage') {
                           discount = parseFloat(amount * (Booking.discount / 100));
                      } else if(Booking.discount_type == 'amount') {
                          discount = parseFloat(Booking.discount);
                          if(other_param != undefined && other_param != '') {
                            discount = parseFloat(other_param) + parseFloat(discount);
                          }
                          if(remaining_discount != 0 && remaining_discount != 'empty') {
                             discount =  remaining_discount;
                          } else if(remaining_discount == 'empty') {
                              discount = 0;
                          }
                     }
                   } else {
                       discount = 0;
                   }
                   
                   if(discount != 0 && Booking.discount_type == 'amount') {
                       if(parseFloat(discount) > parseFloat(amount)) {
                          amount = parseFloat(discount) - parseFloat(amount);
                          remaining_discount = amount;
                          credit_due = amount;
                          amount = 0;
                       } else {
                          amount = parseFloat(amount) - parseFloat(discount);
                          remaining_discount = 'empty';
                          credit_due = amount;
                       }
                    } else if(discount != 0 && Booking.discount_type == 'percentage') {
                        amount = parseFloat(amount) - parseFloat(discount);
                    }
                    if(remaining_discount == 'empty') {
                       credit_due = 0;
                    }
                   //Pro Rated Rent.
                   pro_rated_rent = (amount / NoOfDaysInMonth) *  RemainDaysInMonth;
                   
                   Obj = {'type':'Pro_rated','unit_price':unit_amount,'final_amount':amount,'pro_rated':pro_rated_rent.toFixed(2),'premium':premium.toFixed(2),'no_deposit':no_deposit_amount.toFixed(2),'discount':discount.toFixed(2),'credit_due':credit_due.toFixed(2),'unit_type_id':data.unit_type_id,'first_month':'1','actual_amount':pro_rated_rent_before_disc,'previous_due_amount':used_credit}
                   
                   RowwiseArray.push(Obj);
                   
                   } else if(Booking.billing_type == 'annual') {
                   amount = parseFloat(data.amount);
                   unit_amount = parseFloat(data.amount);
                   var actual_price = 0;

                  //Premium.
                  
                  if(Booking.previous_due != undefined && Booking.previous_due != '') {
                       previous_due = parseFloat(Booking.previous_due);
                       if(remaning_due != 'empty' && remaning_due != 0) {
                           previous_due = parseFloat(remaning_due);
                       }
                       if(remaning_due == 'empty') {
                           previous_due = 0;
                       }
                       if(parseFloat(previous_due) >= parseFloat(amount)) {
                           used_credit = parseFloat(amount); 
                           remaning_due = parseFloat(previous_due) - parseFloat(amount);
                       } else if(parseFloat(Booking.previous_due) < parseFloat(amount)) {
                           used_credit = parseFloat(previous_due);
                           remaning_due = 'empty';
                       }
                   }
                   
                   if(premium_percentage !== 0 && no_of_days > 0 && no_of_days < 90) {
                      premium = (amount * (premium_percentage / 100));
                      amount = parseFloat(amount) + parseFloat(premium);
                      premium = 0;
                   }
                   
                   pro_rated_rent_before_disc = parseFloat((amount / NoOfDaysInMonth) *  RemainDaysInMonth);
                   //No Deposite.
                   
                  if(Booking.is_no_deposited != undefined && (Booking.is_no_deposited == 'Yes' || Booking.is_no_deposited == true) && no_deposit_fee != 0 && no_deposit_type === 'percentage') {
                     no_deposit_amount = (amount * (no_deposit_fee / 100));
                   } else if(Booking.is_no_deposited != undefined && (Booking.is_no_deposited == 'Yes' || Booking.is_no_deposited == true) && no_deposit_fee != 0 && no_deposit_type === 'amount'){
                     no_deposit_amount = parseFloat(no_deposit_fee);
                   } else {
                     no_deposit_amount = 0;
                   }
                   
                   //Discount.
                   if(Booking.scheme_id != undefined && Booking.scheme_id !=0 && Booking.discount_type != undefined && Booking.discount != undefined)                       {
                     if(Booking.discount_type == 'percentage') {
                           discount = parseFloat(amount * (Booking.discount / 100));
                      } else if(Booking.discount_type == 'amount') {
                          discount = parseFloat(Booking.discount);
                          
                          if(Booking.duration != undefined && Booking.duration != '') {
                           discount = parseFloat(discount) *  parseFloat(Booking.duration);
                          }
                          
                          if(remaining_discount != 0 && remaining_discount != 'empty') {
                             discount =  remaining_discount;
                          } else if(remaining_discount == 'empty') {
                              discount = 0;
                          }
                     }
                   } else {
                       discount = 0;
                   }
                   
                   if(discount != 0 && Booking.discount_type == 'amount') {
                       if(parseFloat(discount) > parseFloat(amount)) {
                          amount = parseFloat(discount) - parseFloat(amount);
                          remaining_discount = amount;
                          credit_due = amount;
                          amount = 0;
                       } else {
                          amount = parseFloat(amount) - parseFloat(discount);
                          remaining_discount = 'empty';
                          credit_due = amount;
                       }
                    } else if(discount != 0 && Booking.discount_type == 'percentage') {
                        amount = parseFloat(amount) - parseFloat(discount);
                    }
                    
                    if(remaining_discount == 'empty') {
                       credit_due = 0;
                    }
                   
                    //Pro Rated Rent.
                    pro_rated_rent = parseFloat((amount / NoOfDaysInMonth) *  RemainDaysInMonth);
                   
                   Obj = {'type':'Pro_rated','unit_price':unit_amount,'final_amount':amount,'pro_rated':pro_rated_rent.toFixed(2),'premium':premium.toFixed(2),'no_deposit':no_deposit_amount.toFixed(2),'discount':discount.toFixed(2),'credit_due':credit_due.toFixed(2),'unit_type_id':data.unit_type_id,'first_month':'1','actual_amount':pro_rated_rent_before_disc,'previous_due_amount':used_credit}
                   
                   RowwiseArray.push(Obj);
                   
                   amount = parseFloat(data.amount) * 11;
                   unit_amount = parseFloat(data.amount) * 11;
                   
                  pro_rated_rent_before_disc = parseFloat(unit_amount);
                  //Premium.
                  if(premium_percentage !== 0 && no_of_days > 0 && no_of_days < 90) {
                      premium = (amount * (premium_percentage / 100));
                      amount = parseFloat(amount) + parseFloat(premium);
                  }
                  //No Deposite.
                  if(Booking.previous_due != undefined && Booking.previous_due != '') {
                       previous_due = parseFloat(Booking.previous_due);
                       if(remaning_due != 'empty' && remaning_due != 0) {
                           previous_due = parseFloat(remaning_due);
                       }
                       if(remaning_due == 'empty') {
                           previous_due = 0;
                       }
                       if(parseFloat(previous_due) >= parseFloat(amount)) {
                           used_credit = parseFloat(amount); 
                           remaning_due = parseFloat(previous_due) - parseFloat(amount);
                       } else if(parseFloat(Booking.previous_due) < parseFloat(amount)) {
                           used_credit = parseFloat(previous_due);
                           remaning_due = 'empty';
                       }
                   }
                   
                  if(Booking.is_no_deposited != undefined && (Booking.is_no_deposited == 'Yes' || Booking.is_no_deposited == true) && no_deposit_fee != 0 && no_deposit_type === 'percentage') {
                     no_deposit_amount = (amount * (no_deposit_fee / 100));
                   } else if(Booking.is_no_deposited != undefined && (Booking.is_no_deposited == 'Yes' || Booking.is_no_deposited == true) && no_deposit_fee != 0 && no_deposit_type === 'amount') {
                     no_deposit_amount = parseFloat(no_deposit_fee);
                   } else {
                     no_deposit_amount = 0;
                   }
                   
                   if(Booking.scheme_id != undefined && Booking.scheme_id !=0 && Booking.discount_type != undefined && Booking.discount != undefined)                       {
                     if(Booking.discount_type == 'percentage') {
                           discount = parseFloat(amount * (Booking.discount / 100));
                      } else if(Booking.discount_type == 'amount') {
                          discount = parseFloat(Booking.discount);
                          if(Booking.duration != undefined && Booking.duration != '') {
                           discount = parseFloat(discount) *  parseFloat(Booking.duration);
                          }
                          if(remaining_discount != 0 && remaining_discount != 'empty') {
                             discount =  remaining_discount;
                          } else if(remaining_discount == 'empty') {
                              discount = 0;
                          }
                     }
                   } else {
                       discount = 0;
                   }
                   
                   if(discount != 0 && Booking.discount_type == 'amount') {
                       if(parseFloat(discount) > parseFloat(amount)) {
                          amount = parseFloat(discount) - parseFloat(amount);
                          remaining_discount = amount;
                          credit_due = amount;
                          amount = 0;
                       } else {
                          amount = parseFloat(amount) - parseFloat(discount);
                          remaining_discount = 'empty';
                          credit_due = amount;
                       }
                       unit_amount = parseFloat(amount);
                    } else if(discount != 0 && Booking.discount_type == 'percentage') {
                        amount = parseFloat(amount) - parseFloat(discount);
                        unit_amount = parseFloat(amount);
                    }
                    
                    if(remaining_discount == 'empty') {
                       credit_due = 0;
                    }
                    
                    pro_rated_rent =  parseFloat(unit_amount);
                    Obj = {'type':'Pro_rated','unit_price':unit_amount,'final_amount':amount,'pro_rated':pro_rated_rent.toFixed(2),'premium':premium.toFixed(2),'no_deposit':no_deposit_amount.toFixed(2),'discount':discount.toFixed(2),'credit_due':credit_due.toFixed(2),'unit_type_id':data.unit_type_id,'first_month':'0','actual_amount':pro_rated_rent_before_disc,'previous_due_amount':used_credit}
                    RowwiseArray.push(Obj);
                   }
              }
              } else if(Booking.is_pro_rated == undefined ||Booking.is_pro_rated == 'No' || Booking.is_pro_rated == false) {
               //Total Rent.   
               if(data.unit_type_id != undefined && data.amount != undefined) {
                      amount = parseFloat(data.amount);
                      unit_amount = parseFloat(data.amount);
                  if(Booking.billing_type == 'monthly') {
                      amount = parseFloat(amount * 1);
                      unit_amount = parseFloat(data.amount);
                  } else if(Booking.billing_type == 'annual') {
                      amount = parseFloat(amount * 12);
                      unit_amount = amount;
                  }
                  //Premium.
                  
                  if(Booking.previous_due != undefined && Booking.previous_due != '') {
                       previous_due = parseFloat(Booking.previous_due);
                       if(remaning_due != 'empty' && remaning_due != 0) {
                           previous_due = parseFloat(remaning_due);
                       }
                       if(remaning_due == 'empty') {
                           previous_due = 0;
                       }
                       if(parseFloat(previous_due) >= parseFloat(amount)) {
                           used_credit = parseFloat(amount); 
                           //amount = 0;
                       } else if(parseFloat(previous_due) < parseFloat(amount)) {
                           used_credit = parseFloat(previous_due);
                           //amount = parseFloat(amount) - parseFloat(Booking.previous_due);
                       }
                  }
                   
                  if(premium_percentage !== 0 && no_of_days > 0 && no_of_days < 90) {
                      premium = (amount * (premium_percentage / 100));
                      amount = parseFloat(amount) + parseFloat(premium);
                  }
                  
                   //No Deposite.
                  if(Booking.is_no_deposited != undefined && (Booking.is_no_deposited == 'Yes' || Booking.is_no_deposited == true) && no_deposit_fee != 0 && no_deposit_type === 'percentage') {
                     no_deposit_amount = (amount * (no_deposit_fee / 100));
                   } else if(Booking.is_no_deposited != undefined && (Booking.is_no_deposited == 'Yes' || Booking.is_no_deposited == true) && no_deposit_fee != 0 && no_deposit_type === 'amount') {
                       no_deposit_amount = parseFloat(no_deposit_fee);
                   } else {
                      no_deposit_amount = 0; 
                   }
                   
                   //Discount.
                   if(Booking.scheme_id != undefined && Booking.scheme_id !=0 && Booking.discount_type != undefined && Booking.discount != undefined) {
                    if(Booking.discount_type == 'percentage') {
                           discount = parseFloat(amount * (Booking.discount / 100));
                    } else if(Booking.discount_type == 'amount') {
                          discount = parseFloat(Booking.discount);
                          if(remaining_discount != 0 && remaining_discount != 'empty') {
                             discount =  remaining_discount;
                          } else if(remaining_discount == 'empty') {
                              discount = 0;
                          }
                    } 
                    } else {
                       discount = 0;
                    }
                    
                    if(discount != 0 && Booking.discount_type == 'amount') {
                       if(parseFloat(discount) > parseFloat(amount)) {
                          amount = parseFloat(discount) - parseFloat(amount);
                          remaining_discount = amount;
                          credit_due = amount;
                          gr_amount = 0;
                          amount = 0;
                       } else {
                          amount = parseFloat(amount) - parseFloat(discount);
                          remaining_discount = 'empty';
                          credit_due = amount;
                          gr_amount = amount;
                       }
                    } else if(discount != 0 && Booking.discount_type == 'percentage') {
                        amount = parseFloat(amount) - parseFloat(discount);
                        //unit_amount = parseFloat(amount);
                    }
                    
                    if(remaining_discount == 'empty') {
                        credit_due = 0;
                    }
                    
                   Obj = {'type':'full_amount','gross_amount':gr_amount.toFixed(2),'unit_price':unit_amount,'final_amount':amount,'pro_rated':pro_rated_rent.toFixed(2),'premium':premium.toFixed(2),'no_deposit':no_deposit_amount.toFixed(2),'discount':discount.toFixed(2),'credit_due':credit_due.toFixed(2),'unit_type_id':data.unit_type_id,'previous_due_amount':parseFloat(used_credit)}
                   RowwiseArray.push(Obj);
               }
               }
          });
          return RowwiseArray;
      }
      if(type == 'credit_due') {
          var total_amount = $filter('bookingCalculation')(BookingItem, "totalAmount",Booking,'');
          var credit_due = 0; 
          if(total_amount.length != undefined && total_amount.length > 0) {
          $.each(total_amount, function(key, data) {
            credit_due = parseFloat(data.credit_due);
          });
          }
          if(other_param != undefined && other_param != '') {
              credit_due += parseFloat(other_param);
          }
          return credit_due.toFixed(2);
      }
      if(type == 'pro_rated_rent') {
            var no_deposit_amount = 0;
            var total_premium = 0;
            if(BookingItem[index].amount != undefined && (Booking.is_pro_rated == 'Yes' || Booking.is_pro_rated == true)) {
             var unit_type_id = BookingItem[index].unit_type_id
             var total_amount = $filter('bookingCalculation')(BookingItem, "totalAmount",Booking,'');
             var gross = $filter('bookingCalculation')(BookingItem, "gross",Booking,'');
             var total_premium = 0; 
             if(total_amount.length != undefined && total_amount.length > 0 && parseFloat(gross) > 0) {
                        $.each(total_amount, function(key, data) {
                            if(unit_type_id == data.unit_type_id && data.first_month == '1') {
                            total_premium += parseFloat(data.pro_rated);
                            }
                        });
             }
         }
         return total_premium.toFixed(2);
      }
      if(type == 'commission') {
         var commission = 0;
         if(Tax_id == undefined || Tax_id.length == 0) {
            return commission.toFixed(2);
         }
         if(Tax_id[0].amount_type == 'amount') {
             commission = Tax_id[0].amount;
         } else {
         var remaining_discount = 0;
         var no_deposit_amount = 0;
         $.each(BookingItem, function(key, data) {
               if(data.unit_type_id != undefined && data.amount != undefined) {
                   amount = parseFloat(data.amount);
                   unit_amount = parseFloat(data.amount);
                  //Premium.
                   if(premium_percentage !== 0 && no_of_days > 0 && no_of_days < 90) {
                      premium = (amount * (premium_percentage / 100));
                      amount = parseFloat(amount) + parseFloat(premium);
                   }
                   
                   //No Deposit.
                   if(Booking.is_no_deposited != undefined && (Booking.is_no_deposited == 'Yes' || Booking.is_no_deposited == true) && no_deposit_fee != 0 && no_deposit_type === 'percentage') {
                     no_deposit_amount = (amount * (no_deposit_fee / 100));
                   } else if(Booking.is_no_deposited != undefined && (Booking.is_no_deposited == 'Yes' || Booking.is_no_deposited == true) && no_deposit_fee != 0 && no_deposit_type === 'amount') {
                     no_deposit_amount = parseFloat(no_deposit_fee);
                   } else {
                     no_deposit_amount = 0;
                   }
                   amount = parseFloat(amount) +  parseFloat(no_deposit_amount);
                   //Discount.
                   if(Booking.scheme_id != undefined && Booking.scheme_id !=0 && Booking.discount_type != undefined && Booking.discount != undefined)                       {
                     if(Booking.discount_type == 'percentage') {
                             discount = parseFloat(amount * (Booking.discount / 100));
                             amount = parseFloat(amount) - parseFloat(discount);
                      } else if(Booking.discount_type == 'amount') {
                             discount = parseFloat(Booking.discount);
                          if(remaining_discount != 0 && remaining_discount != 'empty') {
                             discount =  remaining_discount;
                          } else if(remaining_discount == 'empty') {
                              discount = 0;
                          }
                          if(discount < amount) {
                              amount = parseFloat(amount) - parseFloat(discount);
                              remaining_discount = 'empty';
                          } else if(discount > amount) {
                              remaining_discount = parseFloat(discount) - parseFloat(amount);
                              amount = 0;
                          }
                     }
                   } else {
                       discount = 0;
                   }
                   commission += parseFloat(amount * (Tax_id[0].amount / 100));
            }
          });
         }
         return parseFloat(commission).toFixed(2);
      }
      if(type == 'pro_rated_rent_internal') {
           var no_deposit_amount = 0;
           var total_premium = 0;
           
           var unit_type_id = index;
           var total_amount = $filter('bookingCalculation')(BookingItem, "totalAmount",Booking,'');
           var gross = $filter('bookingCalculation')(BookingItem, "gross",Booking,'');
           var total_premium = 0; 
           if(total_amount.length != undefined && total_amount.length > 0 && parseFloat(gross) > 0) {
              $.each(total_amount, function(key, data) {
                  if(unit_type_id == data.unit_type_id && data.first_month == '1') {
                    total_premium += parseFloat(data.pro_rated);
                  }
              });
           }
          return total_premium.toFixed(2);
      }
      if(type == 'gross') {
          
          var total_amount = $filter('bookingCalculation')(BookingItem, "totalAmount",Booking,'');
          var gross_amount = 0; 
          if(total_amount.length != undefined && total_amount.length > 0) {
          $.each(total_amount, function(key, data) {
             if(data.type == 'Pro_rated') {
                 gross_amount += parseFloat(data.actual_amount);
               } else {
                 gross_amount += parseFloat(data.unit_price);  
                }
           });
          }
          $.each(BookingItem, function(key, data) {
             if(data.unit_type_id == undefined && data.amount !== undefined) {
                   gross_amount += parseFloat(data.amount);
                  }
           });
        return gross_amount.toFixed(2);
      }
      if(type == 'premium') {
      var total_amount = $filter('bookingCalculation')(BookingItem, "totalAmount",Booking,'');
      var gross = $filter('bookingCalculation')(BookingItem, "gross",Booking,'');
      var total_premium = 0; 
      if(total_amount.length != undefined && total_amount.length > 0 && parseFloat(gross) > 0) {
          $.each(total_amount, function(key, data) {
              total_premium += parseFloat(data.premium);
          });
      }
      return total_premium.toFixed(2);
      }
      if(type == 'discount') {
          var discount = 0;
          var total_amount = $filter('bookingCalculation')(BookingItem, "totalAmount",Booking,'');
          var total_no_deposit = 0; 
          if(Booking.scheme_id != undefined && Booking.scheme_id !=0 && Booking.discount_type != undefined && Booking.discount != undefined) {
          if(Booking.discount_type == 'percentage') {
          if(total_amount.length != undefined && total_amount.length > 0) {
         $.each(total_amount, function(key, data) {
              discount += parseFloat(data.discount);
         });
         }
         } else if(Booking.discount_type == 'amount') {
            discount = parseFloat(Booking.discount);
         } 
         } 
         return discount.toFixed(2);        
      }
      if(type == 'no_deposit_fee') {
          var total_amount = $filter('bookingCalculation')(BookingItem, "totalAmount",Booking,'');
          var total_no_deposit = 0; 
          if(Booking.is_no_deposited != undefined && (Booking.is_no_deposited == 'Yes' || Booking.is_no_deposited == true)) {
          if(no_deposit_fee != 0 && no_deposit_type != '' && no_deposit_type == 'percentage') {
          if(total_amount.length != undefined && total_amount.length > 0) {
          $.each(total_amount, function(key, data) {
              total_no_deposit += parseFloat(data.no_deposit);
          });                   
          }
          } else if(no_deposit_type == 'amount') {
              total_no_deposit = parseFloat(no_deposit_fee);
          }
          }
          var np = parseFloat(total_no_deposit);
          if(Booking.billing_type =='annual' && no_deposit_type == 'amount') {
              np = parseFloat(total_no_deposit) * 12; 
          } else {
              np = parseFloat(total_no_deposit); 
          }
          return parseFloat(np).toFixed(2);
      } if(type == 'tax') {
          var tax = 0;
          var total_amount = $filter('bookingCalculation')(BookingItem, "totalAmount",Booking,'');
          var credit_dues = $filter('bookingCalculation')(BookingItem, "credit_due",Booking,'');
                 
          var gross_for_tax = 0; 
                
          if(total_amount.length != undefined && total_amount.length > 0 && (Booking.is_taxable == 'Yes' || Booking.is_taxable == true)) {
            $.each(total_amount, function(key, data) {
                if(data.type == 'Pro_rated') {
                   gross_for_tax = parseFloat(data.pro_rated) + parseFloat(data.no_deposit); 
                } else {
                   gross_for_tax = parseFloat(data.final_amount) + parseFloat(data.no_deposit); 
              }
                    
              if(gross_for_tax != undefined) {
                $.each(TaxArray,function(taxkey,taxdata) {
                  if(Tax_id == taxdata.tax_id) {
                     tax += (gross_for_tax *(taxdata.percentage))/100;
                  }     
                });
              } 
            });
            }
            $.each(BookingItem, function(key, data) {
                if(data.amount != undefined && data.unit_type_id == undefined && data.is_taxable == 'Yes' && (Booking.is_taxable == 'Yes' || Booking.is_taxable == true)) {
                  amount = parseFloat(data.amount);
                  $.each(TaxArray,function(taxkey,taxdata) {
                     if(Tax_id == taxdata.tax_id) {
                     tax += (amount *(taxdata.percentage))/100;
                     }
                 });
               }
             });
           return tax.toFixed(2);
      }
      if(type == 'gr_amount') {
          
            var final_amount = 0;
            var total_amount = $filter('bookingCalculation')(BookingItem, "totalAmount",Booking,'');
            var gross_amount = 0; 
            var previous_dues = 0; 
            if(total_amount.length != undefined && total_amount.length > 0) {
            $.each(total_amount, function(key, data) {
              if(data.type == 'Pro_rated') {
                 gross_amount += parseFloat(data.pro_rated);
              } else {
                 gross_amount += parseFloat(data.unit_price);  
              }
            });
            } 
            var premium = $filter('bookingCalculation')(BookingItem, "premium",Booking,'');  
            var no_deposit = $filter('bookingCalculation')(BookingItem, "no_deposit_fee",Booking,'');  
            var discount = $filter('bookingCalculation')(BookingItem, "discount",Booking,'');
            var credit_due = $filter('bookingCalculation')(BookingItem, "credit_due",Booking,'');
            var fn_amount = parseFloat(gross_amount) + parseFloat(premium);
            if(parseFloat(discount) > parseFloat(fn_amount) && (Booking.is_pro_rated == 'No' || Booking.is_pro_rated == false || Booking.is_pro_rated == undefined)) {
                final_amount = parseFloat(no_deposit);
            } else if(Booking.is_pro_rated == 'Yes' || Booking.is_pro_rated == true) {
                final_amount = (parseFloat(gross_amount) + parseFloat(no_deposit));   
            } else {
                final_amount = (parseFloat(gross_amount) + parseFloat(premium) + parseFloat(no_deposit) - parseFloat(discount));   
            }
            
            $.each(BookingItem, function(key, data) {
             if(data.unit_type_id == undefined && data.amount !== undefined) {
               final_amount += parseFloat(data.amount);
             }
           });
           return final_amount.toFixed(2);
        }
        if(type == 'get_used_credit') {
            var total_amount = $filter('bookingCalculation')(BookingItem, "totalAmount",Booking,'');
            var previous_dues = 0; 
            if(total_amount.length != undefined && total_amount.length > 0) {
            $.each(total_amount, function(key, data) {
              previous_dues += parseFloat(data.previous_due_amount);
            });
            }
            return parseFloat(previous_dues);
        }
        if(type == 'net_payable') {
            var final_amount = 0;
            var total_amount = $filter('bookingCalculation')(BookingItem, "totalAmount",Booking,'');
            var gross_amount = 0; 
            var previous_dues = 0; 
            if(total_amount.length != undefined && total_amount.length > 0) {
            $.each(total_amount, function(key, data) {
              if(data.type == 'Pro_rated') {
                 gross_amount += parseFloat(data.pro_rated);
              } else {
                 gross_amount += parseFloat(data.unit_price);  
              }
              previous_dues += parseFloat(data.previous_due_amount);
            });
            }
           
            var premium = $filter('bookingCalculation')(BookingItem, "premium",Booking,'');  
            var no_deposit = $filter('bookingCalculation')(BookingItem, "no_deposit_fee",Booking,'');  
            var discount = $filter('bookingCalculation')(BookingItem, "discount",Booking,'');
            var credit_due = $filter('bookingCalculation')(BookingItem, "credit_due",Booking,'');
            var fn_amount = parseFloat(gross_amount) + parseFloat(premium);
            if(parseFloat(discount) > parseFloat(fn_amount) && (Booking.is_pro_rated == 'No' || Booking.is_pro_rated == false || Booking.is_pro_rated == undefined)) {
                final_amount = parseFloat(no_deposit);
                
            } else if(Booking.is_pro_rated == 'Yes' || Booking.is_pro_rated == true) {
             var final_amounts = parseFloat(gross_amount);
             if(previous_dues != '' && previous_dues != 0) {
             if(parseFloat(gross_amount) >= parseFloat(previous_dues)) {
                 final_amounts = parseFloat(gross_amount) - parseFloat(previous_dues);
             } else if(parseFloat(gross_amount) < parseFloat(previous_dues)) {
                 final_amounts = 0;
             }
             }
             final_amount = (parseFloat(final_amounts) + parseFloat(no_deposit));   
            } else {
             var final_amounts = parseFloat(gross_amount);
             if(previous_dues != '' && previous_dues != 0) {
             if(parseFloat(gross_amount) >= parseFloat(previous_dues)) {
                 final_amounts = parseFloat(gross_amount) - parseFloat(previous_dues);
             } else if(parseFloat(gross_amount) < parseFloat(previous_dues)) {
                 final_amounts = 0;
             }
             }   
             final_amount = (parseFloat(final_amounts) + parseFloat(premium) + parseFloat(no_deposit) - parseFloat(discount));   
            }
            
            $.each(BookingItem, function(key, data) {
             if(data.unit_type_id == undefined && data.amount !== undefined) {
               final_amount += parseFloat(data.amount);
             }
            }); 
           
          var total_taxes = 0;
          $.each(TaxArray,function(taxkey,taxdata) {
              total_taxes +=  parseFloat($filter('bookingCalculation')(BookingItem, "tax",Booking,TaxArray,taxdata.tax_id)); 
          });
           
            final_amount =  parseFloat(final_amount) + parseFloat(total_taxes);

            return Math.round(final_amount).toFixed(2);
            }
            }    
            });
app.filter('tofix', function($http,$rootScope) {
    return function(items) {
      return items.toFixed(2);
      
  }
});
// This is to calculate live quotation amount.


app.filter('invoiceproducttotal', function($http,$rootScope) {
  return function(items,a,taxData,gData,is_taxable,taxDis) {
   
    if(Object.keys(items).length != 0){
      
      if($rootScope.userdata === undefined && $cookies.get('userdata') !== undefined)
      {
        $rootScope.userdata = JSON.parse($cookies.get('userdata'));
      }

      if(a=='gross'){
         
          var sum = 0;
          var totalproductprice=0;
          
          $.each(items, function(key, data) {	 
              
              if(data.quantity != undefined && data.amount != undefined){   
    	         totalproductprice += data.quantity * parseInt(data.amount); 
              }
              

          });
          sum = parseFloat(totalproductprice);
        return sum.toFixed(2);
      }
      if(a=='tax'){
        var tax=0;
        var productprice=0;
        var amount_discount = 0;
        var final_discount = 0;
        $.each(items, function(key, data) {
          if (data.quantity != undefined  && data.quantity != 0 && data.amount != undefined) {
            productprice += (parseFloat(data.quantity * data.amount));
          }
        });

        if (taxDis != undefined) {
          if (taxDis.dis_type == 'amount' && taxDis.discount != undefined) {
            amount_discount = parseFloat(taxDis.discount);
          } else if (taxDis.dis_type == 'percentage' && taxDis.discount != undefined) {
            var adis = (taxDis.discount) / 100;
            amount_discount = (adis * productprice);
          } else {
            amount_discount = 0;
          }
          final_discount = productprice - amount_discount;
        }else { final_discount = productprice; }
          

        if(final_discount<0){
            final_discount="";
          }

        if (is_taxable) {
          if(final_discount!=0 && final_discount>0){
              $.each(taxData, function(tkey, tdata) {
                 if (gData == tdata.tax_id) {
                  tax += (final_discount * (tdata.percentage)) / 100;
                }
              });
           }else if(final_discount ==0 && final_discount !="" && final_discount >0) {
              $.each(items, function(key, data) {
                $.each(taxData, function(tkey, tdata) {
                  if (tdata.percentage != undefined && (data.quantity != undefined)) {
                    if (gData == tdata.tax_id) {
                      if (data.quantity != undefined && data.amount != 0) {
                        tax += ((parseFloat(data.quantity) * parseFloat(data.amount)) * (tdata.percentage)) / 100;
                      }
                    }
                  }
                });
                
              
              });
          }
        }
        return tax.toFixed(2);
      }
      if(a=='netammount'){
        var discount = 0;
        var d = 0;
        var netammount = 0;
        var totalsum = 0;
        var totaltax = 0;
        
        $.each(items, function(key, data) { 
          if (data.quantity != undefined && data.amount != undefined && data.amount != 0) {
            totalsum += data.amount * data.quantity;
              } 
        });

        if (gData != undefined) {
          if (gData.dis_type == 'amount' && gData.discount != undefined) {
            discount = parseFloat(gData.discount);
          } else if (gData.dis_type == 'percentage' && gData.discount != undefined) {
            var dis = (gData.discount) / 100;

            discount = (dis * totalsum);
            } else {
            discount = 0;
            }
          d = totalsum - discount;
        }else {
          d=totalsum;
        }
        if(d<0){
          d="";
        }

        if (is_taxable) {
          if(d!=0 && d>0){
            
              $.each(taxData, function(tkey, tdata) { 
                  totaltax += (d * (tdata.percentage)) / 100;
              });
           }else if(d==0 && d!="" && d>0) {
              $.each(items, function(key, data) {
                $.each(taxData, function(tkey, tdata) {
                  if (tdata.percentage != undefined && (data.amount != undefined)) {
                      if (data.quantity != undefined && data.amount != 0) {
                        totaltax += ((parseFloat(data.amount) * parseFloat(data.quantity)) * (tdata.percentage)) / 100;
                    }   
                  } 
               });
              });
          }
        }
        if(d==""){
          d=0;
        }
        netammount = parseFloat(totaltax)+  parseFloat(d);
        if (netammount < 0) {
          netammount = 0;
        }
      return netammount.toFixed(2);

	  }
  }
	return 0;
  }
});


app.filter('toDate',function(){
   
    return function(stringDate) {

    };

});
app.filter('capitalize', function() {
    return function(input, all) {
      var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
      return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  });
app.service('privewQuote', function() {
    var quote = {};
   
    var addquote = function(newObj) {
        quote = newObj;
       
        
    }

    var getquote = function() {
        return quote;
    }
    return {
        addquote: addquote,
        getquote: getquote,
    };
});
