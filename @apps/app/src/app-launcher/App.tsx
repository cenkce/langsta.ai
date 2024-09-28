import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import { ArtBoard } from "../ui/ArtBoard";
import { LauncherPopOver } from "./LauncherPopOver";
import "./App.css";
import { SettingsAtom, SettingsStorage, UsersAtom, UserStorage } from "../domain/user/SettingsModel";
import { Button } from "@mantine/core";
import { serviceWorkerContentMessageDispatch } from "../domain/content/messages";

function App() {

  useLocalstorageSync({
    debugKey: "settings-sidepanel",
    storageAtom: SettingsAtom,
    contentStorage: SettingsStorage,
  });

  useLocalstorageSync({
    debugKey: "settings-sidepanel",
    storageAtom: UsersAtom,
    contentStorage: UserStorage,
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
