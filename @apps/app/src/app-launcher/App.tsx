import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import { ArtBoard } from "../ui/ArtBoard";
import { LauncherPopOver } from "./LauncherPopOver";
import "./App.css";
import { SettingsAtom, SettingsStorage } from "../domain/user/SettingsModel";
import { ContentContextAtom, ContentStorage } from "../domain/content/ContentContext.atom";
import { Button } from "@mantine/core";
import { serviceWorkerContentMessageDispatch } from "../domain/content/messages";

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
      className="min-w-max w-screen artboard-horizontal min-h-max"
      hero={<StudyModeSettings ></StudyModeSettings>}
    >
      <LauncherPopOver />
    </ArtBoard>
  );
}

const StudyModeSettings = () => {
  return (
    <div className="join">
      <Button
        onClick={() => {
          serviceWorkerContentMessageDispatch({
            type: "open-study-mode-side-panel",
          });
        }}
      >
        Open Study Panel
      </Button>
    </div>
  );
};

export default App;
