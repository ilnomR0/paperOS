const files = await window.pok.fileSystem.readFolder(POSH.workingDirectory + (POSH.args[1] ?? ""));

for (const file of files) {
    await POSH.say(`${file.replace(POSH.workingDirectory, "")}\n`);
}
