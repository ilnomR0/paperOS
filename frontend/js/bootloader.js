import { FS } from "./fs.js";
//for managing .zip files
import * as fflate from "https://cdn.skypack.dev/fflate@0.8.2?min";
export class POK {
  constructor(text_framebuffer) {
    this.fileSystem = null;
    /**
     * @type {HTMLDivElement}
     */
    this.TEXT_FRAMEBUFFER = text_framebuffer;
  }

  async initFS() {
    const request = window.indexedDB.open("FS", 1);

    request.onerror = (e) => {
      console.error(`ERR ${e.target.error?.message}`);
    };

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      console.log("upgrade required?");
      db.createObjectStore("files", { keyPath: "location" });
    };

    request.onsuccess = async (e) => {
      const db = e.target.result;
      console.log("successfully loaded");

      this.fileSystem = new FS(db);
      this.main();
    };
  }
  createKeyHandler() {
    const keys = {}; // Store the state of keys (pressed/released)

    const keyDownHandler = (event) => {
      keys[event.key] = true; // Mark the key as pressed
    };

    const keyUpHandler = (event) => {
      keys[event.key] = false; // Mark the key as released
    };

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    keys["detect"] = () => {
      // This is the new "detect" method
      for (const key in keys) {
        if (keys[key]) {
          return key; // Return the first pressed key found
        }
      }
      return null; // No keys are currently pressed
    };

    return () => keys;
  }


  async say(text) {
    this.TEXT_FRAMEBUFFER.innerText += text;

    // Let the browser render the new content
    await new Promise(requestAnimationFrame);

    // Scroll to bottom
    document.scrollingElement.scrollTop =
      document.scrollingElement.scrollHeight;
  }

  async clear() {
    this.TEXT_FRAMEBUFFER.innerText = "";
  }

  async main() {
    this.question = {
      bool: async () => {
        return new Promise((resolve) => {
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
       * @param {bool} preventEnter
       * @param {Function} autocomplete
       * @returns
       */
      text: async (startingText, preventEnter, autocomplete) => {
        return new Promise((resolve) => {
          // Create a content editable span
          const span = document.createElement("span");
          span.style.width = "1000vw";
          span.contentEditable = true;
          span.innerText = startingText;
          span.style.border = "0";

          // Listen for Enter key press event
          span.addEventListener("keydown", function (event) {
            if (document.activeElement === span && event.key === "Tab") {
              event.preventDefault(); // Prevent switching focus
              autocomplete();
            } else if (
              (event.key === "Enter" &&
                event.shiftKey === false &&
                !preventEnter) ||
              (event.key === "e" && event.ctrlKey === true && preventEnter)
            ) {
              event.preventDefault(); // Prevent newline character
              span.contentEditable = false; // Disable contenteditable
              resolve(span.innerText.trim()); // Resolve the promise with the innerText
              span.innerText += "\n";
            } else if (
              event.key === "c" &&
              event.shiftKey === false &&
              event.ctrlKey === true
            ) {
              return;
            }
          });

          // Handle paste event
          span.addEventListener("paste", function (event) {
            event.preventDefault(); // Prevent default paste behavior

            // Get the pasted text from the clipboard
            const pastedText = (
              event.clipboardData || window.clipboardData
            ).getData("text/plain");

            // Manipulate the pasted text as needed (e.g., sanitize, transform)
            const sanitizedText = pastedText.trim();

            // Insert the sanitized text into the span
            document.execCommand("insertText", false, sanitizedText);
          });

          // Append the span to the document body
          this.TEXT_FRAMEBUFFER.appendChild(span);

          // Focus on the span for immediate input
          span.focus();

          this.TEXT_FRAMEBUFFER.addEventListener("click", function (event) {
            // Check if the click occurred outside the span
            if (event.target !== span && !span.contains(event.target)) {
              // Focus on the span
              span.focus();
            }
          });
        });
      },
    };

    this.PresentKeys = this.createKeyHandler();
    this.key = this.PresentKeys();
    this.decoder = new TextDecoder();
    this.encoder = new TextEncoder();

    await this.say("reading bootloader in /boot/PSH/main.js...");
    let OSBOOT = await this.fileSystem
      .readFile("/boot/PSH/main.js")
      .catch(async (reason) => {
        await this.say(`ERR: ${reason}\n`);
        await this.say(`would you like to install an OS from le interwebs?\n`);
        await this.say(`y : yes\nn : no\n`);
        let installOSWeb = await this.question.bool();
        if (installOSWeb) {
          await this.say(
            `alright! please type in the location of the OS\nwe highly recommend using POSH, the OS that is written for this.\n`
          );
          await this.say("URL for OS file location> ");
          let osLocation = await this.question.text(
            `${document.location.origin}/builds/paperOS.zip`,
            false
          );
          await this.say("ok, fetching and extracting files...\n");
          let osInstallBuffer = await fetch(osLocation).then((resolve) =>
            resolve.arrayBuffer()
          );
          /**
           * @type {object}
           */
          this.osFiles = fflate.unzipSync(new Uint8Array(osInstallBuffer));
          console.log(this.osFiles);

          let osInfoFile = JSON.parse(
            this.decoder.decode(this.osFiles[`${osLocation.replace(/.*\/|\.zip/g, "")}/osDat.json`])
          );
          await this.say(`Installing ${osInfoFile.OSName}...\n`);

          await this.say(
            `reading /${osInfoFile.OSName}${osInfoFile.OSLogoLocation}\n`
          );
          let fileInf = this.osFiles[`${osInfoFile.OSName}${osInfoFile.OSLogoLocation}`];
          console.log(this.decoder.decode(fileInf));
          await this.say(
            `writing /${osInfoFile.OSName}${osInfoFile.OSLogoLocation} to ${osInfoFile.OSLogoLocation}`
          );

          await this.fileSystem.createFile(osInfoFile.OSLogoLocation);
          await this.fileSystem.writeFile(osInfoFile.OSLogoLocation, fileInf);

          let logo = document.createElement("img");
          logo.setAttribute(
            "style",
            "position:fixed; right:4em; top:4em; height:15vh; zIndex:20"
          );
          logo.src = await URL.createObjectURL(await new Blob([fileInf]));
          document.body.appendChild(logo);
          await new Promise(requestAnimationFrame);

          for (let fileLocation of Object.keys(this.osFiles)) {
            if (
              fileLocation.replace(/^.*?(?=\/)/g, "") !=
              osInfoFile.OSLogoLocation
            ) {
              await this.say(`reading ${fileLocation}\n`);
              //await new Promise(requestAnimationFrame);

              let fileInf = this.osFiles[fileLocation];

              let targetPath = fileLocation.replace(/^.*?(?=\/)/g, "");

              await this.say(`writing ${fileLocation} to ${targetPath}\n`);
              //await new Promise(requestAnimationFrame);

              await this.fileSystem.createFile(targetPath);
              await this.fileSystem.writeFile(targetPath, fileInf);
            }
          }

          await this.initFS();
        } else {
          await this.say(
            `ok. If you would like to install POSH or any other OS, please refresh the page and try again`
          );
        }
      });

    console.log(this.decoder.decode(OSBOOT));
    let os = new Function(this.decoder.decode(OSBOOT));
    os();
  }
}
