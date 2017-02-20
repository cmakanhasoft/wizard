var fs = require('fs');
var x = require('casper').selectXPath;
var currentFile = require('system').args[3];

var currentFilePath = fs.absolute(currentFile).split('/');
if (currentFilePath.length > 1) {
    currentFilePath.pop();
    fs.changeWorkingDirectory(currentFilePath.join('/'));
}

var casper = require('casper').create({
    clientScripts:  [
        fs.workingDirectory +'/jquery.min.js',     // These two scripts will be injected in remote
        fs.workingDirectory +'/underscore.js'   // DOM on every request
    ],
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
console.log(username);
var password = casper.cli.get('password');
console.log(password);
var inventory_count=casper.cli.get('inventory_count');
var d = new Date();
var curr_date = d.getDate();
var curr_month = d.getMonth()+1;
var curr_year = d.getFullYear();
var prev_year = d.getFullYear()-1;
var startDate=curr_month+'/'+curr_date+'/'+curr_year;
console.log(startDate);
var endDate=curr_month+'/'+curr_date+'/'+prev_year;
console.log(endDate);

if(inventory_count==0){
     var path= "https://sellercentral.amazon.com/gp/ssof/reports/request-download.html/ref=ag_xx_cont_fbafulrpts?recordType=INVENTORY_ADJUSTMENT&eventDateTypeFilterOption=orderDate&eventDateOption=0&startDate="+startDate+"&endDate="+endDate+"";
}else {
     var path="https://sellercentral.amazon.com/gp/ssof/reports/request-download.html/ref=ag_xx_cont_fbafulrpts?recordType=INVENTORY_ADJUSTMENT&eventDateTypeFilterOption=orderDate&eventDateOption=3";
}
console.log(path);
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
        this.capture('afterlogin.png');
    })
});

casper.thenOpen(path, function() {
   
    this.wait(2000, function () {
        this.capture('tab.png');
    });
   
 });




casper.on("page.error", function(msg, trace) {
    this.echo("Error: " + msg);
});

casper.on("resource.error", function(msg, trace) {
    this.echo("Res.Error: " + msg);
});

casper.wait(20000); // wait for event

casper.run();
