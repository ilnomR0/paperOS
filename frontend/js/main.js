import { FileSystem } from "./FileSystem/FileSystem.js";
import { POSH } from "./POSH/POSH.js";


//functions for creating file flavor text and information

function fetchDataPrg(received, total, percentage) {
    let baseText = ` | reading [${received} / ${total}]   |`;
    let tailText = `|   ${Math.round(percentage)}%`;
    let spaceLength = newTerm.columns.value - (baseText.length + tailText.length);
    let barLength = spaceLength * (percentage / 100);
    let barStr = "="
    newTerm.say(`${baseText}${barStr.repeat(barLength / barStr.length)}${" ".repeat(spaceLength - Math.floor(barLength / barStr.length) * barStr.length)}${tailText}`);

}

function fetchDataEnd() {
    newTerm.say("\n | file begotten! Constructing the FileSystem...\n");
}

function writeData(zipLocations, fileNum) {
    let baseText = ` | writing ${zipLocations[fileNum].slice(0, newTerm.columns.value / 2)}  [${fileNum + 1} / ${zipLocations.length}]   |`;
    let tailText = `|   ${Math.round((fileNum / zipLocations.length) * 100)}%`;
    let spaceLength = newTerm.columns.value - (baseText.length + tailText.length);
    let barChar = "="
    let barStr = barChar.repeat((newTerm.columns.value - tailText.length - baseText.length) * (fileNum / zipLocations.length));
    let spaceStr = " ".repeat((newTerm.columns.value - tailText.length - baseText.length) - barStr.length)
    newTerm.say(`\n${baseText}${" ".repeat(spaceLength)}`);
    if (newTerm.currentLine >= newTerm.rows.value - 1) {
        newTerm.currentLine = newTerm.rows.value - 2;
        newTerm.scroll();
        newTerm.getLine(newTerm.rows.value - 1).innerText = `|${'-'.repeat(newTerm.columns.value - 2)}|`;
    }
    newTerm.getLine(newTerm.rows.value).innerText = `${baseText}${barStr}${spaceStr}${tailText}`;
}


//creating terminal & resizing to fit screen

/**
 *@type { POSH }
 */
window.newTerm = new POSH(document.querySelector("body"));

/**
 *@type {POSH}
 */
let newTerm = window.newTerm;
newTerm.resizeToContainer();

window.onerror = function (message, source, lineno, colno, error){
    newTerm.getLine(0).innerText = `\n${message} ${source}, ${lineno}, ${colno}, ${error}`;
    newTerm.getLine(0).style.backgroundColor = "red";
    newTerm.getLine(0).style.color = "black";
    
    console.error("called using window.onerror");

    return true;
}

window.addEventListener('error', (event)=>{
    console.error("called using window.addEventListener");
    newTerm.getLine(0).innerText = `\n${event}`;
    newTerm.getLine(0).style.backgroundColor = "red";
    newTerm.getLine(0).style.color = "black";
});

window.addEventListener("resize", newTerm.resizeToContainer.bind(newTerm));


//some dummmy text
newTerm.say("hello world!\nhow are you?\nprogress of reading /builds/paperOS/zip...\n\n");


//getting and displaying the progress of retrieving the file paperOS.zip
//using the fromZipFile thing
window.newFS = await FileSystem.fromZipFile("/builds/paperOS.zip", fetchDataPrg, fetchDataEnd, writeData);
let newFS = window.newFS;
window.testFile = new newFS.Folder("/", "root");

