import { X, Phone, Video, MoreVertical } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { motion } from "motion/react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 border-b border-base-content/5 bg-base-100/10 backdrop-blur-xl relative z-20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="relative group">
            <div className="size-14 rounded-[1.5rem] overflow-hidden border-2 border-primary/20 group-hover:border-primary/40 transition-colors shadow-lg">
              <img 
                src={selectedUser.profilePicture || "/avatar.png"} 
                alt={selectedUser.fullName} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            {onlineUsers.includes(selectedUser._id) && (
              <span className="absolute -bottom-1 -right-1 size-4 bg-green-500 rounded-full ring-4 ring-base-100 shadow-sm" />
            )}
          </div>

          {/* User info */}
          <div>
            <h3 className="font-black text-xl text-base-content tracking-tight">{selectedUser.fullName}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <div className={`size-1.5 rounded-full ${onlineUsers.includes(selectedUser._id) ? "bg-green-500 animate-pulse" : "bg-base-content/20"}`} />
              <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em]">
                {onlineUsers.includes(selectedUser._id) ? "Connected" : "Disconnected"}
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
            onClick={() => setSelectedUser(null)}
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
