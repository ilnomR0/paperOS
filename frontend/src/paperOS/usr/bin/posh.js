(async () => {
    window.PATH = JSON.parse(await window.pok.fileSystem.readFileText("/usr/share/posh/posh.json")).PATH;
})();
class posh {
    /**
     * 
     * @param {HTMLElement} terminal 
     */
    constructor(wind) {
        this.terminal = wind.getElementsByClassName("application")[0].shadowRoot.getElementById("Terminal");
        this.wind = wind;
        console.log(window.currentUsr);
        this.currentUser = window.currentUsr;
        this.workingDirectory = "/usr/bin/";
        this.args = [];
        this.running = true;
    }
async say(text) {
    const splitText = text.split(/(\x1b\[[0-9;]*m)/gm);

    let currentSpan = document.createElement("span");

    const applyAnsi = (codes) => {
        currentSpan = document.createElement("span");

        let fgMode = false;
        let bgMode = false;

        for (let i = 0; i < codes.length; i++) {
            const code = parseInt(codes[i]);

            if (!fgMode && !bgMode) {
                switch (code) {
                    case 0:
                        // reset
                        currentSpan = document.createElement("span");
                        break;
                    case 1:
                        currentSpan.style.fontWeight = "bold";
                        break;
                    case 3:
                        currentSpan.style.fontStyle = "italic";
                        break;
                    case 4:
                        currentSpan.style.textDecoration = "underline";
                        break;
                    case 5:
                        currentSpan.classList.add("slowBlink");
                        break;
                    case 6:
                        currentSpan.classList.add("rapidBlink");
                        break;
                    case 9:
                        currentSpan.style.textDecoration = "line-through";
                        break;
                    case 38:
                        fgMode = true;
                        break;
                    case 48:
                        bgMode = true;
                        break;
                }
            } else if (fgMode && code === 2) {
                const r = parseInt(codes[++i]);
                const g = parseInt(codes[++i]);
                const b = parseInt(codes[++i]);
                currentSpan.style.color = `rgb(${r}, ${g}, ${b})`;
                fgMode = false;
            } else if (bgMode && code === 2) {
                const r = parseInt(codes[++i]);
                const g = parseInt(codes[++i]);
                const b = parseInt(codes[++i]);
                currentSpan.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
                bgMode = false;
            }
        }
    };

    for (let part of splitText) {
        if (part.startsWith("\x1b[") && part.endsWith("m")) {
            const codes = part.slice(2, -1).split(";");
            applyAnsi(codes);
        } else {
            const span = currentSpan.cloneNode();
            span.textContent = part;
            this.terminal.appendChild(span);
        }
    }
}


    async clear() {
        this.terminal.innerText = "";
    }

    exit() {
        this.running = false;
    }

    question = {
        bool: async () => {
            return new Promise(resolve => {
                function onKey(e) {
                    if (e.key === "y") {
                        window.removeEventListener("keypress", onKey);
                        resolve(true);
                    } else if (e.key === "n") {
                        window.removeEventListener("keypress", onKey);
                        resolve(false);
                    }
                }
                window.addEventListener("keypress", onKey);
            });
        },
        /**
         * 
         * @param {string} startingText 
         * @param {function} returnCondition
         * @param {function} cancelCondition
         * @param {Function} autocomplete
         * @returns 
         */
        text: async (startingText, keydownFn, pasteFn) => {
            return new Promise(resolve => {
                // Create a content editable span
                const span = document.createElement('span');
                span.style.width = "1000vw";
                span.contentEditable = true;
                span.innerText = startingText;
                span.style.border = '0';

                let keydownHandler = keydownFn?.(span, resolve);
                // Listen for Enter key press event
                span.addEventListener('keydown', keydownHandler || async function (event) {
                    if (document.activeElement === span && event.key === 'Tab') {
                        event.preventDefault(); // Prevent switching focus
                    } else if ((event.key === 'Enter' && event.shiftKey === false)) {

                        event.preventDefault(); // Prevent newline character
                        span.contentEditable = false; // Disable contenteditable
                        resolve(span.textContent); // Resolve the promise with the innerText
                    } else if ((event.key === 'c' && event.shiftKey === false && event.ctrlKey === true)) {
                        return;
                    }
                });

                let pasteHandler = pasteFn?.(span, resolve);

                // Handle paste event
                span.addEventListener('paste', pasteHandler || function (event) {
                    event.preventDefault(); // Prevent default paste behavior

                    // Get the pasted text from the clipboard
                    const pastedText = (event.clipboardData || window.clipboardData).getData('text/plain');

                    // Insert the sanitized text into the span
                    document.execCommand('insertText', false, pastedText);
                });

                // Append the span to the document body
                this.terminal.appendChild(span);

                // Focus on the span for immediate input
                span.focus();

                this.wind.addEventListener('click', function (event) {
                    // Check if the click occurred outside the span
                    if (event.target !== span && !span.contains(event.target)) {
                        // Focus on the span
                        span.focus();
                    }
                });
            });
        }
    }
    async execCommand(location) {
        try {
            let executableFile = "";

            for (let i = 0; i < window.PATH.split(":").length; i++) {
                if (await window.pok.fileSystem.readFile(window.PATH.split(":")[i] + location)) {
                    executableFile = window.PATH.split(":")[i] + location;
                    i = window.PATH.split(":").length + 1;
                }
            }
            await window.pok.executeFile(executableFile, { POSH: this });
        } catch (error) {
            await this.say(`\u001b[38;2;255;0;0m${error}\n`);
            console.error(error);
        }

    }

}

window.posh = posh;