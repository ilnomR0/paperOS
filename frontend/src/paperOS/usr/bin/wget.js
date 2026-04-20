//# sourceURL=usr/bin/wget.js

import { File } from "../../../../js/FileSystem/File";
import { FileSystem } from "../../../../js/FileSystem/FileSystem";

class wget extends Application{
    constructor(POSH, argv){
        super({POSH, argv});
    }
    async appExecution(POSH, argv){
        //fetch the file from the internet
        const recievedFile = await FileSystem.progressFetch(argv[1], await this.active, await this.finish).then((resolve)=>{
            return resolve.arrayBuffer();
        });

        //create the file in the working directory
        /**@type{File}*/
        let file = await new window.sda.File(POSH.env.workingDir, argv[1].replace("/", "_"));
        file.init({create:true});
        file.writeData(recievedFile);
    }

    //fancy dancy text
    async active(received, total, percentage, prevPercentage){
        let activeLine = POSH.popt.currentLine;
        if (prevPercentage != percentage) {
            POSH.say(` | reading [${received} / ${total}]     ${Math.round(percentage)}%`)
        }
        POSH.popt.currentLine = activeLine;
    }
    async finish(){
        POSH.say("done!");
    }
}

return wget;
