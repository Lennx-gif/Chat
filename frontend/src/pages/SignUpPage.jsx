import { useState } from 'react';

const SignUpPage = () => {
  // This is a placeholder component for the SignUp page
  // You can add your sign-up form and logic here
  const [showPassword, setShowPassword] = useState(false);
  const [formData,setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const(signup,isSigningUp) = useAuthStore((state) => [state.signup, state.isSigningUp]);

  const validateForm = () => {};
  const handleSubmit = (e) => {
    e.preventDefault();
  };


  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      // Left side: Image or illustration
      <div className='flex flex-col justify-center items-center p-6 bg-gray-100 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>

        </div>

      </div>
    </div>
  )
}

export default SignUpPage