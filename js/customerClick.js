var fs = require('fs');
var x = require('casper').selectXPath;
var currentFile = require('system').args[3];
// we need to change working directory
var currentFilePath = fs.absolute(currentFile).split('/');
if (currentFilePath.length > 1) {
    currentFilePath.pop();
    fs.changeWorkingDirectory(currentFilePath.join('/'));
}
//var cookieFileName = fs.workingDirectory +'/cookies.txt';

//phantom.cookiesEnabled = true;
//console.log(cookies);
//phantom.cookies = JSON.parse(fs.read(cookieFileName));
var casper = require('casper').create({
//    clientScripts:  [
//        fs.workingDirectory +'/jquery.min.js',     // These two scripts will be injected in remote
//        fs.workingDirectory +'/underscore.js'   // DOM on every request
//    ],
    pageSettings: {
        loadImages:  false,        // The WebPage instance used by Casper will
        loadPlugins: false ,        // use these settings
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
    },
    logLevel: "info",              // Only "info" level messages will be logged
    verbose: false                  // log messages will be printed out to the console
});

//Change setting of resolution
casper.options.viewportSize = {width: 1366, height: 768};

// removing default options passed by the Python executable
casper.cli.drop("cli");
casper.cli.drop("casper-path");
var username = casper.cli.get('email');

var password = casper.cli.get('password');

var customer_count=casper.cli.get('customer_count');
var rem_count=casper.cli.get('rem_count');
var inventory_count=casper.cli.get('inventory_count');
var payment_count=casper.cli.get('payment_count');
//var d = new Date();
//var curr_date = d.getDate()-2;
//var curr_month = d.getMonth()+1;
//var curr_year = d.getFullYear();
//var prev_year = d.getFullYear()-1;
//var startDate=curr_month+'/'+curr_date+'/'+curr_year;
//var endDate=curr_month+'/'+curr_date+'/'+prev_year;

var d18=new Date();
var c18date=d18.getDate();
var c18month=(new Date(d18.setMonth(d18.getMonth() - 18, d18.getDate()))).getMonth()+1;
var c18year=d18.getFullYear();
var startDate18=c18month+'/'+c18date+'/'+c18year;


var d = new Date();
var cdate=d.getDate();
var cmonth=d.getMonth()+1;
var cyear=d.getFullYear()-1;

var startDate=cmonth+'/'+cdate+'/'+cyear;
console.log("start date:"+startDate);
//ft.setFullYear(ft.getFullYear() );
//ft.setMonth(ft.getMonth() -18);
// var fdate = ft.toISOString().split('T')[0]; 
// var fdateArr = fdate.split("-");
//var startDate = fdateArr[1] + "/" + fdateArr[2] + "/" + fdateArr[0];
 
 
 var tt = new Date();
 var tdate =tt.getDate()-2; 
 var tmonth = tt.getMonth()+1;
 var tyear = tt.getFullYear();
var endDate = tmonth + "/" + tdate + "/" + tyear;
console.log("end date:"+endDate);

 
 /// before 3 days reocord
 var ft7 = new Date();
var fdate7 =ft7.getDate()-4; 
var fmonth7= ft7.getMonth()+1;
var fyear7= ft7.getFullYear();
var startDate7 = fmonth7+ "/" + fdate7 + "/" + fyear7;
 console.log("startDate7:"+startDate7);
 
var pstartDate='';
var pendDate=''; 
if(payment_count==0){
    var pstartDate=startDate;
    var pendDate=endDate;
}else {
    var pstartDate=startDate7;
    var pendDate=endDate;
}


if(customer_count==0){
     var cpath= "https://sellercentral.amazon.com/gp/ssof/reports/request-download.html/ref=ag_xx_cont_fbafulrpts?recordType=CUSTOMER_RETURNS&eventDateTypeFilterOption=orderDate&eventDateOption=0&startDate="+startDate+"&endDate="+endDate+"";
}else {
     //var cpath="https://sellercentral.amazon.com/gp/ssof/reports/request-download.html/ref=ag_xx_cont_fbafulrpts?recordType=CUSTOMER_RETURNS&eventDateTypeFilterOption=orderDate&eventDateOption=7";
     var cpath= "https://sellercentral.amazon.com/gp/ssof/reports/request-download.html/ref=ag_xx_cont_fbafulrpts?recordType=CUSTOMER_RETURNS&eventDateTypeFilterOption=orderDate&eventDateOption=0&startDate="+startDate7+"&endDate="+endDate+"";
}

