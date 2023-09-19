import { useUserContentValue } from '../domain/content/ContentContext.atom';
import { UserProvider } from '../domain/user/UserProvider'
import { Panel } from '../ui/Panel'
import { SimplifyContentMenu } from '../ui/SimplifyContentMenu'
import './App.css'
// import { useSimplifyContentService } from './domain/simplify-content/SimplifyContentService'

function App() {
  // const simplifyService = useSimplifyContentService();
  const content = useUserContentValue();
  console.log('main app : ', content);

  return (
    <UserProvider>
      <Panel>
        <SimplifyContentMenu onClick={() => {

          // simplifyService.simplifyCOntentByLevel(level, "");
        }} />
      </Panel>
    </UserProvider>
  )
}

export default App
