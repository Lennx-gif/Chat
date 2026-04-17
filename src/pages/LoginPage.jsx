import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore";
import { Lock, Eye, EyeOff, User, Mail, MessageSquare, Loader, Palette } from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants/index.js";

const LoginPage = () => {
  const[showPassword,setShowPassword] = useState(false);
  const [formData,setFormData] = useState({
    email:"",
    password:""
  });
  const {login,isLoggingIn} = useAuthStore();
  const {theme, setTheme} = useThemeStore();
  const [showThemePicker, setShowThemePicker] = useState(false);
  const handleSubmit = async(e) => {
    e.preventDefault();
    login(formData);
  }
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
            <div className='absolute top-12 right-0 bg-base-100 border border-base-300 rounded-lg shadow-lg p-3 grid grid-cols-4 gap-2 z-50'>
              {THEMES.map((t) => (
                <button
                  key={t}
                  className={`
                    group flex flex-col items-center gap-1 p-2 rounded-md transition-colors
                    ${theme === t ? "bg-base-300 ring-2 ring-primary" : "hover:bg-base-200"}
                  `}
                  onClick={() => handleThemeChange(t)}
                  title={t}>
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

        <div className='w-full max-w-md space-y-8'>
          <div className='flex flex-col items-center gap-2 group'>
            <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center
            group-hover:bg-primary/20 transition-colors'>
              <MessageSquare className='size-6 text-primary animate-pulse duration-75'/>
            </div>
            <h1 className='text-2xl font-semibold'>Create An Account</h1>
            <p className='text-base-content/60 text-sm'>Get started with your free account.</p>
          </div>

        </div>
        <form onSubmit={handleSubmit} className='space-y-6'>
          
          

          <div className='form-control'>
            <label className='label'>
              <span className='label-text font-medium'>Email</span>
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 bottom-0  pl-0 flex items-center pointer-events-none'>
                <Mail className='size-5 text-base-content/40 ' />
              </div>
              
              <input
                type='text'
                placeholder='Enter your email address'
                className='input input-bordered w-full pl-2 inset-x-6'
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>


          <div className='form-control'>
            <label className='label'>
              <span className='label-text font-medium'>Password</span>
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none'>
                <Lock className='size-5 text-base-content/40' />
              </div>

              <input
              type={showPassword ? "text" : "password"}
              className={'input input-bodered w-full pl-2 inset-x-6'}
              placeholder='Password'
              value={formData.password}
              onChange={(e) => setFormData({...formData,password: e.target.value})}/>
              <button
              type='button'
              className='absolute inset-y-3 right-0 pr-0 flex items-center'
              onClick={() => setShowPassword(!showPassword)}>
                {showPassword ?(
                  <EyeOff className='size-5 text-base-content/40'/>
                ):(
                  <Eye className='size-5 text-base-content/40'/>
                )}
              </button>
            </div>
          </div>

          <button type='submit' className='items-center-safe ml-5  btn btn-primary w-full' disabled={isLoggingIn}>
            {isLoggingIn ?(
              <>
              <Loader className='size-4 animate-spin' />
              Loading...
              </>
              ):(
                "Login"
              )
            }
          </button>
        </form>

        <div className="text-center flex flex-col gap-2 mt-4 ml-6 items-center">
          <p className='text-base-content/60'>
          Don't have  an account?{" "}
          <Link to="/signup" className="link link-primary font-medium flex items-center justify-center">
            Sign up
          </Link>
          
          </p>
        </div>
      </div>


      <AuthImagePattern 
        title='Join the Conversation'
        subtitle='Connect with friends and family'
      />
    </div>
  )
}

export default LoginPage