import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { LogOut, Settings, User } from "lucide-react";

const AppHeader = () => {
  const {logout,authUser} = useAuthStore();

  return (
    <header
      className="bg-base-100/40 border-b border-base-content/5 fixed w-full top-0 z-40 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all group">
            {/* CAN Logo Design - matching the image */}
            <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-sm font-black text-primary-content">CAN</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-base-content leading-none">
                CAN
              </h1>
              <p className="text-[10px] text-base-content/40 font-bold uppercase tracking-widest">Chat & Connect</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className="btn btn-ghost btn-sm gap-2 text-base-content/60 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline font-bold text-xs uppercase tracking-wider">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-ghost btn-sm gap-2 text-base-content/60 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                  <User className="size-4" />
                  <span className="hidden sm:inline font-bold text-xs uppercase tracking-wider">Profile</span>
                </Link>
                <button 
                  className="btn btn-ghost btn-sm gap-2 text-base-content/60 hover:text-error hover:bg-error/5 rounded-xl transition-all" 
                  onClick={logout}
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline font-bold text-xs uppercase tracking-wider">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
