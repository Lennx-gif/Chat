import { MessageSquare } from "lucide-react";
import {motion} from "motion/react";

// Create a motion-compatible version of the MessageSquare icon
const MotionMessageSquare = motion(MessageSquare);

const NoChat = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/70">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <motion.div 
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center"
              // Animate the container div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            >
             <MotionMessageSquare 
              className="w-8 h-8 text-primary "
              // Animate the icon itself
              animate={{ rotate: [0, -15, 15, -15, 0] }}
              transition={{ duration: 0.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
             />
            </motion.div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">Welcome to Chatty!</h2>
        <p className="text-base-content/60 animate-fade-in">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChat;
