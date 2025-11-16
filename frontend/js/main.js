import { FileSystem } from "./FileSystem/FileSystem.js";
import { PSH } from "./PSH/PSH.js";

window.onerror = (message, source, lineno, colno, error)=>{
    newTerm.currentLine++;
    newTerm.getLine(newTerm.currentLine).style.backgroundColor = "red";
    newTerm.getLine(newTerm.currentLine).style.color = "black";
    newTerm.getLine(newTerm.currentLine+1).style.backgroundColor = "red";
    newTerm.getLine(newTerm.currentLine+1).style.color = "black";
    newTerm.say(`${error}\n`);
    newTerm.getLine(newTerm.currentLine).style.backgroundColor = "red";
    newTerm.getLine(newTerm.currentLine).style.color = "black";
    newTerm.say(`src:${source}\n`);
    newTerm.getLine(newTerm.currentLine).style.backgroundColor = "red";
    newTerm.getLine(newTerm.currentLine).style.color = "black";
    newTerm.say(`ln#:${lineno}\n`);
    newTerm.getLine(newTerm.currentLine).style.backgroundColor = "red";
    newTerm.getLine(newTerm.currentLine).style.color = "black";
    newTerm.say(`col#:${colno}\n`); 

    return true;
}

/*
window.addEventListener('error', (event)=>{
    newTerm.getLine(0).innerText = `${event.error}`;
    newTerm.getLine(0).style.backgroundColor = "red";
    newTerm.getLine(0).style.color = "black";
});*/
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

window.newTerm = new PSH(document.querySelector("body"));

/**
 *@type {PSH}
 */
let newTerm = window.newTerm;

//creating terminal & resizing to fit screen
async function start(){
    /**
     *@type { PSH }
     */
    newTerm.resizeToContainer();


    window.addEventListener("resize", newTerm.resizeToContainer.bind(newTerm));


    //some dummmy text
    //newTerm.say("hello world!\nhow are you?\nprogress of reading /builds/paperOS.zip...\n\n");
    newTerm.say("Welcome!\nsearching for a drive to boot into...");


    //getting and displaying the progress of retrieving the file paperOS.zip
    //using the fromZipFile thing
    
    /**
     *@type {FileSystem}
     */
    
    let sda = await FileSystem.fromZipFile("/builds/paperOS.zip", fetchDataPrg, fetchDataEnd, writeData);
    window.sda = sda;


    let osDatRead = await new sda.File("/", "osDat.json").readData();
     
    if(typeof osDatRead == "undefined"){
        throw new Error("the selected drive is not a valid OS for the POK shell. Please insert a valid OS to boot into.");
    }
    osDatRead = await osDatRead.json();
    newTerm.say(`\n\n\n\nfilesystem successfully loaded! Booting ${osDatRead.OSName}\n`);
    


    let OSBoot = await sda.File.constructFromFull(osDatRead.BootLocation).readData();
    
    let osFn = new Function(await OSBoot.text());
    window.onerror = null;
    newTerm = null;
    window.FileSystem = FileSystem;
    osFn();
}
await start();
