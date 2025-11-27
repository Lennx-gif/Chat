import React from 'react'
import {useChatStore} from '../store/useChatStore';
import { useEffect } from 'react';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import {useAuthStore} from '../store/useAuthStore';

const ChatWindow = () => {

  const {messages,getMessages,isLoadingMessages,selectedUser} = useChatStore();
  const {authUser} = useAuthStore();

  useEffect(() => {
    if(!selectedUser._id) return;
    getMessages(selectedUser._id);
  }, [getMessages,selectedUser._id]);
  if (isLoadingMessages) {
    return( 
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader/>
      <MessageSkeleton/>
      <MessageInput/>
    </div>)
  };
    

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader/>
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? 'chat-start' : 'chat-end'}`}
          >
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img src={message.senderId === authUser._id ? authUser.profilePic || "/avatar.png": selectedUser.profilePic || "/avatar.png"} 
                alt='Profile Pic' />
              </div>
            </div>
            <div className='chat-header mb-1'>
              <time className='text-xs opacity-45 ml-1'>
                {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </time>
            </div>
            <div className='chat-bubble flex flex-col'>
              {
                message.image && (<img 
                  src= {message.image}
                  alt='attachment'
                  className='sm:max-w-[200px] rounded-md mb-2'/>)
              }
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))};
      </div>
      <MessageInput/>
    </div>
  )
}

export default ChatWindow