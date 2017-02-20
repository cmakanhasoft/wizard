function getParameterByName(name, url) {
     debugger;
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function CheckUserNoOfCompanys(company_id,facility_id) {
    var no_of_companys = 0;
    var no_of_facilitys  = 0;
    
     if(company_id != '' && company_id != undefined) {
     var result_company = [];
     var company_ids = company_id.split(",");
     $.each(company_ids, function(i, e) {
        if($.inArray(e, result_company) == -1)
            result_company.push(e);
     });
     no_of_companys = result_company.length;
     }
     if(facility_id != '' && facility_id != undefined) {
     var result_facility = [];
     var facility_id = facility_id.split(",");
     $.each(facility_id, function(i, e) {
        if($.inArray(e, result_facility) == -1)
            result_facility.push(e);
     });
     no_of_facilitys = result_facility.length;    
     }
     return {"no_of_company": no_of_companys, "no_of_facilitys":no_of_facilitys}
}
var getDaysInMonth = function(date) {
    var d = new Date(date);
    var date = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    // Here January is 1 based
    //Day 0 is the last day in the previous month
    return new Date(year, month, 0).getDate();
}

var getMonthDays = function(date) {
    var d = new Date(date);
    var date_no = d.getDate();
    var months = d.getMonth() + 1;
    var years = d.getFullYear();
    
    var no_of_days = new Date(years, months, 0).getDate();
    var remaining_days = (no_of_days + 1 ) - date_no;
    var array =  new Array();
    array['no_of_days'] = no_of_days;
    array['remaining_days'] = remaining_days;
    return array;
}
function validateUrl(element_value,element_id) {
            if(element_value != '') {
                    var urlregex = new RegExp("^(http:\/\/|https:\/\/|ftp:\/\/www.|www.){1}([0-9A-Za-z]+\.)");
                    if (!urlregex.test(element_value)) {
                    $("#errMessage").remove();
                    $("#" + element_id).parent().after("<div id='errMessage' style='color:red;margin-bottom: 20px;float:left;font-size:12px;'>Please enter valid url i.e http://www.example.com</div>");
                    return false;
                    } else {
                      $("#errMessage").remove();
                    }
                }    
}

function show_notification(popup_type, message,redirection,is_reload) {
        if(popup_type=='Success') {
            var c=BootstrapDialog.TYPE_SUCCESS; 
        } else if(popup_type=='Error'){ 
            var c =BootstrapDialog.TYPE_DANGER;
        } else {
            var c =BootstrapDialog.TYPE_WARNING;
        }
        
        BootstrapDialog.show({
                 type:c,
                 title: popup_type,
                 message: '<div class="msg_icon"></div><div class="msg_desc"><h4>'+message+'</h4></div>',
                 closable: false,
                 buttons: [{
                 label: 'OK',
                 action: function(dialogItself) {
                    dialogItself.close();
                    if(redirection != '')
                        window.location.href= redirection;
                         setTimeout(function(){body_sizer();},200);
                    if(is_reload == 'yes')
                        window.location.reload();
                         setTimeout(function(){body_sizer();},200);
                    }
               }]
         });   
         
}

function Noofdays(first_date,second_date) {
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(first_date);
    var secondDate = new Date(second_date);
    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    return diffDays;
}
function Noofmonths(first_date, second_date) {
    var Nomonths;
    var date1 = new Date(first_date);
    var date2 = new Date(second_date);
    Nomonths= (date2.getFullYear() - date1.getFullYear()) * 12;
    Nomonths-= date1.getMonth() + 1;
    Nomonths+= date2.getMonth();
    return Nomonths <= 0 ? 0 : Nomonths;
}

function deleteRow(url,data_object,oTable) {
    debugger; 
    
     var udata = sessionStorage.getItem("userdata");
     
     console.log(sessionStorage);
     var userdata = JSON.parse(udata);
     console.log(userdata);
     BootstrapDialog.show({
            title: 'Question',
            message: '<div class="msg_icon"><i class="sprite pop_question"></i></div><div class="msg_desc"><h4>Are you sure want to delete this row?</h4></div>',
            closable: false,
            buttons: [{                
                label: 'OK',
                action:function(dialog){
                    $('.modal').modal('toggle');
                        $.ajax({
                            method: 'post',
                            url: path + url,
                            data: data_object,
                            dataType: 'json',
                           // headers: {requestfrom: userdata.request_from, token: userdata.token,userid: userdata.user_id},
                            success: function(response) {
                            if (response.error == false) {
                                oTable.fnDraw(); 
                            } else {
                                show_notification('Error' , response.message,'','no');
                            }}
                            });
                },
                cssClass: 'btn_blue active'
            },{                
                label: 'Cancel',
                cssClass: 'btn_blue',
                action: function(dialogItself){
                dialogItself.close();
                }
            }
        ]
	});
}



