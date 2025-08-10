try {
    if (await window.pok.fileSystem.readFileText(window.pok.fileSystem.formatLocation(POSH.workingDirectory + POSH.args[1] + "/")) == "") {
        POSH.workingDirectory += POSH.args[1] + "/";
        POSH.workingDirectory = window.pok.fileSystem.formatLocation(POSH.workingDirectory);
    }else{
        throw new Error('Cannot CD into a file. Try "cat" if you want to look at a files contents');
    }
} catch (error) {
    throw new Error(`cannot CD into nonexistant directory : ${error}`);
}