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
var orderId='105-6052012-1009808';

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
this.thenOpen("https://sellercentral.amazon.com/cu/contact-us?_encoding=UTF8&ref_=ag_contactus_shel_home", function() {
 });
 this.wait(2000, function () {
        this.capture('contact.png');
    })
});
casper.then(function(){
    this.evaluate(function () {
        $('div.a-box.cursorHand.a-declarative').eq(0).find('i.a-icon.a-icon-arrow.scu-arrow.transparentClass').eq(0).click();
    });

    this.wait(2000, function () {
        this.capture('form.png');
    });
});

casper.then(function(){
    this.evaluate(function () {
    $('div.a-row.a-expander-container.scu-section-expander-container').eq(0).find('a.normal.a-declarative.scu-link-section-expander .a-size-medium').eq(0).click();
    });

    this.wait(2000, function () {
        this.capture('form1.png');
    });
});
casper.then(function(){
    this.evaluate(function () {
     $('#order_id').val(orderId);
     $('button#getOrderDetailsButton-announce').click();

    });
    this.wait(2000, function () {
        this.capture('form2.png');
    });
});    
casper.then(function(){
    this.evaluate(function () {
    document.querySelector('#question_30004_radio_button_id').setAttribute('checked', true);
    $('button#get_question_action_button-announce').click();

    });
    this.wait(2000, function () {
        this.capture('form3.png');
    });
});

casper.then(function(){
    this.evaluate(function () {
        $('#subject_customer_orders').val('Customers and orders | Other customer and order issues | Order ID: 105-6052012-1009808');
        $('#customer_orders_info').val('ads');
        $('#customer_orders_order_id').val('105-6052012-1009808');
        $('#replyTo').val('manoj.skpatel2010@gmail.com');
    });
    this.wait(2000, function () {
        this.capture('form4.png');
    });
});
    

/*casper.then(function(){
    this.evaluate(function () {
    $('div.a-row.a-expander-container.scu-section-expander-container.scu-active-row').eq(0).find('div.scu-section-expander-inner').eq(0).find('a.a-size-base.a-link-normal.scu-type-display.a-declarative').eq(0).click();
    });

    this.wait(2000, function () {
        this.capture('form2.png');
    });
});*/

/*casper.then(function(){
    this.evaluate(function () {
    $('div#something_else_fba_box_inner').find('span.a-declarative').eq(0).find('a.a-link-normal.a-declarative').eq(0).click();
    });

    this.wait(2000, function () {
        this.capture('form3.png');
    });
});
casper.then(function(){
    this.evaluate(function () {
    $('div#missing_inventory_other_issue').find('div.a-tab-container').eq(0).find('ul.scu-tabs.a-declarative').eq(0).find('li.a-tab-heading').eq(0).find('a').click();
    });

    this.wait(2000, function () {
        this.capture('form4.png');
    });
});
casper.then(function(){
    this.evaluate(function () {
    $('textarea#fba_issues_info').val('Testing by CMA');
    $('button#missing_inventory_submit-announce').click();
    });

    this.wait(2000, function () {
        this.capture('form5.png');
    });
});
*/

casper.on("page.error", function(msg, trace) {
    this.echo("Error: " + msg);
});

casper.on("resource.error", function(msg, trace) {
    this.echo("Res.Error: " + msg);
});

casper.wait(20000); // wait for event

casper.run();