import { initializeApplication } from "../app-content/main";

const contentApplicationRoot = document.createElement("div");
contentApplicationRoot.id = 'contentAppllicationRoot';
contentApplicationRoot.style.zIndex = Number.MAX_SAFE_INTEGER.toString();

document.childNodes[1].appendChild(contentApplicationRoot);
initializeApplication(contentApplicationRoot);
