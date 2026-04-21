import { useState, useEffect } from "react";
import { Palette } from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern";
import AuthModal from "../components/AuthModal";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants/index.js";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [showThemePicker, setShowThemePicker] = useState(false);
  const { theme, setTheme } = useThemeStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

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
    <div className='min-h-screen grid lg:grid-cols-2'>
      <div className='flex flex-col justify-center items-center p-6 bg-base-100 sm:p-12 relative'>
        {/* Theme Picker Button */}
        <div className='absolute top-4 right-4'>
          <button
            onClick={() => setShowThemePicker(!showThemePicker)}
            className='btn btn-ghost btn-sm gap-2'
            title='Change theme'>
            <Palette className='size-5' />
          </button>

          {/* Theme Dropdown */}
          {showThemePicker && (
            <div className='absolute top-12 right-0 bg-base-100 border border-base-300 rounded-lg shadow-2xl p-4 grid grid-cols-6 md:grid-cols-8 gap-3 z-50 w-auto max-h-96 overflow-y-auto'>
              {THEMES.map((t) => (
                <button
                  key={t}
                  className={`
                    group flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all
                    ${theme === t ? "bg-base-300 ring-2 ring-primary scale-110" : "hover:bg-base-200 hover:scale-105"}
                  `}
                  onClick={() => handleThemeChange(t)}
                  title={t}>
                  <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                    <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                      <div className="rounded-bg-primary"></div>
                      <div className="rounded-bg-secondary"></div>
                      <div className="rounded-bg-accent"></div>
                      <div className="rounded-bg-neutral"></div>
                    </div>
                  </div>
                  <span className="text-xs font-medium truncate w-full text-center">
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Centered Content */}
        <div className='w-full flex items-center justify-center min-h-screen'>
          <AuthModal isOpen={true} defaultMode="login" onClose={() => {}} />
        </div>
      </div>

      <AuthImagePattern 
        title='Join the Conversation'
        subtitle='Unlock meaningful connections with friends and loved ones'
      />
    </div>
  );
}

export default LoginPage;
