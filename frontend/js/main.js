import { FileSystem } from "./FileSystem/FileSystem.js";
import { POPT } from "./POPT/POPT.js";

const devMode = false;

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
    let spaceStr = " ".repeat(Math.abs((newTerm.columns.value - tailText.length - baseText.length) - barStr.length))
    newTerm.say(`\n${baseText}${" ".repeat(Math.abs(spaceLength))}`);
    if (newTerm.currentLine >= newTerm.rows.value - 1) {
        newTerm.currentLine = newTerm.rows.value - 2;
        newTerm.scroll();
        newTerm.getLine(newTerm.rows.value - 1).innerText = `|${'-'.repeat(newTerm.columns.value - 2)}|`;
    }
    newTerm.getLine(newTerm.rows.value).innerText = `${baseText}${barStr}${spaceStr}${tailText}`;
}

window.newTerm = new POPT(document.querySelector("body"));

/**
 *@type {POPT}
 */
let newTerm = window.newTerm;

//creating terminal & resizing to fit screen
async function start(){
    /**
     *@type { POPT }
     */
    newTerm.resizeToContainer();


    window.addEventListener("resize", newTerm.resizeToContainer.bind(newTerm));


    //some dummmy text
    //newTerm.say("hello world!\nhow are you?\nprogress of reading /builds/paperOS.zip...\n\n");
    newTerm.say("Welcome!\nsearching for a drive to boot into...");


    //getting and displaying the progress of retrieving the file paperOS.zip
    //using the fromZipFile thing
    let sda = new FileSystem("sda");
    await sda.initFS();
    window.sda = sda;
    //TODO: add a developer mode flag, if it's false go ahead and properly search for the given drive.
    if(devMode || sda.size.usage <= 40000000){
        /** @type {FileSystem}*/
        sda = await FileSystem.fromZipFile("/builds/paperOS.zip", fetchDataPrg, fetchDataEnd, writeData);
    }
    let osDatRead = new sda.File("/", "osDat.json");
    await osDatRead.init().then(async ()=>{

        osDatRead = await osDatRead.readData();

        if(typeof osDatRead == "undefined"){
            throw new Error("the selected drive is not a valid OS for the POK shell. Please insert a valid OS to boot into.");
        }



    })
    osDatRead = await osDatRead.json();
    newTerm.say(`\n\n\n\nfilesystem successfully loaded! Booting ${osDatRead.OSName}\n`);
    let OSBoot = sda.File.constructFromFull(osDatRead.BootLocation);
    await OSBoot.init().then(async ()=>{
        OSBoot = await OSBoot.readData();
        OSBoot = await OSBoot.text();
        console.log(OSBoot);
        let osFn = new Function(OSBoot);
        window.onerror = null;
        newTerm = null;
        window.FileSystem = FileSystem;
        osFn();
    });
}
await start();
