import {
  ContentContextAtom, ContentStorage,
} from "../domain/content/ContentContext.atom";
import { LocalstorageSyncProvider } from "../api/storage/LocalstorageSync";
import { Panel } from "../ui/Panel";
import { LauncherPopOver } from "./LauncherPopOver";
import "./App.css";

function App() {

  return (
    <LocalstorageSyncProvider
      debugKey="main"
      storageAtom={ContentContextAtom}
      contentStorage={ContentStorage}
    >
      <Panel>
        <LauncherPopOver onClick={() => {}} />
      </Panel>
    </LocalstorageSyncProvider>
  );
}

export default App;
