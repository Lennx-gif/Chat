import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader, MessageSquare, Mail, Lock, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import FloatingLabelInput from './FloatingLabelInput';
import { toast } from 'react-hot-toast';

const AuthModal = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const [mode, setMode] = useState(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const { login, signup, isLoggingIn, isSigningUp } = useAuthStore();

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
    onClose();
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!signupData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!signupData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(signupData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!signupData.password) {
      newErrors.password = 'Password is required';
    } else if (signupData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const result = signup(signupData);
    if (result?.success) {
      toast.success('Account created! Redirecting to login...');
      setTimeout(() => {
        setMode('login');
        setSignupData({ fullName: '', email: '', password: '' });
      }, 1500);
    }
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setErrors({});
    setShowPassword(false);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2, ease: 'easeIn' },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: mode === 'login' ? -20 : 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: 0.1 },
    },
    exit: {
      opacity: 0,
      x: mode === 'login' ? 20 : -20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className='fixed inset-0 bg-black/30 backdrop-blur-sm z-40'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: 0.2 }}
          />

          {/* Modal */}
          <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
            onClick={onClose}>
            <motion.div
              className='relative bg-base-100/80 backdrop-blur-xl rounded-2xl shadow-2xl
                border border-base-300/50 w-full max-w-md'
              variants={modalVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
              onClick={(e) => e.stopPropagation()}>

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className='absolute top-4 right-4 z-10 rounded-full p-2
                  hover:bg-base-200 transition-colors'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}>
                <svg className='size-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </motion.button>

              {/* Header */}
              <div className='p-8 text-center border-b border-base-300/50'>
                <motion.div
                  className='size-12 rounded-xl bg-primary/10 flex items-center justify-center
                    mx-auto mb-4'
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400 }}>
                  <MessageSquare className='size-6 text-primary' />
                </motion.div>

                <motion.h2
                  key={mode}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='text-2xl font-bold mb-2'>
                  {mode === 'login' ? 'Welcome Back' : 'Start Your Journey'}
                </motion.h2>

                <motion.p
                  key={`subtitle-${mode}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className='text-base-content/60 text-sm'>
                  {mode === 'login'
                    ? 'Jump back in and reconnect with your conversations'
                    : 'Create your account to start connecting instantly'}
                </motion.p>
              </div>

              {/* Content */}
              <AnimatePresence mode='wait'>
                <motion.div
                  key={mode}
                  variants={contentVariants}
                  initial='hidden'
                  animate='visible'
                  exit='exit'
                  className='p-8'>

                  {mode === 'login' ? (
                    // Login Form
                    <form onSubmit={handleLoginSubmit} className='space-y-5'>
                      <FloatingLabelInput
                        type='email'
                        label='Email Address'
                        placeholder='you@example.com'
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                        error={errors.email}
                        icon={Mail}
                        required
                      />

                      <FloatingLabelInput
                        type='password'
                        label='Password'
                        placeholder='Enter your secure password'
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({ ...loginData, password: e.target.value })
                        }
                        error={errors.password}
                        icon={Lock}
                        showPasswordToggle
                        isPasswordVisible={showPassword}
                        onPasswordToggle={() => setShowPassword(!showPassword)}
                        required
                      />

                      <motion.button
                        type='submit'
                        disabled={isLoggingIn}
                        className='w-full py-3 px-4 bg-gradient-to-r from-primary to-primary/80
                          text-primary-content font-semibold rounded-xl
                          hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                          transition-all flex items-center justify-center gap-2'
                        whileHover={{ scale: isLoggingIn ? 1 : 1.02 }}
                        whileTap={{ scale: isLoggingIn ? 1 : 0.98 }}>
                        {isLoggingIn ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                              <Loader className='size-4' />
                            </motion.div>
                            Signing in...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </motion.button>
                    </form>
                  ) : (
                    // Signup Form
                    <form onSubmit={handleSignupSubmit} className='space-y-5'>
                      <FloatingLabelInput
                        type='text'
                        label='Full Name'
                        placeholder='Jane Smith'
                        value={signupData.fullName}
                        onChange={(e) =>
                          setSignupData({ ...signupData, fullName: e.target.value })
                        }
                        error={errors.fullName}
                        icon={User}
                        required
                      />

                      <FloatingLabelInput
                        type='email'
                        label='Email Address'
                        placeholder='you@example.com'
                        value={signupData.email}
                        onChange={(e) =>
                          setSignupData({ ...signupData, email: e.target.value })
                        }
                        error={errors.email}
                        icon={Mail}
                        required
                      />

                      <FloatingLabelInput
                        type='password'
                        label='Password'
                        placeholder='Create a strong, unique password'
                        value={signupData.password}
                        onChange={(e) =>
                          setSignupData({ ...signupData, password: e.target.value })
                        }
                        error={errors.password}
                        icon={Lock}
                        showPasswordToggle
                        isPasswordVisible={showPassword}
                        onPasswordToggle={() => setShowPassword(!showPassword)}
                        required
                      />

                      <motion.p className='text-xs text-base-content/50 pl-4'>
                        ✓ Minimum 6 characters for your account security
                      </motion.p>

                      <motion.button
                        type='submit'
                        disabled={isSigningUp}
                        className='w-full py-3 px-4 bg-gradient-to-r from-primary to-primary/80
                          text-primary-content font-semibold rounded-xl
                          hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                          transition-all flex items-center justify-center gap-2'
                        whileHover={{ scale: isSigningUp ? 1 : 1.02 }}
                        whileTap={{ scale: isSigningUp ? 1 : 0.98 }}>
                        {isSigningUp ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                              <Loader className='size-4' />
                            </motion.div>
                            Creating account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </motion.button>
                    </form>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Footer with Mode Switch */}
              <div className='px-8 py-6 border-t border-base-300/50 bg-base-100/40'>
                <p className='text-center text-sm text-base-content/60 mb-4'>
                  {mode === 'login'
                    ? "Don't have an account yet? Create one now"
                    : 'Already a member? Sign in to your account'}
                </p>

                <motion.button
                  onClick={() =>
                    handleModeSwitch(mode === 'login' ? 'signup' : 'login')
                  }
                  className='w-full py-2.5 px-4 rounded-lg border-2 border-primary/30
                    hover:border-primary hover:bg-primary/5 font-semibold
                    text-primary transition-all'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}>
                  {mode === 'login' ? 'Create an Account' : 'Sign In Instead'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
