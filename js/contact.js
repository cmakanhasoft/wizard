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
//     clientScripts: [
//          fs.workingDirectory + '/jquery-1.12.4.min.js' // These two scripts will be injected in remote
                  //fs.workingDirectory + '/underscore.js'   // DOM on every request
//     ],
     pageSettings: {
          loadImages: false, // The WebPage instance used by Casper will
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
var issueId = casper.cli.get('issueId');
//var resultFilename=casper.cli.get('resultFilename');


if (!(username && password)) {
     this.echo("Please provide --email , --password");
     casper.exit();
}


casper.start().thenOpen("http://wizardofamz.com/#/caseView/" + issueId, function() {
     console.log("website opened");
     this.wait(2000, function() {
          this.capture('home.png');
     })
});
var reason = '';
var issues = '';
var order_id = '';
casper.then(function() {
     var d = this.evaluate(function() {
          var feedbackMessages = []
          var rowData = {};
          rowData['reason'] = $("#contactReason").val()
          rowData['issues'] = $('#des').html();
          rowData['order_id'] = $('#order_id').val();
          feedbackMessages.push(rowData)
          return feedbackMessages;
     });
     reason = JSON.stringify(d[0].reason)
     issues = JSON.stringify(d[0].issues)
     order_id = JSON.stringify(d[0].order_id)
})

casper.then(function() {
     this.thenOpen("https://sellercentral.amazon.com/gp/homepage.html", function() {
     });
     console.log("Amazon website opened");

});

casper.then(function() {
     console.log("Login using username and password");
     if (this.exists("form[name=signIn]")) {
          this.evaluate(function(username, password) {
               $("#ap_email").val(username);
               $("#ap_password").val(password);
               $("#signInSubmit").click();

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
     this.thenOpen("https://sellercentral.amazon.com/cu/contact-us?_encoding=UTF8&ref_=ag_contactus_shel_xx", function() {
     });
     this.wait(2000, function() {
          this.capture('form.png');
     });
});

casper.then(function() {
     this.mouse.click("div.a-box.cursorHand.a-declarative");
});

casper.then(function() {
     this.mouse.click("div#ctiWidget_SOA >div:nth-child(2)");
     this.wait(2000, function() {
          this.capture('form1.png');
     });
});
casper.then(function() {
     this.evaluate(function(order_id) {
          var a=order_id.replace(/"/g,"");
          var searchorderid=a.split("|");
          var finalsearchorderId=searchorderid[0].trim();
          $("#order_id").val(finalsearchorderId);
     }, order_id);
     this.wait(2000, function() {
          this.capture('form2.png');
     });
});

casper.then(function() {
     this.mouse.click("#getOrderDetailsButton-announce");
     this.wait(2000, function() {
          this.capture('form3.png');
     });
});
casper.then(function() {
     this.mouse.click("#question_30004_radio_button_id");
     this.wait(2000, function() {
          this.capture('form4.png');
     });
});
casper.then(function() {
     this.mouse.click("#get_question_action_button-announce");
     this.wait(2000, function() {
          this.capture('form5.png');
     });
});

casper.then(function() {
     this.evaluate(function(reason, issues, order_id) {
          var finalissues = issues.replace(/\\n/g, "");
          var finalreason = reason.slice(1, -1);
          var lastissue = finalissues.slice(1, -1);
          var finalorder_id = order_id.slice(1, -1);
          $('#subject_customer_orders').val(finalreason);
          $('#customer_orders_info').html(lastissue);
          $('#customer_orders_order_id').val(finalorder_id);
          $('#customer_orders_submit-announce').click();
     }, reason, issues, order_id);

});
casper.then(function() {

     this.wait(2000, function() {
          this.capture('form6.png');
     });
});

casper.then(function() {
     var message = this.evaluate(function() {
          var message = $('#caseIDText').html();
          return message;
     });
     fs.write('message_' + issueId + '.txt', message, 644);

});


casper.on("page.error", function(msg, trace) {
     this.echo("Error: " + msg);
});

casper.on("resource.error", function(msg, trace) {
     this.echo("Res.Error: " + msg);
});

casper.wait(20000); // wait for event

casper.run();
