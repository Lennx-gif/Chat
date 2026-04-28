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
      className="p-4 border-b border-base-content/10 bg-base-100/30 backdrop-blur-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="size-11 rounded-2xl overflow-hidden border-2 border-primary/20">
              <img 
                src={selectedUser.profilePicture || "/avatar.png"} 
                alt={selectedUser.fullName} 
                className="w-full h-full object-cover"
              />
            </div>
            {onlineUsers.includes(selectedUser._id) && (
              <span className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
            )}
          </div>

          {/* User info */}
          <div>
            <h3 className="font-bold text-base-content tracking-tight">{selectedUser.fullName}</h3>
            <p className="text-xs font-semibold text-primary/80 uppercase tracking-widest">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Away"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-primary transition-colors">
            <Phone size={18} />
          </button>
          <button className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-primary transition-colors">
            <Video size={18} />
          </button>
          <div className="w-px h-6 bg-base-content/10 mx-1" />
          <button 
            onClick={() => setSelectedUser(null)}
            className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-error transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export default ChatHeader;
