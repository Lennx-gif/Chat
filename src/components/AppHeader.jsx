import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { LogOut, Settings, User, Palette } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants/index.js";
import { useState } from "react";

const AppHeader = () => {
  const {logout,authUser} = useAuthStore();
  const {theme, setTheme} = useThemeStore();
  const [showThemePicker, setShowThemePicker] = useState(false);

  const handleThemeChange = (newTheme) => {
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    transition.ready.then(() => {
      transition.finished.finally(() => {
        setShowThemePicker(false);
      });
    });
  };

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all group">
            {/* CAN Logo Design */}
            <div className="relative h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
              <span className="text-lg font-black text-primary-content relative z-10">
                CAN
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                CAN
              </h1>
              <p className="text-xs text-base-content/50 -mt-1 font-medium">Chat & Connect</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowThemePicker(!showThemePicker)}
                className="btn btn-ghost btn-sm gap-2"
                title="Change theme"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Theme</span>
              </button>

              {showThemePicker && (
                <div className="absolute top-12 right-0 bg-base-100 border border-base-300 rounded-lg shadow-xl p-3 grid grid-cols-4 gap-2 z-50">
                  {THEMES.map((t) => (
                    <button
                      key={t}
                      className={`
                        group flex flex-col items-center gap-1 p-2 rounded-md transition-colors
                        ${theme === t ? "bg-base-300 ring-2 ring-primary" : "hover:bg-base-200"}
                      `}
                      onClick={() => handleThemeChange(t)}
                      title={t}
                    >
                      <div className="relative h-6 w-6 rounded-sm overflow-hidden" data-theme={t}>
                        <div className="absolute inset-0 grid grid-cols-2 gap-px p-0.5">
                          <div className="rounded-sm bg-primary"></div>
                          <div className="rounded-sm bg-secondary"></div>
                          <div className="rounded-sm bg-accent"></div>
                          <div className="rounded-sm bg-neutral"></div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              to={"/settings"}
              className="btn btn-sm gap-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button 
                  className="btn btn-sm gap-2 transition-colors" 
                  onClick={logout}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
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
