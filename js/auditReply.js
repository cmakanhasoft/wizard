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
    clientScripts:  [
        fs.workingDirectory +'/jquery.min.js',     // These two scripts will be injected in remote
       // fs.workingDirectory +'/underscore.js'   // DOM on every request
    ],
    pageSettings: {
        loadImages:  false,        // The WebPage instance used by Casper will
        loadPlugins: false ,        // use these settings
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
    },
    logLevel: "debug",              // Only "info" level messages will be logged
    verbose: false                  // log messages will be printed out to the console
});

var webPage = require('webpage');
var page = webPage.create();

//Change setting of resolution
casper.options.viewportSize = {width: 1366, height: 768};

// removing default options passed by the Python executable
casper.cli.drop("cli");
casper.cli.drop("casper-path");
var username =casper.cli.get('email');
var password = casper.cli.get('password');
var reply_id=casper.cli.get('reply_id');
var caseId=casper.cli.get('caseId');
if (!(username && password)) {
    this.echo("Please provide --email , --password");
    casper.exit();
}

casper.start().thenOpen("http://wizardofamz.com/#/auditreplyView/" + reply_id, function() {
     console.log("website opened");
     this.wait(2000, function() {
          this.capture('home.png');
     })
});

var issues = '';

casper.then(function() {
     var d = this.evaluate(function() {
         // var feedbackMessages = []
          //var rowData = {};
           var testissue = $('#des').html();
          //feedbackMessages.push(rowData)
             return testissue;
     });
          issues=d;
   })

casper.then(function() {
     this.thenOpen("https://sellercentral.amazon.com/gp/homepage.html", function() {
     });
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

casper.thenOpen("https://sellercentral.amazon.com/gp/case-dashboard/view-case.html/ref=sc_cd_lobby_vc?ie=UTF8&caseID="+caseId, function() {
   
    this.wait(2000, function () {
        this.capture('replytab.png');
    });
   
 });


casper.then(function () {
          if(this.exists("#replyCase")){
               this.mouse.click("#replyCase");
          }else {
              this.mouse.click("#a-autoid-1-announce");
          }
          this.wait(2000, function () {
             this.capture('clcik.png');
         });
});
casper.then(function() {
     this.mouse.click("div.a-tab-container >ul > li:nth-child(1)");
     this.wait(2000, function() {
          this.capture('click1.png');
     });
});

casper.then(function () {
    this.evaluate(function (issues) {
          $("#emailMessage").html(issues);
    },issues);
});

casper.then(function(){
     this.wait(2000, function () {
     this.capture('clcik2.png');
    });
});
casper.then(function() {
     this.mouse.click("#reply_case_submit-announce");
     this.wait(2000, function() {
          this.capture('click3.png');
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
