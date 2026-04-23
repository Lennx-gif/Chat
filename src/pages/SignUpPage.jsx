import { useEffect } from 'react';
import AuthImagePattern from '../components/AuthImagePattern.jsx';
import SignupForm from '../components/SignupForm';
import { useAuthStore } from '../store/useAuthStore.js';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      navigate('/');
    }
  }, [authUser, navigate]);

  return (
    <div className='min-h-screen grid lg:grid-cols-2 bg-base-100'>
      <div className='relative flex flex-col justify-center items-center p-6 sm:p-12 bg-base-200/20 pt-24 sm:pt-32 w-full'>
        {/* Background decorative elements */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]' />
          <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]' />
        </div>

        <div className='relative z-10 w-full flex justify-center'>
          <SignupForm />
        </div>
      </div>

      <div className='hidden lg:block relative'>
        <AuthImagePattern 
          title='Connect Instantly'
          subtitle='Real-time messaging with people who inspire you'
        />
      </div>
    </div>
  );
}

export default SignUpPage;
