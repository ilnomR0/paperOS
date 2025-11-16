//# sourceURL=boot/lib.js
(async () => {
    await window.paperOS.executeFile("/usr/bin","cards.js");
    
    paperOS.Cards = {
        parseDocument: async (location, ...defaultCSS) => {
            let docFile = await window.sda.File.constructFromFull(location).readData();
            let doc = await new DOMParser().parseFromString(await docFile.text(), "text/html");
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
                    const file = await window.sda.File.constructFromFull(href).readData();

                    let modifiedCSS = await file.text();
                    const styleURLs = [...modifiedCSS.matchAll(/url\(["']?(.*?)["']?\)/gmi)];
                    for (const match of styleURLs) {
                        const originalPath = await window.sda.File.constructFromFull(match[1]).readData();
                        console.log(originalPath);
                        const blob = URL.createObjectURL(await originalPath.blob());
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
                        const originalPath = await window.sda.File.constructFromFull(match[1]).readData();
                        console.log(originalPath);
                        const blob = URL.createObjectURL(await originalPath.blob());
                        modifiedCSS = modifiedCSS.replaceAll(match[0], `url("${blob}")`);
                    }

                    style.textContent = modifiedCSS;
            }

            console.log("after parse\n", doc.documentElement.innerHTML);
            return doc;
        }
    }
    await paperOS.executeFile("/usr/bin","posh.js");
    await paperOS.executeFile("/usr/bin","desk.js");
    let parsedFonts =  await paperOS.Cards.parseDocument("/etc/fonts/setFonts.html");
    let fontsCss = document.createElement("style");
    fontsCss.innerText = parsedFonts.documentElement.querySelector("style").innerText;
    document.head.appendChild(fontsCss);
})();
