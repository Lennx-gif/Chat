import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { motion } from "motion/react";

const Navbar = () => {
  const {logout,authUser} = useAuthStore();
  return <header
  className="fixed w-full top-0 z-40"
  >
    <div className="w-full px-6 py-4">
      <div className="bg-gradient-to-r from-base-100/40 via-base-100/60 to-base-100/40 backdrop-blur-xl border border-base-content/10 rounded-2xl h-16 px-6 flex items-center justify-between shadow-xl shadow-black/5 relative overflow-hidden group">
        {/* Subtle animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
        
        <div className="flex items-center gap-8 relative z-10">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all group/logo">
            <motion.div 
              className="size-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20"
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            >
              <MessageSquare className="w-5 h-5 text-primary-content" />
            </motion.div>
            <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-base-content to-base-content/60 bg-clip-text text-transparent">ALPIN<span className="text-primary">E</span></h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <Link
            to={"/settings"}
            className={'btn btn-sm btn-ghost gap-2 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/10 transition-all'}>
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className={"btn btn-sm btn-ghost gap-2 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/10 transition-all"}>
                  <User className="size-4"/>
                  <span className="hidden sm:inline">Profile</span>  
                </Link>
                <div className="w-px h-6 bg-base-content/10 mx-1" />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-error/10 to-error/20 text-error hover:from-error/20 hover:to-error/30 px-4 py-2 rounded-xl transition-all font-bold text-xs uppercase tracking-widest flex items-center gap-2 border border-error/20" 
                  onClick={logout}
                >
                  <LogOut className="size-4"/>
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              </>
            )}
        </div>
 
      </div>
    </div>
  </header>
}
export default Navbar