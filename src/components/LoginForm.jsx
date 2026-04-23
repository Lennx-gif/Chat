import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader, MessageSquare, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import FloatingLabelInput from './FloatingLabelInput';
import { Link } from 'react-router-dom';

const FOOTER_TEXTS = [
  "New to Chat? Create an account now",
  "Ready to join the community? Sign up here",
  "Start your journey with us today",
  "Connect with friends in seconds"
];

const LoginForm = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [footerText, setFooterText] = useState("");

  const { login, isLoggingIn } = useAuthStore();

  useEffect(() => {
    const randomText = FOOTER_TEXTS[Math.floor(Math.random() * FOOTER_TEXTS.length)];
    setFooterText(randomText);
  }, []);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!loginData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await login(loginData);
  };

  return (
    <motion.div
      layoutId="auth-card"
      className='w-full max-w-lg p-8 sm:p-12 bg-base-100/40 backdrop-blur-xl rounded-[2.5rem] border border-base-content/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden my-auto'
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}>
      
      {/* Header */}
      <div className='mb-10 flex flex-col items-center text-center'>
        <motion.div 
          className='size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 shadow-sm'
          animate={{
            rotate: [0, -10, 10, -10, 10, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 3
          }}>
          <MessageSquare className='size-7 text-primary' />
        </motion.div>

        <h2 className='text-3xl font-bold mb-3 text-base-content tracking-tight'>
          Welcome Back
        </h2>

        <p className='text-base-content/60 text-sm font-medium leading-relaxed max-w-xs'>
          Sign in to continue your conversations and stay connected with your community
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLoginSubmit} className='space-y-4'>
        <FloatingLabelInput
          type='email'
          label='Email Address'
          placeholder='willokLikk@gmail.com'
          value={loginData.email}
          onChange={(e) =>
            setLoginData({ ...loginData, email: e.target.value })
          }
          error={errors.email}
          icon={Mail}
          variant="glass"
          required
        />

        <FloatingLabelInput
          type='password'
          label='Password'
          placeholder='••••••••••••••••'
          value={loginData.password}
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
          error={errors.password}
          icon={Lock}
          showPasswordToggle
          isPasswordVisible={showPassword}
          onPasswordToggle={() => setShowPassword(!showPassword)}
          variant="glass"
          required
        />

        <button
          type='submit'
          disabled={isLoggingIn}
          className='w-full py-4 bg-primary text-primary-content font-bold rounded-xl
            hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
            transition-all shadow-lg shadow-primary/20 mt-4 active:scale-[0.98]'>
          {isLoggingIn ? (
            <div className='flex items-center justify-center gap-2'>
              <Loader className='size-5 animate-spin' />
              <span>Signing in...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Footer */}
      <div className='mt-10 pt-8 border-t border-base-content/5'>
        <p className='text-center text-xs text-base-content/50 mb-4 font-medium'>
          {footerText}
        </p>

        <Link to='/signup' className='block'>
          <button
            className='w-full py-3 rounded-xl border border-primary/30 bg-primary/5
              hover:bg-primary/10 font-bold text-primary transition-all'>
            Create Account
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default LoginForm;
