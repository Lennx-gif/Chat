import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader, MessageSquare, Mail, Lock, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import FloatingLabelInput from './FloatingLabelInput';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Button } from './ui/Button';

const FOOTER_TEXTS = [
  "Already have an account? Sign in here",
  "Welcome back! Sign in to continue",
  "Been here before? Sign in to your account",
  "Rejoin the conversation by signing in"
];

const SignupForm = () => {
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [footerText, setFooterText] = useState("");
  const [strength, setStrength] = useState(0);

  const { signup, isSigningUp } = useAuthStore();

  useEffect(() => {
    const randomText = FOOTER_TEXTS[Math.floor(Math.random() * FOOTER_TEXTS.length)];
    setFooterText(randomText);
  }, []);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const calculateStrength = (pass) => {
    let s = 0;
    if (pass.length >= 6) s++;
    if (/[A-Z]/.test(pass)) s++;
    if (/[0-9]/.test(pass)) s++;
    if (/[^A-Za-z0-9]/.test(pass)) s++;
    return s;
  };

  const getStrengthColor = () => {
    if (strength === 0) return 'bg-base-content/10';
    if (strength === 1) return 'bg-error';
    if (strength === 2) return 'bg-warning';
    if (strength >= 3) return 'bg-success';
    return 'bg-base-content/10';
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setSignupData({ ...signupData, password: val });
    setStrength(calculateStrength(val));
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
    const result = await signup(signupData);
    if (result?.success) {
      toast.success('Account created! Redirecting to login...');
      setSignupData({ fullName: '', email: '', password: '' });
    }
  };

  return (
    <motion.div
      layoutId="auth-card"
      className='w-full max-w-lg p-8 sm:p-12 bg-base-100/40 backdrop-blur-xl rounded-[3rem] border border-base-content/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden my-auto'
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
          Create Account
        </h2>

        <p className='text-base-content/60 text-sm font-medium leading-relaxed max-w-xs'>
          Join our community and start connecting with people who matter to you
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSignupSubmit} className='space-y-4'>
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
          variant="glass"
          required
        />

        <FloatingLabelInput
          type='email'
          label='Email Address'
          placeholder='willokLikk@gmail.com'
          value={signupData.email}
          onChange={(e) =>
            setSignupData({ ...signupData, email: e.target.value })
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
          value={signupData.password}
          onChange={handlePasswordChange}
          error={errors.password}
          icon={Lock}
          showPasswordToggle
          isPasswordVisible={showPassword}
          onPasswordToggle={() => setShowPassword(!showPassword)}
          variant="glass"
          required
        />

        {/* Strength Meter */}
        <div className='px-1 space-y-2'>
          <div className='flex gap-1 h-1'>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className={`h-full flex-1 rounded-full transition-colors duration-500 ${
                  i < strength ? getStrengthColor() : 'bg-base-content/10'
                }`}
              />
            ))}
          </div>
          <p className='text-[10px] text-base-content/40 font-bold uppercase tracking-wider flex justify-between'>
            <span>Security Strength</span>
            <span className={strength >= 3 ? 'text-success' : ''}>
              {strength === 0 && 'Too Short'}
              {strength === 1 && 'Weak'}
              {strength === 2 && 'Medium'}
              {strength >= 3 && 'Strong'}
            </span>
          </p>
        </div>

        <Button
          type='submit'
          disabled={isSigningUp}
          className='w-full mt-4'>
          {isSigningUp ? (
            <div className='flex items-center justify-center gap-2'>
              <Loader className='size-5 animate-spin' />
              <span>Creating account...</span>
            </div>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className='mt-10 pt-8 border-t border-base-content/5'>
        <p className='text-center text-xs text-base-content/50 mb-4 font-medium'>
          {footerText}
        </p>

        <Link to='/login' className='block'>
          <Button
            variant="outline"
            className='w-full'>
            Sign In
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default SignupForm;
