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
//var cookieFileName = fs.workingDirectory +'/cookies.txt';

//phantom.cookiesEnabled = true;
//console.log(cookies);
//phantom.cookies = JSON.parse(fs.read(cookieFileName));
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
var rem_count = casper.cli.get('rem_count');
if (!(username && password && rem_count)) {
    this.echo("Please provide --email , --password, --rem_count");
    casper.exit();
}

//First step is to open Amazon
casper.start().thenOpen("https://sellercentral.amazon.com/gp/homepage.html", function() {

    console.log("Amazon website opened");

});



//Now we have to populate username and password, and submit the form
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
    this.thenOpen("https://sellercentral.amazon.com/gp/ssof/reports/search.html#orderAscending=&recordType=REIMBURSEMENTS&noResultType=&merchantSku=&fnSku=&FnSkuXORMSku=&reimbursementId=&orderId=&genericOrderId=&asin=&shipmentId=&problemType=ALL_DEFECT_TYPES&hazmatStatus=&inventoryEventTransactionType=&inventoryAdjustmentReasonGroup", function() {

    });
});

casper.then(function() {
    this.evaluate(function() {
        $("#tab_download").click();
    });
     this.wait(2000, function () {
        this.capture('rembtab1.png');
    });
});

casper.then(function() {

    var rlink = this.evaluate(function() {
        var rpath = $('#downloadArchive').find('table.data-display').find('tr.list-row-even.downloadTableRow').eq(0).find('td.data-display-field').eq(3).find('a.buttonImage').attr("href");
        return rpath;
    });
    this.download(rlink, fs.workingDirectory + '/rembData_'+rem_count+'.txt');
});



casper.on("page.error", function(msg, trace) {
    this.echo("Error: " + msg);
});

casper.on("resource.error", function(msg, trace) {
    this.echo("Res.Error: " + msg);
});

casper.wait(20000); // wait for event

casper.run();
