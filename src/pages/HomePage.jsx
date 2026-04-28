import {useChatStore} from '../store/useChatStore';
import SideBar from '../components/SideBar.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import NoChat from '../components/NoChat';
const HomePage = () => {

  const {selectedUser} = useChatStore(); 
  return (
    <div className="h-screen bg-base-200 relative overflow-hidden flex flex-col">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/15 rounded-full blur-[120px] animate-pulse-subtle" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse-subtle animation-delay-2000" />
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10" >
        <div className="w-full h-full flex overflow-hidden">
          <SideBar/>
          <main className="flex-1 flex flex-col overflow-hidden">
            {!selectedUser ? <NoChat/> : <ChatWindow/>}
          </main>
        </div>
      </div>
    </div>
  )
}

export default HomePage