var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    viewportSize: {width: 1024, height: 768}
});

var utils = require('utils');
var f = utils.format;

casper.on('page.resource.requested', function(req) {
    casper.log('page.resource.requested: ' + JSON.stringify(req, undefined, 4));
});


casper.start('http://127.0.0.1:10000/', function() {
    this.capture('index.png');
    casper.page.onFileDownload = function (url, responseData) {
        casper.log('casper.page.onFileDownload: ' + url);
        casper.log('responseData: ' + JSON.stringify(responseData));
        // phantomjs/src/webpage.cpp:1634 indicates responseData has
        // properties: filename, size, contentType. PhantomJS expects
        // this callback to behave analogously to a file download prompt
        // where the user gives a file name and folder to save the
        // resource downloading. So return a file name. From the looks
        // of phantomjs/src/webpage.cpp:1651, the return value must be
        // either a path to a file name or a path to a directory. The
        // path can be relative or absolute.
        d = new Date();
        ds = d.toISOString();
        prefix = ds.replace(/:/g, "-");
        return prefix + "-" + responseData.filename;
    };
    this.click('a[name="simple_link"]');
});

casper.then(function (response) {
    this.click('a[name="using_javascript"]');
});

casper.waitForResource("nullbytes");

casper.run();
