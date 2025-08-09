(async () => {
    document.body.style.backgroundColor = "black";
    window.pok.TEXT_FRAMEBUFFER = document.body;
    window.pok.TEXT_FRAMEBUFFER.style.overflow = "hidden";
    window.pok.clear();

    window.pok.fileSystem.readFileText = async (location) => {
        return window.pok.decoder.decode(await window.pok.fileSystem.readFile(location));
    }
    window.pok.executeFile = async function (path, scope = {}) {
        const scriptContent = await this.fileSystem.readFile(path);
        const decoded = window.pok.decoder.decode(scriptContent);

        const runner = new Function(...Object.keys(scope), `
        return (async () => {
            ${decoded}
        })();
    `);

        return runner(...Object.values(scope));
    };

    window.pok.fileSystem.readFileBin = async (location) => {
        return await new Blob([await window.pok.fileSystem.readFile(location)]);
    }
    await window.pok.executeFile("/usr/bin/posh.js");
})();
