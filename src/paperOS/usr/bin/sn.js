POSH.clear();
let subText = "press ctrl+s to save the document, ctrl+e to exit\n";
POSH.say(POSH.workingDirectory + POSH.args[1] + " ".repeat(POSH.charWidth - subText.length) + subText);

let file = await window.pok.fileSystem.readFileText(POSH.workingDirectory + POSH.args[1]);

await POSH.question.text(file, function (span, resolve) {
    return async function (event) {
        if (event.ctrlKey == true && event.key == "s") {
            event.preventDefault();
            await window.pok.fileSystem.writeFile(POSH.workingDirectory + POSH.args[1],
                window.pok.encoder.encode(span.innerText));
        } else if (event.ctrlKey == true && event.key == "e") {
            event.preventDefault();
            resolve(span.innerText);
        } else if (event.key == 'Tab') {
            event.preventDefault(); // Prevent switching focus
            document.execCommand("insertText", false, "    ");
        }
    }
});
POSH.say("\n");
