import {useChatStore} from '../store/useChatStore';
import SideBar from '../components/SideBar.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import NoChat from '../components/NoChat';
const HomePage = () => {

  const {selectedUser} = useChatStore(); 
  return (
    <div className="h-screen  bg-base-200">
      <div className="flex items-center justify-center h-screen pt-20 px-4" >
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl hsx:p-10 p-6 text-center h-[calc(100vh-5rem)] flex flex-col justify-center">
          <div className='flex h-full rounded-lg overflow-hidden'>
            <SideBar/>

            {!selectedUser ? <NoChat/> :<ChatWindow/>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage