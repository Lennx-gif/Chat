import { MessageSquare, Sparkles } from "lucide-react";
import {motion} from "motion/react";

const NoChat = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/10 backdrop-blur-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="max-w-md text-center space-y-8 relative z-10">
        {/* Icon Display */}
        <div className="flex justify-center">
          <motion.div 
            className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-xl shadow-primary/5 relative group"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <MessageSquare className="w-10 h-10 text-primary" />
            </motion.div>
            
            {/* Sparkle decorative element */}
            <motion.div 
              className="absolute -top-2 -right-2 bg-base-100 p-2 rounded-xl border border-base-content/10 shadow-lg"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
          </motion.div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-3">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold tracking-tight text-base-content"
          >
            Your Space is Ready
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base-content/50 font-medium max-w-[280px] mx-auto leading-relaxed"
          >
            Select a friend from the sidebar to start a futuristic conversation
          </motion.p>
        </div>

        {/* Action hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            <span className="size-2 bg-primary rounded-full animate-pulse" />
            Encrypted Messaging
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NoChat;
