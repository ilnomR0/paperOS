(async () => {
    document.body.innerHTML = await window.pok.fileSystem.readFileText("/usr/share/bootimg/main.html");

    let imgBlob = await window.pok.fileSystem.readFileBin("/usr/share/bootimg/images/PaperProductions.png");
    console.log(imgBlob);
    let imageSRC = URL.createObjectURL(imgBlob);
    console.log(imageSRC);
    document.getElementById("bootImage").src = imageSRC;
})();
