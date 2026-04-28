import React from 'react';
import {useChatStore} from "../store/useChatStore";
import {useAuthStore} from "../store/useAuthStore";
import {useEffect} from "react";
import SideBarSkeleton from './skeletons/SideBarSkeleton';
import {Users, Search} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SideBar = () => {
  const {getUsers,users,selectedUser,setSelectedUser,isLoadingUsers} = useChatStore();
  const {onlineUsers,authUser} = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  useEffect (() => {
    getUsers();
  }, [getUsers]);

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
    <aside className="h-full w-20 lg:w-72 border-r border-base-content/10 
    flex flex-col transition-all duration-200 bg-base-100/20 backdrop-blur-md">
      {/* Header */}
      <div className="border-b border-base-content/10 w-full p-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg hidden lg:block tracking-tight">Contacts</span>
        </div>

        {/* Search Input */}
        <div className="hidden lg:block mb-4 relative">
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full bg-base-100/50 border border-base-content/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-base-content/40"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
        </div>

        {/* Online Filter Toggle */}
        <div className="mt-3 hidden lg:flex items-center justify-between">
          <label className="cursor-pointer flex items-center gap-2 group">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-xs checkbox-primary rounded-md opacity-70 group-hover:opacity-100 transition-opacity"
            />
            <span className="text-xs font-bold text-base-content/50 uppercase tracking-widest group-hover:text-base-content/70 transition-colors">Only online</span>
          </label>
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {onlineUsers.length - 1} online
          </span>
        </div>
      </div>

      {/* Contacts */}
      <div className="overflow-y-auto w-full py-4 space-y-1 px-2">
         <AnimatePresence mode="popLayout">
           {filteredUsers.map((user, index) => (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3 rounded-2xl
                transition-all duration-300 group
                ${selectedUser?._id === user._id 
                  ? "bg-primary/10 ring-1 ring-primary/30 shadow-[0_0_20px_rgba(var(--color-primary),0.1)]" 
                  : "hover:bg-base-content/5"}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePicture || "/avatar.png"}
                  alt={user.fullName}
                  className={`size-12 object-cover rounded-2xl transition-all duration-300 ${selectedUser?._id === user._id ? 'scale-110 shadow-lg' : 'group-hover:scale-105'}`}
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-green-500 
                    rounded-full ring-4 ring-base-100"
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0 flex-1">
                <div className={`font-bold truncate ${selectedUser?._id === user._id ? 'text-primary' : 'text-base-content'}`}>
                  {user.fullName}
                </div>
                <div className="text-xs text-base-content/50 font-medium">
                  {onlineUsers.includes(user._id) ? (
                    <span className="text-green-500/80">Active now</span>
                  ) : (
                    "Away"
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>

        {filteredUsers.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-base-content/40 py-10 px-4"
          >
            <p className="text-sm font-medium">No contacts found</p>
          </motion.div>
        )}
      </div>
      </aside>
  )
}

export default SideBar