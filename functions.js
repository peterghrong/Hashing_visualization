//variables declaration
var count_list = [];
var table = new Array(10);

var canvas = document.querySelector("canvas");
var parent = document.getElementById("background");

var c = canvas.getContext("2d");
//setting width to full
canvas.width = parent.offsetWidth;
canvas.height = parent.offsetHeight;

var width = canvas.width;
var height = canvas.height;

//draws the plain canvas and the root nodes
function rect_gen() {
    for (let i = 0; i < 10; i++) {
        c.rect(
            0 + i * (width / 10), //x is widht/10
            height - height / 10, //y is height - height / 10
            width / 10, //width
            height / 10 //height
        );

        c.font = "20pt sans-serif";
        c.textAlign = "center";
        c.fillText(i + 1, width / 20 + i * (width / 10), height - height / 20);
        c.stroke();
    }
}
rect_gen();

function removeItem(array, item) {
    for (var i in array) {
        if (array[i] == item) {
            array.splice(i, 1);
            break;
        }
    }
}
//djb2
function djb2(str) {
    var len = str.length;
    var hash = 5381;
    for (var idx = 0; idx < len; ++idx) {
        hash = 33 * hash + str.charCodeAt(idx);
    }
    return hash % 10;
}
//sdbm
const sdbm = (str) => {
    let arr = str.split("");
    return arr.reduce(
        (hashCode, currentVal) =>
            (hashCode =
                currentVal.charCodeAt(0) +
                (hashCode << 6) +
                (hashCode << 16) -
                hashCode),
        0
    );
};
//lose lose
lolo = function (str) {
    var hash = 0;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash += char;
    }
    return hash % 10;
};

function typable(id) {
    //this appends the values into the array for further investigations
    count_list.push(document.getElementById(id).value);
    //this part sets the attribute to int only if numbers choose
    if (document.getElementById(id).value == "number") {
        document.getElementById("rv").setAttribute("type", "number");
    }
    if (document.getElementById(id).value == "string") {
        document.getElementById("rv").setAttribute("type", "text");
    }
    if (count_list.length > 2) {
        for (let i = 0; i < 2; i++) {
            //element in the form of count_list[i]
            if (
                document.getElementById(count_list[i]).name ==
                document.getElementById(id).name
            ) {
                var rem = count_list[i];
            }
        }
        removeItem(count_list, rem);
    }
    //below is the typable checker
    //enables all the buttons
    if (count_list.length == 2) {
        document.getElementById("rv").removeAttribute("readonly");
        document.getElementById("Insert").removeAttribute("disabled");
        document.getElementById("remove").removeAttribute("disabled");
        document.getElementById("lookup").removeAttribute("disabled");
    }
}

function method() {
    if (document.getElementById("djb2").checked) {
        return "djb2";
    } else if (document.getElementById("sdbm").checked) {
        return "sdbm";
    } else if (document.getElementById("lolo").checked) {
        return "lolo";
    }
}

function calculation() {
    let st = document.getElementById("rv").value;
    var input_val = 0;
    if (document.getElementById("djb2").checked) {
        input_val = djb2(st);
    } else if (document.getElementById("sdbm").checked) {
        input_val = sdbm(st) % 10;
    } else if (document.getElementById("lolo").checked) {
        input_val = lolo(st);
    }
    return input_val;
}
function log(val, hash, method, funct) {
    var logElem = document.querySelector(".log");
    var time = new Date();
    var timeStr = time.toLocaleTimeString();
    logElem.innerHTML +=
        timeStr +
        ":   " +
        "Input " +
        val +
        " hashes to " +
        hash +
        " using " +
        method +
        " hash function" +
        funct +
        " the Hash table <br/>";
}

function drawNode(x, y, data) {
    c.beginPath();
    c.rect(
        x,
        y,
        width / 10 - 2, //width
        height / 10
    );
    c.stroke();
    c.font = "20pt sans-serif";
    c.textAlign = "center";
    c.fillText(data, x + width / 20, y + height / 20);
}

