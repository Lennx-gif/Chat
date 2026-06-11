import { X, Phone, Video, MoreVertical, Shield, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { motion } from "motion/react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, selectedGroup, setSelectedGroup } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const activeTarget = selectedUser || selectedGroup;
  if (!activeTarget) return null;

  const isGroup = !!selectedGroup;
  const name = isGroup ? selectedGroup.name : selectedUser.fullName;
  const avatar = isGroup ? (selectedGroup.avatar || "/group-avatar.png") : (selectedUser.profilePicture || "/avatar.png");
  const isOnline = isGroup ? false : onlineUsers.includes(selectedUser._id);
  const statusText = isGroup ? `${selectedGroup.members.length} Members` : (isOnline ? "Active" : "Offline");

  const handleClose = () => {
    if (isGroup) {
      setSelectedGroup(null);
    } else {
      setSelectedUser(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6 border-b border-base-content/5 bg-base-100/10 backdrop-blur-xl relative z-20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-5">
          {/* Mobile Back Button */}
          <button
            onClick={handleClose}
            className="flex md:hidden size-10 rounded-2xl bg-base-content/5 text-base-content/60 hover:bg-base-content/10 items-center justify-center transition-all mr-1"
          >
            <ArrowLeft size={18} />
          </button>
          {/* Avatar */}
          <div className="relative group">
            <div className="size-14 rounded-[1.5rem] overflow-hidden border-2 border-primary/20 group-hover:border-primary/40 transition-colors shadow-lg bg-base-content/5">
              <img 
                src={avatar} 
                alt={name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  if (isGroup) {
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/166/166258.png";
                  }
                }}
              />
            </div>
            {!isGroup && isOnline && (
              <span className="absolute -bottom-1 -right-1 size-4 bg-green-500 rounded-full ring-4 ring-base-100 shadow-sm" />
            )}
          </div>

          {/* Chat Target Info */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-xl text-base-content tracking-tight">{name}</h3>
              {/* E2EE Indicator */}
              <div className="tooltip tooltip-bottom flex items-center justify-center text-success bg-success/10 p-1 rounded-md" data-tip="End-to-End Encrypted via AES-GCM">
                <Shield size={12} className="stroke-[3]" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {!isGroup && (
                <div className={`size-1.5 rounded-full ${isOnline ? "bg-green-500 animate-pulse" : "bg-base-content/20"}`} />
              )}
              <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em]">
                {statusText}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn btn-ghost btn-md btn-circle text-base-content/40 hover:text-primary hover:bg-primary/10 transition-all">
            <MoreVertical size={20} />
          </button>
          <div className="w-px h-8 bg-base-content/5 mx-1" />
          <button 
            onClick={handleClose}
            className="size-10 rounded-2xl bg-base-content/5 text-base-content/40 hover:bg-error/10 hover:text-error flex items-center justify-center transition-all group"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export default ChatHeader;
