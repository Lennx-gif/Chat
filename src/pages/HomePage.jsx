import {useChatStore} from '../store/useChatStore';
import SideBar from '../components/SideBar.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import NoChat from '../components/NoChat';
const HomePage = () => {

  const {selectedUser} = useChatStore(); 
  return (
    <div className="h-screen bg-base-200 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse-subtle" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse-subtle animation-delay-2000" />
      </div>

      <div className="flex items-center justify-center h-screen pt-20 px-4 relative z-10" >
        <div className="bg-base-100/40 backdrop-blur-xl border border-base-content/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-6xl rounded-[2.5rem] overflow-hidden h-[calc(100vh-8rem)] flex flex-col">
          <div className='flex h-full overflow-hidden'>
            <SideBar/>

            {!selectedUser ? <NoChat/> :<ChatWindow/>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage