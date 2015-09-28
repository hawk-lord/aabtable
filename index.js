//const self = require('sdk/self');

// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js
function dummy(text, callback) {
    callback(text);
}


/*

https://online.alandsbanken.fi/ebank/account/initTransactionDetails.do?backLink=reset&accountId=af9daecc9b7444dd43696ff4894061ecd1d0d67e74f9163f8d2c3f122b28244a&rowNo=0&type=trans&archivecode=20150820887711220012

https://online.alandsbanken.fi/ebank/account/initTransactionDetails.do
?backLink=reset
&accountId=af9daecc9b7444dd43696ff4894061ecd1d0d67e74f9163f8d2c3f122b28244a
&rowNo=0
&type=trans
&archivecode=20150820887711220012
*/

(function () {

    const pageMod = require("sdk/page-mod");
    const iofile = require("sdk/io/file");
    const {Cu, Ci} = require("chrome");
    const {OS} = Cu.import("resource://gre/modules/osfile.jsm", {});

    Cu.import("resource://gre/modules/Services.jsm");

    let cookies = Services.cookies.getCookiesFromHost("online.alandsbanken.fi");
    const path = OS.Path.join(OS.Constants.Path.desktopDir, "cookies-") + Date.now() + ".csv";
    const textWrite = iofile.open(path, "w");
    while (cookies.hasMoreElements()) {
        var cookie = cookies.getNext().QueryInterface(Ci.nsICookie2);
        dump(cookie.host + ";" + cookie.name + "=" + cookie.value + "\n");
        if (!textWrite.closed) {
                textWrite.write(cookie.host + ";" + cookie.name + "=" + cookie.value + "\n");
        }
    }
    textWrite.close();

    pageMod.PageMod({
        attachTo: ["existing", "top", "frame"],
        include: "https://online.alandsbanken.fi/ebank/account/fetchTransactionList.do",
        contentScriptFile: "./my-script.js",
        onAttach: function (worker) {
            worker.port.on("tableRead", function (response) {
                const path = OS.Path.join(OS.Constants.Path.desktopDir, "transactions-") + Date.now() + ".csv";
                // TextWriter object
                const textWriter = iofile.open(path, "w");
                if (!textWriter.closed) {
                    for (var transaction of response) {
                        textWriter.write(transaction.paymentDate + ";");
                        textWriter.write(transaction.amount + ";");
                        textWriter.write(transaction.categoryPurpose + ";");
                        textWriter.write(transaction.creditorDebtor + ";");
                        textWriter.write(transaction.href + ";");
                        textWriter.write("\n");
                    }
                    textWriter.close();
                }
            });
        }
    });
})();


exports.dummy = dummy;
