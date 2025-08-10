import { POK } from "./bootloader.js";

window.pok = new POK(document.getElementById("text_framebuffer"));

await window.pok.initFS();