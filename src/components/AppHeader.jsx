import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { LogOut, Settings, User } from "lucide-react";

const AppHeader = () => {
  const {logout,authUser} = useAuthStore();

  return (
    <header
      className="bg-base-100/20 border-b border-base-content/5 fixed w-full top-0 z-40 backdrop-blur-xl h-12 flex items-center shadow-lg shadow-black/5"
    >
      <div className="container mx-auto px-4 w-full">
        <div className="flex items-center justify-between h-full w-full">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-all group">
            {/* CAN Logo Design - matching the image */}
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-[11px] font-black text-primary-content">CAN</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-black text-base-content leading-none">
                CAN
              </h1>
              <p className="text-[8px] text-base-content/40 font-bold uppercase tracking-widest mt-0.5">Chat & Connect</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className="btn btn-ghost btn-xs gap-1.5 text-base-content/60 hover:text-primary hover:bg-primary/5 rounded-lg transition-all h-8 px-2"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-bold text-[10px] uppercase tracking-wider">Settings</span>
            </Link>

            {authUser && (
              <div className="flex items-center gap-3 relative pl-2 border-l border-base-content/5">
                {/* Cyberpunk circuit line SVG */}
                <svg className="absolute right-9 top-1/2 -translate-y-1/2 h-8 w-64 pointer-events-none hidden sm:block overflow-visible" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="cyber-grad" x1="1" y1="0.5" x2="0" y2="0.5">
                      <stop offset="0%" stopColor="#9333ea" stopOpacity="0.8" />
                      <stop offset="40%" stopColor="#06b6d4" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="cyber-grad-2" x1="1" y1="0.5" x2="0" y2="0.5">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                      <stop offset="60%" stopColor="#9333ea" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M 256,12 L 200,12 L 180,4 L 100,4 L 80,12 L 0,12" 
                    fill="none" 
                    stroke="url(#cyber-grad)" 
                    strokeWidth="1.2"
                    strokeDasharray="4 2 1 2"
                  />
                  <path 
                    d="M 256,20 L 220,20 L 210,24 L 130,24 L 120,20 L 40,20" 
                    fill="none" 
                    stroke="url(#cyber-grad-2)" 
                    strokeWidth="0.8"
                  />
                  <circle cx="200" cy="12" r="2" fill="#06b6d4" />
                  <circle cx="180" cy="4" r="1.5" fill="#9333ea" />
                  <circle cx="100" cy="4" r="1.5" fill="#9333ea" />
                  <circle cx="80" cy="12" r="2" fill="#06b6d4" />
                </svg>

                <button 
                  className="btn btn-ghost btn-xs gap-1.5 text-base-content/50 hover:text-error hover:bg-error/5 rounded-lg transition-all h-8 px-2" 
                  onClick={logout}
                  title="Logout"
                >
                  <LogOut className="size-3.5" />
                </button>

                {/* Profile Picture Link */}
                <Link to="/profile" className="relative group flex-shrink-0">
                  {/* Outer border (cyan neon glow) */}
                  <div className="size-9 rounded-full border border-cyan-500/40 p-[1.5px] group-hover:border-cyan-400 transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.15)] group-hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] flex items-center justify-center">
                    {/* Inner border (purple/primary glow) */}
                    <div className="size-[30px] rounded-full border border-purple-500/50 p-[1px] group-hover:border-purple-400 transition-all duration-300 flex items-center justify-center overflow-hidden">
                      <img 
                        src={authUser.profilePicture || "/avatar.png"} 
                        alt="profile" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
