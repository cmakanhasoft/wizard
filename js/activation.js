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
var username = casper.cli.get('email')
var password = casper.cli.get('password')
var cookieFilename = casper.cli.get('cookieFilename')
var resultFilename = 'activationCode.txt';
var activationLink = casper.cli.get('activationLink')



if (!(username && password && activationLink)) {
    casper.echo("Please provide --email , --password, --cookieFilename , --activationLink");
    casper.exit()
}
if (fs.exists(cookieFilename)) {
    var data = fs.read(cookieFilename);
    phantom.cookies = JSON.parse(data);
}
console.log(activationLink);
//First step is to open Amazon
casper.start().thenOpen(activationLink, function () {
    console.log("Activation link opened");
});


//Now we have to populate username and password,
casper.then(function () {
    console.log("set email and password");
    this.evaluate(function (username) {
        $("#ap_email").val(username);
        $('#ap_signin_create_radio').click()
    }, username);
});
//And submit the form
casper.then(function () {
    console.log("Submit login form");
    this.evaluate(function () {
        $("#signInSubmit").click();
    });

});

//Wait to be redirected to the Home page, and then make a screenshot
casper.then(function () {

    console.log("Make a screenshot and save it as AfterSubmit.png");
    this.wait(2000, function () {
        this.capture('AfterSubmit.png');
    })
});
casper.then(function () {
    console.log("set username, email and password");
    this.evaluate(function (username,password) {
        $("#ap_customer_name").val(username)
        $("#ap_email").val(username)
        $("#ap_email_check").val(username)
        $("#ap_password").val(password)
        $("#ap_password_check").val(password)
        $('#continue').click()
    }, username,password);
    this.wait(2000, function () {
        this.capture('AfterSet.png');
    })
});
casper.then(function () {
    console.log("get code");
    this.capture('codePage.png');
    var code = this.evaluate(function () {
     return $('center:first').text().trim()
    });
    console.log('Verification code is:')
    console.log(code)
    
    fs.write(resultFilename, code, 644);
    casper.exit()
});

casper.on("page.error", function (msg, trace) {
    this.echo("Error: " + msg);
});

casper.on("resource.error", function (msg, trace) {
    this.echo("Res.Error: " + msg);
});
casper.wait(6000) // wait for event

casper.run();