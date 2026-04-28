import React from 'react';
import {useChatStore} from "../store/useChatStore";
import {useAuthStore} from "../store/useAuthStore";
import {useEffect} from "react";
import SideBarSkeleton from './skeletons/SideBarSkeleton';
import {Users} from "lucide-react";

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
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 
    flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Search Input */}
        <div className="hidden lg:block mb-4">
          <input
            type="text"
            placeholder="Search contacts..."
            className="input input-bordered input-sm w-full rounded-xl bg-base-200/50 border-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Online Filter Toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm checkbox-primary rounded-md"
            />
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">Only online</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      {/* Contacts */}
      <div className="overflow-y-auto w-full py-3">
         {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePicture || "/avatar.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
      </aside>
  )
}

export default SideBar