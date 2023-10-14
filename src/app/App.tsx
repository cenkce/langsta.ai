import {
  ContentContextAtom, ContentStorage,
} from "../domain/content/ContentContext.atom";
import { LocalstorageSyncProvider } from "../api/storage/LocalstorageSync";
import { Panel } from "../ui/Panel";
import { SimplifyContentMenu } from "../ui/SimplifyContentMenu";
import "./App.css";

function App() {

  return (
    <LocalstorageSyncProvider
      debugKey="main"
      storageAtom={ContentContextAtom}
      contentStorage={ContentStorage}
    >
      <Panel>
        <SimplifyContentMenu onClick={() => {}} />
      </Panel>
    </LocalstorageSyncProvider>
  );
}

export default App;
