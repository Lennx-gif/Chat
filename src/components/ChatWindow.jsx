import React from 'react'
import {useChatStore} from '../store/useChatStore';
import { useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import {useAuthStore} from '../store/useAuthStore';
import { motion, AnimatePresence } from "motion/react";

const ChatWindow = () => {

  const {messages,getMessages,isLoadingMessages,selectedUser,subscribeToMessages,unsubscribeFromMessages} = useChatStore();
  const {authUser} = useAuthStore();
  const scrollRef = useRef(null);

  useEffect(() => {
    if(!selectedUser?._id) return;
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [getMessages,selectedUser?._id,subscribeToMessages,unsubscribeFromMessages]);

  useEffect(() => {
    if (scrollRef.current && messages) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  if (isLoadingMessages) {
    return( 
    <div className='flex-1 flex flex-col overflow-auto bg-base-100/10 backdrop-blur-sm'>
      <ChatHeader/>
      <MessageSkeleton/>
      <MessageInput/>
    </div>)
  };
    

  return (
    <div className='flex-1 flex flex-col overflow-hidden bg-base-100/10 backdrop-blur-sm relative'>
      <ChatHeader/>
      
      <div 
        ref={scrollRef}
        className='flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-base-content/10'
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isMe = message.senderId === authUser._id;
            return (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className='size-10 rounded-2xl overflow-hidden border border-base-content/10 flex-shrink-0 mt-auto shadow-sm'>
                    <img src={isMe ? authUser.profilePicture || "/avatar.png": selectedUser.profilePicture || "/avatar.png"} 
                    alt='Profile Pic' className="w-full h-full object-cover" />
                  </div>

                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`
                      px-4 py-2.5 rounded-[1.5rem] shadow-sm relative overflow-hidden
                      ${isMe 
                        ? 'bg-primary/20 backdrop-blur-md border border-primary/20 text-base-content rounded-br-none' 
                        : 'bg-base-100/40 backdrop-blur-md border border-base-content/10 text-base-content rounded-bl-none'}
                    `}>
                      {/* Suble glow for own messages */}
                      {isMe && <div className="absolute inset-0 bg-primary/5 pointer-events-none" />}

                      {message.image && (
                        <motion.img 
                          layoutId={`img-${message._id}`}
                          src={message.image}
                          alt='attachment'
                          className='max-w-full sm:max-w-[320px] rounded-xl mb-2 border border-base-content/5 shadow-inner'
                        />
                      )}
                      {message.text && <p className="text-sm font-medium leading-relaxed">{message.text}</p>}
                    </div>
                    
                    <span className='text-[10px] font-bold text-base-content/30 mt-1.5 px-1 uppercase tracking-tighter'>
                      {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <MessageInput/>
    </div>
  )
}

export default ChatWindow