var fs = require('fs');

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

//casper.start().thenOpen("https://httpbin.org/ip", function () {
//    console.log(this.getPageContent())
//    casper.exit()
//});




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
this.thenOpen("https://sellercentral.amazon.com/gp/ssof/reports/search.html#orderAscending=1&recordType=CUSTOMER_RETURNS&noResultType=&merchantSku=&fnSku=&FnSkuXORMSku=&reimbursementId=&orderId=&genericOrderId=&asin=&shipmentId=&problemType=ALL_DEFECT_TYPES&hazmatStatus=&inventoryEventTransactionType=&inventoryAdjustmentReasonGroup=&eventDateOption=7&fromDate=mm%2Fdd%2Fyyyy&toDate=mm%2Fdd%2Fyyyy&startDate=&endDate=&fromMonth=1&fromYear=2016&toMonth=1&toYear=2016&startMonth=&startYear=&endMonth=&endYear=", function() {
    this.wait(2000, function () {
        this.capture('cpayment.png');
    });
 });
});
casper.on('remote.callback', function (data) {
    if (data) {
        this.echo('mesagges received.');
        var result = data.msgs
        var resultJson = JSON.stringify(result)
        
        fs.write('customerReport.txt', resultJson, 644);
        this.echo('result saved')
        this.exit();
    }
});


casper.then(function () {
    this.evaluate(function () {
        var feedbackMessages = []
        $('tr[align=left]').each(function (index) {
            var rowData = {};
            rowData['asin'] = $(this).find('td.left.nowrap').eq(2).text().trim();
            rowData['date'] = $(this).find('td.left').eq(0).text().trim();
            rowData['disposition'] = $(this).find('td.left').eq(7).text().trim();
            rowData['fc'] = $(this).find('td.left').eq(6).text().trim();
            rowData['fnsku'] = $(this).find('td.left.nowrap').eq(3).text().trim();
            rowData['orderId'] = $(this).find('td.left.nowrap a').eq(0).text().trim();
            rowData['quantity'] = $(this).find('td.right').eq(0).text().trim();
            rowData['reason'] = $(this).find('td.left').eq(8).text().trim();
            rowData['sku'] = $(this).find('td.left.nowrap').eq(1).text().trim();
            rowData['status'] = $(this).find('td.left').eq(9).text().trim(); 
            rowData['title'] = $(this).find('td.left').eq(5).text().trim();
            feedbackMessages.push(rowData)
        })
       window.callPhantom({finished: true, msgs: feedbackMessages});
       return true;
    });

})

casper.on("page.error", function(msg, trace) {
    this.echo("Error: " + msg);
});

casper.on("resource.error", function(msg, trace) {
    this.echo("Res.Error: " + msg);
});

casper.wait(20000); // wait for event

casper.run();