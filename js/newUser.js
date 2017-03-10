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
        loadImages: true, // The WebPage instance used by Casper will
        loadPlugins: false, // use these settings
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
    },
    logLevel: "info", // Only "info" level messages will be logged
    verbose: false                  // log messages will be printed out to the console
});

//Change setting of resolution
casper.options.viewportSize = {width: 1366, height: 768};

// removing default options passed by the Python executable
casper.cli.drop("cli");
casper.cli.drop("casper-path");
var username = casper.cli.get('email');
var password = casper.cli.get('password');

if (!(username && password )) {
    this.echo("Please provide --email , --password");
    casper.exit();
}
casper.start().thenOpen("https://sellercentral.amazon.com/gp/homepage.html", function() {

    console.log("Amazon website opened");

});
casper.then(function() {
    console.log("Login using username and password");
    if (this.exists("form[name=signIn]")) {
        this.evaluate(function(username, password) {
            document.getElementById("ap_email").value = username;
            document.getElementById("ap_password").value = password;
            document.getElementById("signInSubmit").click();
        }, username, password);
    } else {
        this.echo('Amazon login page not open');
        casper.exit();
    }
});
casper.then(function() {
    if (this.exists("div#message_error")) {
        this.echo('Username and password invalid');
        casper.exit();
    } else {
        this.echo('Login successfully');
    }
});
casper.then(function() {
     if(this.exists("#merchant-picker-btn-logout-announce")) {
          fs.write('notlogin.txt','123', 644);
          casper.exit();
     }
});
casper.then(function() {
    this.wait(2000, function() {
          this.capture('1.png');
     });
});
casper.then(function() {
    this.mouse.click('#merchant-picker-btn-choose-another-announce');
});
casper.then(function() {
    this.wait(2000, function() {
          this.capture('2.png');
     });
});
casper.then(function() {
     this.evaluate(function() {
            document.getElementById("selection-btn-A3Q220XNDNGZN4-ATVPDKIKX0DER").click();
        });
    //this.mouse.click('#selection-btn-A3Q220XNDNGZN4-ATVPDKIKX0DER');
});
casper.then(function() {
    this.wait(2000, function() {
          this.capture('3.png');
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
