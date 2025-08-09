try {
        POSH.say(window.pok.decoder.decode(await window.pok.fileSystem.readFile(POSH.workingDirectory  + POSH.args[1])) + "\n");
    
    } catch (error) {
    throw new Error(`cannot cat nonexistant file : ${error}`);
}