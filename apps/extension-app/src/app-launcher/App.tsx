import {
  ContentContextAtom, ContentStorage,
} from "../domain/content/ContentContext.atom";
import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import { ArtBoard } from "../ui/ArtBoard";
import { LauncherPopOver } from "./LauncherPopOver";
import "./App.css";
import { SettingsAtom, SettingsStorage } from "../domain/user/SettingsModel";

function App() {
  useLocalstorageSync({
    debugKey: "content-sidepanel",
    storageAtom: ContentContextAtom,
    contentStorage: ContentStorage,
  });
  useLocalstorageSync({
    debugKey: "settings-sidepanel",
    storageAtom: SettingsAtom,
    contentStorage: SettingsStorage,
  });

  return (
    <ArtBoard
      title="Langsta"
      subtitle="Self-taught Language Asistant"
      theme="cupcake"
      className="min-w-max w-screen artboard-horizontal min-h-max"
    >
      <LauncherPopOver />
    </ArtBoard>
  );
}

export default App;