if(rem_count==0){
     var rpath= "https://sellercentral.amazon.com/gp/ssof/reports/request-download.html/ref=ag_xx_cont_fbafulrpts?recordType=REIMBURSEMENTS&eventDateTypeFilterOption=orderDate&eventDateOption=0&startDate="+startDate+"&endDate="+endDate+"";
}else {
    // var rpath="https://sellercentral.amazon.com/gp/ssof/reports/request-download.html/ref=ag_xx_cont_fbafulrpts?recordType=REIMBURSEMENTS&eventDateTypeFilterOption=orderDate&eventDateOption=7";
     var rpath= "https://sellercentral.amazon.com/gp/ssof/reports/request-download.html/ref=ag_xx_cont_fbafulrpts?recordType=REIMBURSEMENTS&eventDateTypeFilterOption=orderDate&eventDateOption=0&startDate="+startDate7+"&endDate="+endDate+"";
}

if(inventory_count==0){
     var ipath= "https://sellercentral.amazon.com/gp/ssof/reports/request-download.html/ref=ag_xx_cont_fbafulrpts?recordType=INVENTORY_ADJUSTMENT&eventDateTypeFilterOption=orderDate&eventDateOption=0&startDate="+startDate18+"&endDate="+endDate+"";
}else {
  //   var ipath="https://sellercentral.amazon.com/gp/ssof/reports/request-download.html/ref=ag_xx_cont_fbafulrpts?recordType=INVENTORY_ADJUSTMENT&eventDateTypeFilterOption=orderDate&eventDateOption=7";
   var ipath= "https://sellercentral.amazon.com/gp/ssof/reports/request-download.html/ref=ag_xx_cont_fbafulrpts?recordType=INVENTORY_ADJUSTMENT&eventDateTypeFilterOption=orderDate&eventDateOption=0&startDate="+startDate7+"&endDate="+endDate+"";
}

if (!(username && password)) {
    this.echo("Please provide --email , --password");
    casper.exit();
}

//First step is to open Amazon
casper.start().thenOpen("https://sellercentral.amazon.com/gp/homepage.html", function() {
    
    console.log("Amazon website opened");
      
});
 

 
//Now we have to populate username and password, and submit the form
casper.then(function(){
    console.log("Login using username and password");
    if(this.exists("form[name=signIn]")){
    this.evaluate(function(username,password){
        document.getElementById("ap_email").value=username;
        document.getElementById("ap_password").value=password;
        document.getElementById("signInSubmit").click();
    },username,password);
   }else {
        this.echo('Amazon login page not open');
        casper.exit();
   }
});
 

casper.then(function(){
    if(this.exists("div#message_error")){
       this.echo('Username and password invalid');
       casper.exit();
    }else {
        this.echo('Login successfully');
    }
    this.wait(2000, function () {
        this.capture('home1.png');
    })
});

casper.thenOpen(cpath, function() {
  this.wait(2000, function () {
        this.capture('home2.png');
    })
 });
 
 casper.thenOpen(rpath, function() {
  this.wait(2000, function () {
        this.capture('home3.png');
    })
  });

casper.thenOpen(ipath, function() {
  this.wait(2000, function () {
        this.capture('home4.png');
    })
 });

casper.then(function(){
this.thenOpen("https://sellercentral.amazon.com/payments/reports/custom/request?tbla_daterangereportstable=sort:%7B%22sortOrder%22%3A%22DESCENDING%22%7D;search:undefined;pagination:1;", function() {
  
   
 });
});

casper.then(function(){
      this.mouse.click("#drrGenerateReportButton");
});
casper.then(function(){
    console.log("Login using username and password");
     casper.wait(2000, function() {
            this.evaluate(function(pstartDate,pendDate){
                document.querySelector('#drrReportRangeTypeRadioCustom').setAttribute('checked', true);
                $("#drrFromDate").val(pstartDate);
                $("#drrToDate").val(pendDate);
            },pstartDate,pendDate);
       });
       this.echo("evemuter stat" +pstartDate)
       this.echo("evemuter end" +pendDate)
       this.wait(2000, function () {
          this.capture('popover.png');
      }) 
});
casper.then(function(){
     this.mouse.click("#drrGenerateReportsGenerateButton-announce");
     this.wait(2000, function () {
          this.capture('popover1.png');
      })
});



casper.on("page.error", function(msg, trace) {
    this.echo("Error: " + msg);
});

casper.on("resource.error", function(msg, trace) {
    this.echo("Res.Error: " + msg);
});

casper.wait(20000); // wait for event

casper.run();