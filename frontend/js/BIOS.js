
//BIOS class: This is the Basic Input Output System for POSH. This is to interface javascript with HTML and CSS.
//This is also for file management and the like. 

export class BIOS {
  constructor(fileSystem){
    this.textBuffer = document.getElementById("body");
    this.fileSystem = fileSystem;  
}

  //say function : display text to the screen and scroll.
  async say(text) {
    this.textBuffer.innerText += text;

    // Let the browser render the new content
    await new Promise(requestAnimationFrame);

    // Scroll to bottom
    document.scrollingElement.scrollTop =
      document.scrollingElement.scrollHeight;
  }

  async clear(){
    this.textBuffer.innerText = "";
  }
}
