import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageSquare, Users, Compass, User, Settings } from "lucide-react";
import { motion } from "motion/react";
import { useChatStore } from "../store/useChatStore";

const BottomNav = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { 
    selectedUser, 
    selectedGroup, 
    setSelectedUser, 
    setSelectedGroup, 
    activeTab, 
    setActiveTab, 
    isDiscoverMode, 
    setIsDiscoverMode 
  } = useChatStore();

  const isChatOpen = pathname === "/" && (selectedUser || selectedGroup);

  if (isChatOpen) return null;

  // Tabs mapping
  const tabs = [
    {
      id: "chats",
      label: "Chats",
      icon: MessageSquare,
      isActive: pathname === "/" && !isDiscoverMode && activeTab === "chats",
      onClick: () => {
        setSelectedUser(null);
        setSelectedGroup(null);
        setIsDiscoverMode(false);
        setActiveTab("chats");
        navigate("/");
      }
    },
    {
      id: "groups",
      label: "Groups",
      icon: Users,
      isActive: pathname === "/" && !isDiscoverMode && activeTab === "groups",
      onClick: () => {
        setSelectedUser(null);
        setSelectedGroup(null);
        setIsDiscoverMode(false);
        setActiveTab("groups");
        navigate("/");
      }
    },
    {
      id: "discover",
      label: "Discover",
      icon: Compass,
      isActive: pathname === "/" && isDiscoverMode,
      onClick: () => {
        setSelectedUser(null);
        setSelectedGroup(null);
        setIsDiscoverMode(true);
        navigate("/");
      }
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      isActive: pathname === "/profile",
      onClick: () => {
        navigate("/profile");
      }
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      isActive: pathname === "/settings",
      onClick: () => {
        navigate("/settings");
      }
    }
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto">
      <div className="relative flex items-center justify-around py-2 px-3 bg-base-100/35 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_8px_32px_rgba(0,0,0,0.24)] overflow-hidden">
        {/* Liquid glass glossy sheen */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={tab.onClick}
              className="relative flex flex-col items-center justify-center py-2 px-3.5 rounded-2xl transition-all duration-300 active:scale-95"
            >
              {/* Liquid glass active indicator pill */}
              {tab.isActive && (
                <motion.div
                  layoutId="liquid-glass-pill"
                  className="absolute inset-0 bg-gradient-to-br from-primary/25 via-primary/15 to-primary/5 border border-primary/25 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.15)] rounded-2xl z-0"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30
                  }}
                >
                  {/* Gloss reflection highlight inside active pill */}
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-white/10 rounded-t-2xl" />
                </motion.div>
              )}
              
              <Icon 
                className={`size-5 relative z-10 transition-all duration-300 ${
                  tab.isActive 
                    ? "text-primary drop-shadow-[0_0_8px_rgba(147,51,234,0.4)] scale-110" 
                    : "text-base-content/50 hover:text-base-content/80"
                }`} 
              />
              <span 
                className={`text-[9px] font-black uppercase tracking-wider relative z-10 mt-1 transition-colors duration-300 ${
                  tab.isActive ? "text-primary font-black" : "text-base-content/50"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
