while (POSH.running) {
    try {
        POSH.tag = `\u001b[38;2;0;255;255m${POSH.workingDirectory}\u001b[0m?\u001b[38;2;0;255;0m${POSH.currentUser}\u001b[0m> `;
        await POSH.say(POSH.tag);
        let historyPtr = -1;
        let prompt = await POSH.question.text("", function (span, resolve) {
            return async function (event) {
                if (document.activeElement === span && event.key === 'Tab') {
                    event.preventDefault(); // Prevent switching focus
                } else if ((event.key === 'Enter' && event.shiftKey === false)) {

                    event.preventDefault(); // Prevent newline character
                    span.contentEditable = false; // Disable contenteditable
                    resolve(span.innerText.trim()); // Resolve the promise with the innerText
                } else if ((event.key === 'c' && event.shiftKey === false && event.ctrlKey === true)) {
                    return;
                } else if ((event.key === "ArrowUp")) {
                    let histFile = await window.pok.fileSystem.readFileText(POSH.HISTFILE);
                    histFile = String(histFile).split("\n");
                    historyPtr < histFile.length - 1 ? historyPtr++ : historyPtr;
                    histFile.unshift("");
                    console.log(histFile, historyPtr);
                    span.innerText = histFile[historyPtr];
                } else if ((event.key === "ArrowDown")) {
                    let histFile = await window.pok.fileSystem.readFileText(POSH.HISTFILE);
                    histFile = String(histFile).split("\n");
                    historyPtr > 0 ? historyPtr-- : historyPtr;
                    histFile.unshift("");
                    console.log(histFile, historyPtr);
                    span.innerText = histFile[historyPtr];
                }
            };
        });
        POSH.say("\n");

        await window.pok.fileSystem.writeFile(POSH.HISTFILE, await window.pok.encoder.encode(prompt + '\n' + await window.pok.fileSystem.readFileText(POSH.HISTFILE)))

        POSH.args = [...prompt.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)].map(match => match[1] ?? match[2] ?? match[3]);

        await POSH.execCommand(POSH.args[0].startsWith("./") ? POSH.args[0].replace("./", POSH.workingDirectory) : POSH.args[0] + ".js");
    } catch (error) {
        POSH.say(`\u001b[38;2;255;0;0m${error}\n`);
    }
}
POSH.wind.closeWindow();