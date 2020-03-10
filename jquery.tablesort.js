/**
 * Created by apple on 28.04.17.
 */
var aToZ = [];

function sortTable(tbody, columnNumber, textClass, dataType) {
    var rows = [];
    aToZ[columnNumber] = !aToZ[columnNumber];

    tbody.find("tr").each(function () {
        var tr = $(this);
        rows.push(tr);
    });

    var compare;
    switch (dataType) {
        case 'number':
            compare = function (a, b) {
                if (aToZ[columnNumber]) {
                    return getNumberFromString(a.find('.' + textClass)[columnNumber].innerHTML) - getNumberFromString(b.find('.' + textClass)[columnNumber].innerHTML);
                } else {
                    return getNumberFromString(b.find('.' + textClass)[columnNumber].innerHTML) - getNumberFromString(a.find('.' + textClass)[columnNumber].innerHTML);
                }
            };
            break;
        case 'string':
            compare = function (a, b) {
                if (aToZ[columnNumber]) {
                    return a.find('.' + textClass)[columnNumber].innerHTML >= b.find('.' + textClass)[columnNumber].innerHTML ? 1 : -1;
                } else {
                    return a.find('.' + textClass)[columnNumber].innerHTML >= b.find('.' + textClass)[columnNumber].innerHTML ? -1 : 1;
                }
            };
            break;
    }

    rows.sort(compare);

    for (var i = 0; i < rows.length; i++) {
        tbody.prepend(rows[i]);
    }
}

function getNumberFromString(line) {
    var result = '';

    for(var i = 0; i < line.length; i++){
        if(!isNaN(line[i])){
            result += line[i];
        }
    }

    return Number(result);
}