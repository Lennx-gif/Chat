import { useState } from 'react';
import { EyeOff, Link,  Loader, Mail, MailIcon, MessageSquare, User, Palette } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';
import { Lock } from 'lucide-react';
import { Eye } from 'lucide-react';
import AuthImagePattern from  '../components/AuthImagePattern.jsx';
import { useThemeStore } from '../store/useThemeStore';
import { THEMES } from '../constants/index.js';
import { toast } from 'react-hot-toast';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData,setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const {signup, isSigningUp} = useAuthStore();
  const {theme, setTheme} = useThemeStore();
  const [showThemePicker, setShowThemePicker] = useState(false);

  const validateForm = ()=>{
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Email is invalid");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm()
    if (success ===true){
      const result = signup(formData);
      if (result?.success){
        toast.success("Signup successful! You can now log in.");
      }
      
    };
    
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
              <MessageSquare className='size-6 text-primary'/>
            </div>
            <h1 className='text-2xl font-semibold'>Create An Account</h1>
            <p className='text-base-content/60 text-sm'>Get started with your free account.</p>
          </div>

        </div>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='form-control'>
            <label className='label '>
              <span className='label-text font-medium text-fuchsia-950'>Full Name</span>
            </label>
            <div className='relative'>
              <div className='relative inset-y-6 mr-0'>
                <User className='size-5 text-base-black-content/40' />
              </div>
            </div>
            <input
              type='text'
              placeholder='Enter your full name'
              className='input input-bordered w-full pl-2 inset-x-6 '
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>
          

          <div className='form-control'>
            <label className='label'>
              <span className='label-text font-medium text-fuchsia-950'>Email</span>
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 bottom-0  pl-0 flex items-center pointer-events-none'>
                <Mail className='size-5 text-base-black-content/40' />
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
              <span className='label-text font-medium text-fuchsia-950'>Password</span>
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none'>
                <Lock className='size-5 text-base-black-content/40' />
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

          <button type='submit' className='ml-5 btn btn-primary w-full' disabled={isSigningUp}>
            {isSigningUp ?(
              <>
              <Loader className='size-4 animate-spin' />
              Loading...
              </>
              ):(
                "Create Account"
              )
            }
          </button>
        </form>

        <div className="text-center flex flex-col gap-2 ml-8.5 mt-4 items-center">
          <p className='text-base-black-content/60'>
          Already have an account?{" "}
          </p>
          <a href="/login" className='text-primary hover:underline'>Log in</a>
          
        </div>
      </div>


      <AuthImagePattern 
        title='Join the Conversation'
        subtitle='Connect with friends and family'
      />
    </div>
  )
}

export default SignUpPage