function drawLine(x, y, eX, eY) {
    c.beginPath();
    c.moveTo(x + width / 20, y);
    c.lineTo(eX + width / 20, eY);
    c.stroke();
}

//declare the hash array first
var prs_lst = new Array(10);
for (let i = 0; i < 10; i++) {
    prs_lst[i] = [];
}

function HashTable() {
    let st = document.getElementById("rv").value;
    let hash = calculation(st);
    for (let i = 0; i < 10; i++) {
        if (i == hash) {
            prs_lst[hash].push(st);
            //let k = dup_lst[hash].length;
            let k = prs_lst[hash].length;
            drawNode(
                0 + i * (width / 10),
                height - 2 * k * (height / 10) - height / 10,
                st
            );
            drawLine(
                0 + i * (width / 10),
                height - 2 * k * (height / 10),
                0 + i * (width / 10),
                height - 2 * k * (height / 10) + height / 10
            );
        }
    }
    log(st, hash, method(), " SUCCESSFULLY added to");
}
//this function compares arrays without order
function _compareArrays(arr1, arr2) {
    if (!(arr1 != null && arr2 != null && arr1.length == arr2.length)) {
        return false;
    }

    /* copy the arrays so that the original arrays are not affected when we set the indices to "undefined" */
    arr1 = [].concat(arr1);
    arr2 = [].concat(arr2);

    return arr1.every(function (element, index) {
        return arr2.some(function (e, i) {
            return e === element && ((arr2[i] = undefined), true);
        });
    });
}

function removal() {
    let st = document.getElementById("rv").value;
    let hash = calculation(st);
    var order = 0;
    //returns if the element is not present
    if (prs_lst[hash].length == 0 || prs_lst[hash].includes(st) == false) {
        return log(
            st,
            hash,
            method(),
            " FAILED to be removed because element is not present in the"
        );
    } else {
        let temp_lst = [];
        //this step deletes the element from the list
        for (let b = 0; b < prs_lst[hash].length; b++) {
            //this needs to be taken care off
            if (prs_lst[hash][b] == st) {
                temp_lst.push(st); //removes the element from prs_lst[hash]
            }
        }
        for (let a = 0; a < temp_lst.length; a++) {
            removeItem(prs_lst[hash], st);
        }
        //clears the board to redraw
        c.clearRect(
            // need to work on this
            -1 + hash * (width / 10),
            0,
            width / 10, //width
            height - height / 10 - 1
        );

        for (let i = 0; i < prs_lst[hash].length; i++) {
            drawNode(
                0 + hash * (width / 10),
                height - 2 * (i + 1) * (height / 10) - height / 10,
                prs_lst[hash][i]
            );
            drawLine(
                0 + hash * (width / 10),
                height - 2 * (i + 1) * (height / 10),
                0 + hash * (width / 10),
                height - 2 * (i + 1) * (height / 10) + height / 10
            );
        }
        log(st, hash, method(), " SUCCESSFULLY removed from the");
    }
}

function highlighting(x, y, data) {
    c.fillStyle = "#fcdb03";
    c.fillRect(
        x,
        y,
        width / 10 - 2, //width
        height / 10
    );
    c.font = "20pt sans-serif";
    c.textAlign = "center";
    c.fillStyle = "#000000";
    c.fillText(data, x + width / 20, y + height / 20);
}

function lokup() {
    let st = document.getElementById("rv").value;
    let hash = calculation(st);
    if (prs_lst[hash].length == 0 || prs_lst[hash].includes(st) == false) {
        return log(
            st,
            hash,
            method(),
            " FAILED to be highlighted because element is not present in the"
        );
    } else {
        for (let i = 0; i < prs_lst[hash].length; i++) {
            if (prs_lst[hash][i] == st) {
                highlighting(
                    0 + hash * (width / 10),
                    height - 2 * (i + 1) * (height / 10) - height / 10,
                    st
                );
            }
        }
        log(st, hash, method(), " SUCCESSFULLY highlighted in");
    }
}

console.log("prs_list");
console.log(prs_lst);
