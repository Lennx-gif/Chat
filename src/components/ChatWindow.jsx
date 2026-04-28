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
    <div className='flex-1 flex flex-col overflow-auto bg-gradient-to-b from-base-100/5 via-base-100/10 to-base-100/5 backdrop-blur-md pt-24'>
      <ChatHeader/>
      <MessageSkeleton/>
      <MessageInput/>
    </div>)
  };
    

  return (
    <div className='flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-base-100/5 via-base-100/10 to-base-100/5 backdrop-blur-xl relative pt-24'>
      {/* Decorative gradient blur */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <ChatHeader/>
      
      <div 
        ref={scrollRef}
        className='flex-1 overflow-y-auto p-6 space-y-8 scrollbar-none relative z-10'
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isMe = message.senderId === authUser._id;
            return (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-4 max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className='size-12 rounded-[1.25rem] overflow-hidden border border-base-content/10 flex-shrink-0 mt-auto shadow-md'>
                    <img src={isMe ? authUser.profilePicture || "/avatar.png": selectedUser.profilePicture || "/avatar.png"} 
                    alt='Profile Pic' className="w-full h-full object-cover" />
                  </div>

                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`
                      px-5 py-3.5 rounded-[2rem] shadow-xl relative overflow-hidden group
                      ${isMe 
                        ? 'bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-xl border border-primary/20 text-base-content rounded-br-none' 
                        : 'bg-gradient-to-br from-base-content/10 to-base-content/5 backdrop-blur-xl border border-base-content/10 text-base-content rounded-bl-none'}
                    `}>
                      {/* Subtle hover glow */}
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                      {message.image && (
                        <motion.img 
                          layoutId={`img-${message._id}`}
                          src={message.image}
                          alt='attachment'
                          className='max-w-full sm:max-w-[400px] rounded-2xl mb-3 border border-base-content/5 shadow-2xl'
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      )}
                      {message.text && <p className="text-sm font-bold leading-relaxed tracking-tight">{message.text}</p>}
                    </div>
                    
                    <span className='text-[9px] font-black text-base-content/30 mt-2 px-2 uppercase tracking-[0.2em]'>
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