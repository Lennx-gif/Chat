import React from 'react';
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useRef, useState } from "react";
import SideBarSkeleton from './skeletons/SideBarSkeleton';
import { Users, Search, ChevronLeft, Plus, MessageSquare, Compass, UserPlus, UserMinus, X, Check, Globe, User, Settings } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

const SideBar = () => {
  const {
    getUsers,
    users,
    groups,
    getGroups,
    selectedUser,
    setSelectedUser,
    selectedGroup,
    setSelectedGroup,
    isLoadingUsers,
    isLoadingGroups,
    searchUsersOnPlatform,
    connectUser,
    disconnectUser,
    createGroup,
    activeTab,
    setActiveTab,
    isDiscoverMode,
    setIsDiscoverMode
  } = useChatStore();

  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Discover mode states
  const [discoverQuery, setDiscoverQuery] = useState("");
  const [discoverResults, setDiscoverResults] = useState([]);
  const [isSearchingPlatform, setIsSearchingPlatform] = useState(false);

  // Group creation states
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]); // Array of user IDs

  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    getUsers();
    getGroups();
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsedState !== null) {
      setIsCollapsed(JSON.parse(savedCollapsedState));
    }
  }, [getUsers, getGroups]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Handle platform-wide user search
  const handlePlatformSearch = async (val) => {
    setDiscoverQuery(val);
    if (!val.trim()) {
      setDiscoverResults([]);
      return;
    }
    
    setIsSearchingPlatform(true);
    clearTimeout(searchTimeoutRef.current);
    
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchUsersOnPlatform(val);
      setDiscoverResults(results);
      setIsSearchingPlatform(false);
    }, 400);
  };

  const handleCreateGroupSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const newGroup = await createGroup({
      name: groupName,
      description: groupDesc,
      members: selectedMembers
    });

    if (newGroup) {
      setGroupName("");
      setGroupDesc("");
      setSelectedMembers([]);
      setShowCreateGroupModal(false);
      getGroups(); // Refresh
    }
  };

  const toggleMemberSelection = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const filteredUsers = (users ?? []).filter((user) => {
    if (user?._id === authUser?._id) return false;
    if (showOnlineOnly && !onlineUsers.includes(user?._id)) return false;
    if (searchQuery && !user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredGroups = (groups ?? []).filter((group) => {
    if (searchQuery && !group.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (isLoadingUsers && users.length === 0) {
    return <SideBarSkeleton />;
  }

  return (
    <aside className={`h-full flex flex-col transition-all duration-500 bg-base-100/10 backdrop-blur-2xl border-r border-base-content/5 relative z-20 pt-4 md:pt-24 w-full ${isCollapsed ? 'md:w-20' : 'md:w-80'} pb-20 md:pb-6`}>
      {/* Collapse Toggle - hidden on mobile */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden md:flex absolute -right-3 top-28 size-6 rounded-full bg-primary text-primary-content items-center justify-center shadow-lg shadow-primary/20 z-30 hover:scale-110 transition-transform"
      >
        <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
          <ChevronLeft size={14} />
        </motion.div>
      </button>

      {/* Header */}
      <div className="p-6 pb-2">
        <div className={`flex items-center justify-between mb-6 ${isCollapsed ? 'flex-col gap-4' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-inner">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="font-black text-lg tracking-tighter">MESSAGES</span>
                <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-70">Workspace</p>
              </div>
            )}
          </div>
          
          {/* Top Actions */}
          {!isCollapsed && (
            <>
              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-1">
                <button 
                  onClick={() => {
                    setIsDiscoverMode(!isDiscoverMode);
                    setDiscoverQuery("");
                    setDiscoverResults([]);
                  }}
                  className={`size-8 rounded-xl flex items-center justify-center border transition-all ${isDiscoverMode ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-base-content/5 border-transparent hover:bg-base-content/10'}`}
                  title="Discover / Add Contacts"
                >
                  <Compass className="size-4" />
                </button>
                {activeTab === "groups" && (
                  <button 
                    onClick={() => setShowCreateGroupModal(true)}
                    className="size-8 rounded-xl flex items-center justify-center bg-primary text-primary-content hover:opacity-90 shadow-lg shadow-primary/10 transition-transform active:scale-95"
                    title="Create New Group"
                  >
                    <Plus className="size-4" />
                  </button>
                )}
              </div>
              
              {/* Mobile Actions */}
              <div className="flex md:hidden items-center gap-2">
                {activeTab === "groups" && !isDiscoverMode && (
                  <button 
                    onClick={() => setShowCreateGroupModal(true)}
                    className="size-8 rounded-xl bg-primary text-primary-content flex items-center justify-center shadow-lg shadow-primary/20 transition-transform active:scale-95"
                    title="Create New Group"
                  >
                    <Plus className="size-4" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Tabs - hidden on mobile */}
        {!isCollapsed && !isDiscoverMode && (
          <div className="hidden md:flex bg-base-content/5 p-1 rounded-2xl mb-6">
            <button 
              onClick={() => {
                setActiveTab("chats");
                setSelectedGroup(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeTab === "chats" ? 'bg-base-100 text-base-content shadow-sm' : 'text-base-content/50 hover:text-base-content'}`}
            >
              <Users className="size-3.5" />
              Chats
            </button>
            <button 
              onClick={() => {
                setActiveTab("groups");
                setSelectedUser(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeTab === "groups" ? 'bg-base-100 text-base-content shadow-sm' : 'text-base-content/50 hover:text-base-content'}`}
            >
              <Globe className="size-3.5" />
              Groups
            </button>
          </div>
        )}
      </div>

      {/* Discover Mode View */}
      {isDiscoverMode && !isCollapsed ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 mb-4 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-primary">Discover People</span>
            <button 
              onClick={() => {
                setIsDiscoverMode(false);
                setDiscoverQuery("");
                setDiscoverResults([]);
              }}
              className="text-xs text-base-content/40 hover:text-base-content font-bold uppercase tracking-wider flex items-center gap-0.5"
            >
              <X className="size-3" /> Close
            </button>
          </div>
          <div className="px-6 mb-4 relative">
            <input
              type="text"
              placeholder="Search platform email or name..."
              className="w-full bg-base-content/5 border border-base-content/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-base-content/30 font-medium"
              value={discoverQuery}
              onChange={(e) => handlePlatformSearch(e.target.value)}
            />
            <Search className="absolute left-10 top-1/2 -translate-y-1/2 size-4 text-base-content/30" />
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3 scrollbar-none">
            {isSearchingPlatform ? (
              <div className="text-center py-10">
                <span className="loading loading-spinner loading-md text-primary"></span>
              </div>
            ) : discoverResults.length > 0 ? (
              discoverResults.map((result) => {
                const isConnected = users.some(u => u._id === result._id);
                return (
                  <div key={result._id} className="p-3 bg-base-content/5 rounded-[1.25rem] flex items-center justify-between border border-base-content/5">
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={result.profilePicture || "/avatar.png"} 
                        alt={result.fullName} 
                        className="size-10 object-cover rounded-xl"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-sm truncate">{result.fullName}</div>
                        <div className="text-[10px] text-base-content/40 truncate">{result.email}</div>
                      </div>
                    </div>
                    
                    {isConnected ? (
                      <button 
                        onClick={() => disconnectUser(result._id)}
                        className="size-8 rounded-xl bg-error/10 hover:bg-error/20 text-error flex items-center justify-center border border-error/10 transition-colors"
                        title="Disconnect Contact"
                      >
                        <UserMinus className="size-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => connectUser(result._id)}
                        className="size-8 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center border border-primary/10 transition-colors"
                        title="Connect / Add Contact"
                      >
                        <UserPlus className="size-4" />
                      </button>
                    )}
                  </div>
                );
              })
            ) : discoverQuery.trim() ? (
              <div className="text-center text-base-content/30 py-10 font-bold uppercase tracking-wider text-xs">
                No users found
              </div>
            ) : (
              <div className="text-center text-base-content/30 py-10 text-xs font-bold leading-relaxed max-w-[200px] mx-auto uppercase tracking-widest opacity-60">
                Type an email or name to find connections
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Normal Chat / Group View */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Local Filter/Search */}
          {!isCollapsed && (
            <div className="px-6 mb-4 relative">
              <input
                type="text"
                placeholder={activeTab === "chats" ? "Search contacts..." : "Search groups..."}
                className="w-full bg-base-content/5 border border-base-content/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-base-content/30 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-10 top-1/2 -translate-y-1/2 size-4 text-base-content/30" />
            </div>
          )}

          {/* Active filter for Chats */}
          {activeTab === "chats" && !isCollapsed && (
            <div className="px-6 mb-4 flex items-center justify-between">
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
                <span className="text-[9px] font-black text-green-500 uppercase">
                  {Math.max(0, onlineUsers.filter(id => users.some(u => u._id === id)).length)}
                </span>
              </div>
            </div>
          )}

          {/* List Section */}
          <div className="overflow-y-auto w-full py-2 space-y-2 px-3 flex-1 scrollbar-none">
            {activeTab === "chats" ? (
              /* Contacts List */
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
                      <div className={`p-0.5 rounded-[1.2rem] border-2 transition-all duration-300 ${onlineUsers.includes(user._id) ? "border-green-500 animate-glow" : "border-transparent"}`}>
                        <img
                          src={user.profilePicture || "/avatar.png"}
                          alt={user.fullName}
                          className={`size-11 object-cover rounded-[1rem] transition-all duration-500 ${selectedUser?._id === user._id ? 'scale-105 shadow-md shadow-primary/10' : 'group-hover:scale-105'}`}
                        />
                      </div>
                      {onlineUsers.includes(user._id) && (
                        <span
                          className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 
                          rounded-full ring-2 ring-base-100 shadow-sm"
                        />
                      )}
                    </div>

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
            ) : (
              /* Groups List */
              <AnimatePresence mode="popLayout">
                {isLoadingGroups ? (
                  <div className="text-center py-10">
                    <span className="loading loading-spinner loading-md text-primary"></span>
                  </div>
                ) : filteredGroups.map((group, index) => (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                    key={group._id}
                    onClick={() => setSelectedGroup(group)}
                    className={`
                      w-full p-3 flex items-center gap-4 rounded-[1.25rem]
                      transition-all duration-300 group relative overflow-hidden
                      ${selectedGroup?._id === group._id 
                        ? "bg-gradient-to-r from-primary/15 to-transparent border border-primary/20 shadow-lg shadow-primary/5" 
                        : "hover:bg-base-content/5 border border-transparent"}
                    `}
                  >
                    {selectedGroup?._id === group._id && (
                      <motion.div 
                        layoutId="active-pill-group"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full"
                      />
                    )}

                    <div className="relative flex-shrink-0">
                      <img
                        src={group.avatar || "/group-avatar.png"}
                        alt={group.name}
                        className={`size-11 object-cover rounded-[1rem] transition-all duration-500 bg-primary/10 ${selectedGroup?._id === group._id ? 'scale-110 shadow-lg shadow-primary/20' : 'group-hover:scale-105'}`}
                        onError={(e) => {
                          e.target.src = "https://cdn-icons-png.flaticon.com/512/166/166258.png";
                        }}
                      />
                    </div>

                    {!isCollapsed && (
                      <div className="text-left min-w-0 flex-1">
                        <div className={`font-black text-sm truncate tracking-tight ${selectedGroup?._id === group._id ? 'text-primary' : 'text-base-content'}`}>
                          {group.name}
                        </div>
                        <div className="text-[10px] text-base-content/40 font-bold uppercase tracking-wider mt-0.5 truncate">
                          {group.members.length} Members | {group.description || "No description"}
                        </div>
                      </div>
                    )}
                  </motion.button>
                ))}
              </AnimatePresence>
            )}

            {/* Empty States */}
            {activeTab === "chats" && filteredUsers.length === 0 && !isCollapsed && (
              <div className="text-center text-base-content/25 py-20 px-6">
                <Compass className="size-8 mx-auto mb-3 opacity-20" />
                <p className="text-xs font-black uppercase tracking-[0.2em]">No contacts</p>
                <button 
                  onClick={() => setIsDiscoverMode(true)}
                  className="mt-4 text-[10px] bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl font-bold uppercase tracking-widest hover:bg-primary/20 transition-all"
                >
                  Find Connections
                </button>
              </div>
            )}

            {activeTab === "groups" && filteredGroups.length === 0 && !isCollapsed && (
              <div className="text-center text-base-content/25 py-20 px-6">
                <Globe className="size-8 mx-auto mb-3 opacity-20" />
                <p className="text-xs font-black uppercase tracking-[0.2em]">No groups</p>
                <button 
                  onClick={() => setShowCreateGroupModal(true)}
                  className="mt-4 text-[10px] bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl font-bold uppercase tracking-widest hover:bg-primary/20 transition-all"
                >
                  Create Group
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Group Modal Overlay */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-base-100 border border-base-content/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
          >
            <button 
              onClick={() => setShowCreateGroupModal(false)}
              className="absolute right-6 top-6 size-8 rounded-full bg-base-content/5 hover:bg-base-content/10 flex items-center justify-center text-base-content/50 transition-colors"
            >
              <X className="size-4" />
            </button>
            
            <h3 className="text-xl font-black mb-6 tracking-tight">CREATE NEW GROUP</h3>
            
            <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-base-content/50 mb-2 block">Group Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Project Collaborators"
                  className="w-full bg-base-content/5 border border-base-content/5 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-base-content/50 mb-2 block">Description</label>
                <textarea 
                  placeholder="What is this group for?"
                  className="w-full bg-base-content/5 border border-base-content/5 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold h-20 resize-none"
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-base-content/50 mb-2 block">Select Members</label>
                <div className="max-h-40 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                  {users.length > 0 ? (
                    users.filter(u => u._id !== authUser._id).map((contact) => (
                      <label 
                        key={contact._id}
                        className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer hover:bg-base-content/5 transition-colors border ${selectedMembers.includes(contact._id) ? 'border-primary/30 bg-primary/5' : 'border-transparent'}`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={contact.profilePicture || "/avatar.png"} alt={contact.fullName} className="size-8 object-cover rounded-xl" />
                          <span className="font-bold text-sm">{contact.fullName}</span>
                        </div>
                        <input 
                          type="checkbox"
                          checked={selectedMembers.includes(contact._id)}
                          onChange={() => toggleMemberSelection(contact._id)}
                          className="checkbox checkbox-sm checkbox-primary rounded-md"
                        />
                      </label>
                    ))
                  ) : (
                    <div className="text-xs text-base-content/30 italic py-2">
                      Connect with contacts first to add them to a group
                    </div>
                  )}
                </div>
              </div>

              <button 
                type="submit"
                disabled={!groupName.trim()}
                className="w-full py-4 bg-primary text-primary-content font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Group ({selectedMembers.length + 1} members)
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </aside>
  );
};

export default SideBar;