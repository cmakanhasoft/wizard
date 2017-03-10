var fs = require('fs');

var currentFile = require('system').args[3];
// we need to change working directory
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
var username = "manoj.skpatel2010@gmail.com";
var password = "admin@123";
var resultFilename=casper.cli.get('resultFilename');
if (!(username && password)) {
    this.echo("Please provide --email , --password");
    casper.exit();
}


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
    this.evaluate(function(){
        document.getElementById("ap_email").value="manoj.skpatel2010@gmail.com";
        document.getElementById("ap_password").value="admin@123";
        document.getElementById("signInSubmit").click();
    });
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
casper.then(function(){
this.thenOpen("https://sellercentral.amazon.com/gp/payments-account/date-range-reports.html", function() {
 });
});

casper.then(function(){
    console.log("Login using username and password");
        this.evaluate(function(){
            $( "div#drrReportRangePopover" ).parent('div').css( "display", "block" );
            document.querySelector('#drrReportTypeRadioTransaction').setAttribute('checked', true);
            $('#GenerateID').click();
            $('p[align=center] button.ap_custom_close').click();
        });
       this.wait(2000, function () {
       this.capture('popover.png');
   })
   
});

casper.then(function () {
    this.wait(2000, function () {
        this.capture('aa.png');
    })
});
// casper.then(function () {
//     this.evaluate(function () {
//         $('div#drrReportRangePopover').style('display','block');
//     });
//     this.wait(2000, function () {
//         this.capture('aaasas.png');
//     })
// });



casper.on("page.error", function(msg, trace) {
    this.echo("Error: " + msg);
});

casper.on("resource.error", function(msg, trace) {
    this.echo("Res.Error: " + msg);
});

casper.wait(20000); // wait for event

casper.run();