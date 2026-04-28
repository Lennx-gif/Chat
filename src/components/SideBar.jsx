import React from 'react';
import {useChatStore} from "../store/useChatStore";
import {useAuthStore} from "../store/useAuthStore";
import {useEffect, useRef} from "react";
import SideBarSkeleton from './skeletons/SideBarSkeleton';
import {Users, Search, ChevronLeft} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SideBar = () => {
  const {getUsers,users,selectedUser,setSelectedUser,isLoadingUsers} = useChatStore();
  const {onlineUsers,authUser} = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect (() => {
    getUsers();
    // Restore sidebar collapse state from localStorage
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsedState !== null) {
      setIsCollapsed(JSON.parse(savedCollapsedState));
    }
  }, [getUsers]);

  // Persist sidebar collapse state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const filteredUsers = (users ?? []).filter((user) => {
    if (user?._id === authUser?._id) return false;
    if (showOnlineOnly && !onlineUsers.includes(user?._id)) return false;
    if (searchQuery && !user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (isLoadingUsers) {
    return <SideBarSkeleton/>;
  }
  return (
    <aside className={`h-full flex flex-col transition-all duration-500 bg-base-100/10 backdrop-blur-2xl border-r border-base-content/5 relative z-20 pt-24 ${isCollapsed ? 'w-20' : 'w-80'}`}>
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-28 size-6 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-lg shadow-primary/20 z-30 hover:scale-110 transition-transform"
      >
        <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
          <ChevronLeft size={14} />
        </motion.div>
      </button>

      {/* Header */}
      <div className="p-6">
        <div className={`flex items-center gap-3 mb-8 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="size-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-inner">
            <Users className="w-6 h-6 text-primary" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="font-black text-xl tracking-tighter">CONTACTS</span>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-70">Directory</p>
            </motion.div>
          )}
        </div>

        {/* Search Input */}
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-6"
          >
            <input
              type="text"
              placeholder="Search people..."
              className="w-full bg-base-content/5 border border-base-content/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-base-content/30 font-medium"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Debounce search to reduce re-renders
                clearTimeout(searchTimeoutRef.current);
                searchTimeoutRef.current = setTimeout(() => {
                  // Search filtering happens in filteredUsers computation below
                }, 300);
              }}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-base-content/30" />
          </motion.div>
        )}

        {/* Online Filter Toggle */}
        <div className={`flex items-center justify-between ${isCollapsed ? 'hidden' : ''}`}>
          <label className="cursor-pointer flex items-center gap-2 group">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-xs checkbox-primary rounded-md border-base-content/20"
            />
            <span className="text-[10px] font-black text-base-content/40 uppercase tracking-widest group-hover:text-base-content/60 transition-colors">Active Only</span>
          </label>
          <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
            <span className="size-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black text-green-500 uppercase">{onlineUsers.length - 1}</span>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="overflow-y-auto w-full py-4 space-y-2 px-3 flex-1 scrollbar-none">
         <AnimatePresence mode="popLayout">
           {filteredUsers.map((user, index) => (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.03 }}
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-4 rounded-[1.25rem]
                transition-all duration-300 group relative overflow-hidden
                ${selectedUser?._id === user._id 
                  ? "bg-gradient-to-r from-primary/15 to-transparent border border-primary/20 shadow-lg shadow-primary/5" 
                  : "hover:bg-base-content/5 border border-transparent"}
              `}
            >
              {selectedUser?._id === user._id && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full"
                />
              )}

              <div className="relative flex-shrink-0">
                <img
                  src={user.profilePicture || "/avatar.png"}
                  alt={user.fullName}
                  className={`size-11 object-cover rounded-[1rem] transition-all duration-500 ${selectedUser?._id === user._id ? 'scale-110 shadow-lg shadow-primary/20' : 'group-hover:scale-105'}`}
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute -bottom-1 -right-1 size-3.5 bg-green-500 
                    rounded-full ring-4 ring-base-100 shadow-sm"
                  />
                )}
              </div>

              {/* User info - only visible when not collapsed */}
              {!isCollapsed && (
                <div className="text-left min-w-0 flex-1">
                  <div className={`font-black text-sm truncate tracking-tight ${selectedUser?._id === user._id ? 'text-primary' : 'text-base-content'}`}>
                    {user.fullName}
                  </div>
                  <div className="text-[10px] text-base-content/40 font-bold uppercase tracking-wider mt-0.5">
                    {onlineUsers.includes(user._id) ? (
                      <span className="text-green-500/80 flex items-center gap-1">
                        Online
                      </span>
                    ) : (
                      "Offline"
                    )}
                  </div>
                </div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>

        {filteredUsers.length === 0 && !isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-base-content/20 py-20 px-6"
          >
            <Search className="size-8 mx-auto mb-3 opacity-20" />
            <p className="text-xs font-black uppercase tracking-[0.2em]">No results</p>
          </motion.div>
        )}
      </div>
      </aside>
  )
}

export default SideBar