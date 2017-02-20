var fs = require('fs');
var casper = require("casper").create();
casper.options.waitTimeout = 1000;
var mouse = require("mouse").create(casper);
var currentFile = require('system').args[3];
// we need to change working directory
var currentFilePath = fs.absolute(currentFile).split('/');
if (currentFilePath.length > 1) {
    currentFilePath.pop();
    fs.changeWorkingDirectory(currentFilePath.join('/'));
}
var casper = require('casper').create({
  
    pageSettings: {
        loadImages:  true,        // The WebPage instance used by Casper will
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

if (!(username && password)) {
    this.echo("Please provide --email , --password");
    casper.exit();
}

var rem_count=casper.cli.get('payment_count');
var d = new Date();
var curr_date = d.getDate();
var curr_month = d.getMonth()+1;
var curr_year = d.getFullYear();
var prev_year = d.getFullYear()-1;
var startDate=curr_month+'/'+curr_date+'/'+curr_year;
console.log(startDate);
var endDate=curr_month+'/'+curr_date+'/'+prev_year;
console.log(endDate);

//First step is to open Amazon
casper.start().thenOpen("https://sellercentral.amazon.com/gp/homepage.html", function() {
    
    console.log("Amazon website opened");
     this.wait(2000, function () {
        this.capture('home.png');
    })
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
        this.capture('afterlogin.png');
    })
});


// payment
casper.then(function(){
this.thenOpen("https://sellercentral.amazon.com/payments/reports/custom/request?tbla_daterangereportstable=sort:%7B%22sortOrder%22%3A%22DESCENDING%22%7D;search:undefined;pagination:1;", function() {
     this.wait(2000, function () {
        this.capture('payment.png');
    });
 });
});


casper.then(function(){
      this.mouse.click("#drrGenerateReportButton");
});
casper.then(function(){
    console.log("Login using username and password");

        this.evaluate(function(startDate,endDate){
             document.querySelector('#drrReportRangeTypeRadioCustom').setAttribute('checked', true);
            
            $("#drrFromDate").val("01/25/2017");
            $("#drrToDate").val("02/08/2017");
        },startDate,endDate);
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
