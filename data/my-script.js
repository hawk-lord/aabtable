/**
 * Created by per on 2015-08-19.
 */

//window.alert("Page matches ruleset");

document.body.style.border = "thick solid blue";
document.body.style.backgroundColor = "yellow";

// document.title = "Hej document";

const Transaction = function() {
    paymentDate: "";
    amount: 0;
    categoryPurpose: "";
    creditorDebtor: "";
    href: "";
};


const table = document.getElementById('transactions');
if (table) {
    const rows = table.rows;
    var transactions = [];
    for (var row of rows) {
        const transaction = new Transaction();
        const cells = row.cells;
        const cellcount = cells.length;
        for (var i = 0; i < cellcount; i++) {
            var cell = cells[i];
            var value = "";
            var href = "";
            if (cell.firstChild) {
                if (cell.firstChild.nodeType === Node.TEXT_NODE) {
                    if (cell.firstChild.nodeValue) {
                        value = cell.firstChild.nodeValue.trim();
                    }
                }
                // usually an "A" element
                else if (cell.firstChild.nodeType === Node.ELEMENT_NODE) {
                    if (cell.firstChild.nodeName === "A") {
                        href = cell.firstChild.attributes.getNamedItem("href").value;
                    }
                    if (cell.firstChild.firstChild && cell.firstChild.firstChild.nodeType === Node.TEXT_NODE) {
                        if (cell.firstChild.firstChild.nodeValue) {
                            value = cell.firstChild.firstChild.nodeValue.trim();
                        }
                    }
                }
            }
            switch (i) {
                case 0:
                    transaction.paymentDate = value;
                    break;
                case 1:
                    transaction.amount = value;
                    break;
                case 3:
                    transaction.categoryPurpose = value;
                    break;
                case 4:
                    transaction.creditorDebtor = value;
                    transaction.href = href;
                    break;
            }

        }
        transactions.push(transaction);
    }
    window.alert(transactions);
    document.body.style.border = "thick solid green";
    const response = transactions;
    self.port.emit("tableRead", transactions);
}
else {
    document.body.style.border = "thick solid red";
    window.alert("No table was found");
}


