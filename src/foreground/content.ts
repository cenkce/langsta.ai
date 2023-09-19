import { initializeApplication } from "../app-content/main";

// const getSelectedText = () => window.getSelection()?.toString() || "";

const contentApplicationRoot = document.createElement("div");
contentApplicationRoot.id = 'contentApllitionRoot';
contentApplicationRoot.style.zIndex = Number.MAX_SAFE_INTEGER.toString();

document.childNodes[1].appendChild(contentApplicationRoot);
initializeApplication(contentApplicationRoot);
