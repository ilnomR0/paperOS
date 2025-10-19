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

function fetchDataEnd(){
    newTerm.say("\n | file begotten! Constructing the FileSystem...\n");
}

function writeData(zipLocations, fileNum) {

    let baseText = ` | writing ${zipLocations[fileNum].slice(0, newTerm.columns.value/2)}  [${fileNum+1} / ${zipLocations.length}]   |`;
    let tailText = `|   ${Math.round((fileNum / zipLocations.length)*100)}%`;
    let spaceLength = newTerm.columns.value - (baseText.length + tailText.length);
    let barLength = spaceLength * (fileNum / zipLocations.length);
    let barStr = "="
    newTerm.currentLine = newTerm.rows.value - 1;
    newTerm.say(`\n${baseText}${" ".repeat(spaceLength)}`);
    newTerm.getLine(newTerm.rows.value).innerText = `${baseText}${barStr.repeat((newTerm.columns.value-tailText.length-baseText.length) * (fileNum / zipLocations.length))}${tailText}`;
}


//creating terminal & resizing to fit screen
let newTerm = new POSH(document.querySelector("body"));

newTerm.resizeToContainer();

window.addEventListener("resize", newTerm.resizeToContainer.bind(newTerm));


//some dummmy text
newTerm.say("hello world!\nhow are you?\nprogress of reading /builds/paperOS/zip...\n\n");


//getting and displaying the progress of retrieving the file paperOS.zip
//using the fromZipFile thing

let newFS = await FileSystem.fromZipFile("/builds/paperOS.zip", fetchDataPrg, fetchDataEnd, writeData);

window.testFile = new newFS.Folder("/", "root");
