import { useEffect } from "react";
import AuthImagePattern from "../components/AuthImagePattern";
import LoginForm from "../components/LoginForm";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      navigate("/");
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
          <LoginForm />
        </div>
      </div>

      <div className='hidden lg:block relative'>
        <AuthImagePattern 
          title='Secure & Private'
          subtitle='Your conversations, your rules. Connect safely with end-to-end protection'
        />
      </div>
    </div>
  );
}

export default LoginPage;
