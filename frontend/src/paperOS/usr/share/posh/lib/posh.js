//# sourceURL=usr/share/posh/lib/posh.js
while (POSH.running) {
    try {
        POSH.tag = `\u001b[38;2;0;255;255m${POSH.workingDirectory}\u001b[0m?\u001b[38;2;0;255;0m${POSH.currentUser}\u001b[0m> `;
        await POSH.say(POSH.tag);
        let historyPtr = -1;
        let prompt = await POSH.question.text("", function (span, resolve) {
            return async function (event) {
                
                let histFile = await window.sda.File.constructFromFull(POSH.HISTFILE);
                await histFile.init().then(async ()=>{
                    histFile = await histFile.readData();
                })

                if (document.activeElement === span && event.key === 'Tab') {
                    event.preventDefault(); // Prevent switching focus
                } else if ((event.key === 'Enter' && event.shiftKey === false)) {
                    span.contentEditable = false; // Disable contenteditable
                    event.preventDefault(); // Prevent newline character
                    span.innerText = span.innerText.trim();
                    resolve(span.innerText); // Resolve the promise with the innerText
                } else if ((event.key === 'c' && event.shiftKey === false && event.ctrlKey === true)) {
                    return;
                } else if ((event.key === "ArrowUp")) {
                    histFile = (await histFile.text()).split("\n");
                    historyPtr < histFile.length - 1 ? historyPtr++ : historyPtr;
                    histFile.unshift("");
                    console.log(histFile, historyPtr);
                    span.innerText = histFile[historyPtr];
                } else if ((event.key === "ArrowDown")) {
                    histFile = (await histFile.text()).split("\n");
                    historyPtr > 0 ? historyPtr-- : historyPtr;
                    histFile.unshift("");
                    console.log(histFile, historyPtr);
                    span.innerText = histFile[historyPtr];
                }
            };
        });
        POSH.say("\n");

        let historyFile = await window.sda.File.constructFromFull(POSH.HISTFILE);
        await historyFile.init().then(async ()=>{
            await historyFile.writeData(prompt+"\n", {keepExistingData:true});
        });

        POSH.args = [...prompt.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)].map(match => match[1] ?? match[2] ?? match[3]);

        await POSH.execCommand(POSH.args[0].startsWith("./") ? POSH.args[0].replace("./", `${POSH.workingDirectory}/`) : POSH.args[0] + ".js");
    } catch (error) {
        POSH.say(`\u001b[38;2;255;0;0m${error}\n`);
    }
}
POSH.wind.closeWindow();
