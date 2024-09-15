import { initializeApplication } from "../app-content/main";
const contentApplicationRoot = document.createElement("div");
contentApplicationRoot.id = '__contentAppllicationRoot__';
contentApplicationRoot.style.zIndex = Number.MAX_SAFE_INTEGER.toString();

console.log("Content script loaded");
document.childNodes[1].appendChild(contentApplicationRoot);
initializeApplication();
