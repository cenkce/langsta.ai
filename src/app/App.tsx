import {
  ContentContextAtom,
  ContentStorageList,
} from "../domain/content/ContentContext.atom";
import { ContentStorage } from "../domain/content/ContentStorage";
import { LocalstorageSyncProvider } from "../domain/storage/LocalstorageSync";
import { Panel } from "../ui/Panel";
import { SimplifyContentMenu } from "../ui/SimplifyContentMenu";
import "./App.css";
// import { useSimplifyContentService } from './domain/simplify-content/SimplifyContentService'
const contentStorage = new ContentStorage(
  ContentStorageList.contentContextAtom
);

function App() {

  return (
    <LocalstorageSyncProvider
      debugKey="main"
      storageAtom={ContentContextAtom}
      contentStorage={contentStorage}
    >
      <Panel>
        <SimplifyContentMenu onClick={() => {}} />
      </Panel>
    </LocalstorageSyncProvider>
  );
}

export default App;
