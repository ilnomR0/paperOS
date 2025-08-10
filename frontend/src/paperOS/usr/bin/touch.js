    POSH.say(POSH.workingDirectory + POSH.args[1] + "\n");
    await window.pok.fileSystem.createFile(POSH.workingDirectory + POSH.args[1]);
    await window.pok.fileSystem.writeFile(POSH.workingDirectory  + POSH.args[1], window.pok.encoder.encode(""));
    await POSH.say(POSH.workingDirectory + POSH.args[1] + "\n");