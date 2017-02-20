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
var username = "52453fd72defaecda6970f71bc36b3c6@inbound.wizardofamz.com";
var password = "52453fd72defaecda6970f71bc36b3c6";
//var resultFilename=casper.cli.get('resultFilename');


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
casper.then(function(){
this.thenOpen("https://sellercentral.amazon.com/gp/case-dashboard/lobby.html?ref_=ag_caselog_shel_home", function() {
 });
 this.wait(2000, function () {
        this.capture('contact.png');
    })
});

casper.then(function() {
    var listItems = this.evaluate(function() {
        var feedbackMessages = [];
        var a=$('table[width="95%"]').eq(5).find('tr');
        $(a).each(function(index) {
               if(index>2){
                 var rowData = {};
                rowData ['caseCreation'] = $(this).find('td.tiny').eq(0).text();
                rowData ['caseId'] = $(this).find('td.tiny').eq(1).text().trim();
                rowData ['caseStatus'] = $(this).find('td.tiny').eq(2).text().trim();
                rowData ['primaryEmail'] = $(this).find('td.tiny').eq(3).text().trim();
                rowData ['des'] = $(this).find('td.tiny').eq(4).text().trim();
                rowData ['link'] = $(this).find('td').eq(5).find('span').find('a').attr('href');
                feedbackMessages.push(rowData)
                }
        });
        return feedbackMessages;
    });
    var Emaildata = [];
     for (var i = 0; i < listItems.length; i++) {
        this.thenOpen(listItems[i].link, function() {
             casper.wait(20000, function() {
                  var a=this.getCurrentUrl();
                  var arr = a.split('&caseID=');
                  var case_id=arr[1];
                  var data = this.evaluate(function(case_id) {
                  var message = []
                        $('div.a-box').each(function(index) {
                            var row={};   
                            row['date']=$(this).find('span.a-color-secondary').text().trim();
                            row['des']=$(this).find('div.a-expander-extend-container').html();
                            row['caseID']=case_id;
                            message.push(row);
                        });
                        return message;
                    i++;   
                   },case_id);
                   Emaildata.push(data);
                   fs.write('messagedata.txt', JSON.stringify(Emaildata), 644);
              });
      });
 }
       fs.write('caselog.txt', JSON.stringify(listItems), 644);
});



casper.on("page.error", function(msg, trace) {
    this.echo("Error: " + msg);
});

casper.on("resource.error", function(msg, trace) {
    this.echo("Res.Error: " + msg);
});

casper.wait(20000); // wait for event

casper.run();
