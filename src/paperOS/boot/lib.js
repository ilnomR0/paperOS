(async () => {
    await window.pok.executeFile("/usr/bin/cards.js");
    window.Cards = {
        parseDocument: async (location, ...defaultCSS) => {
            let doc = await new DOMParser().parseFromString(await window.pok.fileSystem.readFileText(location), "text/html");
            if(defaultCSS){
                for(let cssDefault of defaultCSS){
                    let sheet = document.createElement("link");
                    sheet.setAttribute("rel", "stylesheet");
                    sheet.setAttribute("href", cssDefault);
                    doc.head.appendChild(sheet);
                }
            }
            console.log("pre parse\n", doc.documentElement.innerHTML);

            let linkTags = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'))
            let styleTags = Array.from(doc.querySelectorAll("style"));
            for (const link of linkTags) {
                const href = link.getAttribute("href");
                if (!href.startsWith("http")) {
                    const file = await window.pok.fileSystem.readFileText(href);

                    let modifiedCSS = file;
                    const styleURLs = [...file.matchAll(/url\(["']?(.*?)["']?\)/gmi)];
                    for (const match of styleURLs) {
                        const originalPath = match[1];
                        console.log(originalPath);
                        const blob = URL.createObjectURL(await window.pok.fileSystem.readFileBin(originalPath));
                        modifiedCSS = modifiedCSS.replaceAll(match[0], `url("${blob}")`);
                    }

                    const styleTag = doc.createElement("style");
                    styleTag.textContent = modifiedCSS;
                    link.replaceWith(styleTag);
                }
            }
            for(const style of styleTags){
                    let modifiedCSS = style.textContent;
                    const styleURLs = [...style.innerText.matchAll(/url\(["']?(.*?)["']?\)/gmi)];
                    for (const match of styleURLs) {
                        const originalPath = match[1];
                        console.log(originalPath);
                        const blob = URL.createObjectURL(await window.pok.fileSystem.readFileBin(originalPath));
                        modifiedCSS = modifiedCSS.replaceAll(match[0], `url("${blob}")`);
                    }

                    style.textContent = modifiedCSS;
            }

            console.log("after parse\n", doc.documentElement.innerHTML);
            return doc;
        }
    }
    await window.pok.executeFile("/usr/bin/posh.js");
    await window.pok.executeFile("/usr/bin/desk.js");
    let parsedFonts =  await window.Cards.parseDocument("/etc/fonts/setFonts.html");
    let fontsCss = document.createElement("style");
    fontsCss.innerText = parsedFonts.documentElement.querySelector("style").innerText;
    document.head.appendChild(fontsCss);
})();