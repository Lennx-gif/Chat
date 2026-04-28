import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { motion } from "motion/react";

const Navbar = () => {
  const {logout,authUser} = useAuthStore();
  return <header
  className="fixed w-full top-0 z-40 transition-all duration-300"
  >
    <div className="container mx-auto px-4 mt-4">
      <div className="bg-base-100/40 backdrop-blur-xl border border-base-content/10 rounded-2xl h-16 px-4 flex items-center justify-between shadow-lg shadow-black/5">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all group">
            <motion.div 
              className="size-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            >
              <MessageSquare className="w-5 h-5 text-primary" />
            </motion.div>
            <h1 className="text-lg font-bold tracking-tight">AlpinE</h1>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={"/settings"}
            className={'btn btn-sm btn-ghost gap-2 rounded-xl'}>
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className={"btn btn-sm btn-ghost gap-2 rounded-xl"}>
                  <User className="size-5"/>
                  <span className="hidden sm:inline">Profile</span>  
                </Link>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex gap-2 items-center bg-error/10 text-error hover:bg-error/20 px-3 py-1.5 rounded-xl transition-all font-medium text-sm" 
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