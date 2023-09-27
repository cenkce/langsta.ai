import ContentContextAtom, { useUserContentValue } from '../domain/content/ContentContext.atom';
import { LocalstorageSyncProvider } from '../domain/storage/LocalstorageSync';
import { Panel } from '../ui/Panel'
import { SimplifyContentMenu } from '../ui/SimplifyContentMenu'
import './App.css'
// import { useSimplifyContentService } from './domain/simplify-content/SimplifyContentService'

function App() {
  // const simplifyService = useSimplifyContentService();
  const content = useUserContentValue();
  console.log('main app : ', content);

  return (
    <LocalstorageSyncProvider debugKey='main' storageAtom={ContentContextAtom}>
      <Panel>
        <SimplifyContentMenu onClick={() => {
        }} />
      </Panel>
    </LocalstorageSyncProvider>
  )
}

export default App
