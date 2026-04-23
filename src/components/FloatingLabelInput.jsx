import { useState } from 'react';
import { motion } from 'motion/react';

const FloatingLabelInput = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  showPasswordToggle,
  isPasswordVisible,
  onPasswordToggle,
  variant = 'light',
  required = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const isGlass = variant === 'glass';

  return (
    <div className='relative w-full mb-4'>
      <div
        className={`relative flex items-center transition-all duration-200 border rounded-xl overflow-hidden
          ${
            error
              ? 'border-error bg-error/5'
              : isFocused
              ? 'border-primary ring-1 ring-primary/20 ' + (isGlass ? 'bg-base-100/60' : 'bg-base-100')
              : isGlass
              ? 'border-base-content/10 bg-base-content/5'
              : 'border-base-300 bg-base-100/50'
          }`}>
        
        {/* Label and Input Container */}
        <div className='flex-1 relative'>
          {/* Label */}
          <label
            className={`absolute left-12 top-2 transition-all pointer-events-none font-medium text-[10px] uppercase tracking-wider
              ${error ? 'text-error' : isFocused ? 'text-primary' : 'text-base-content/40'}`}>
            {label}
            {required && <span className='text-error ml-0.5'>*</span>}
          </label>

          {/* Icon */}
          {Icon && (
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors
              ${isFocused ? 'text-primary' : 'text-base-content/30'}`}>
              <Icon className='size-5' />
            </div>
          )}

          {/* Input Field */}
          <input
            type={showPasswordToggle && isPasswordVisible ? 'text' : type}
            placeholder={isFocused ? placeholder : ''}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full px-4 pt-6 pb-2 pl-12 bg-transparent outline-none text-sm font-medium transition-colors text-base-content
              placeholder:text-base-content/20`}
          />
        </div>

        {/* Password Toggle Button */}
        {showPasswordToggle && (
          <button
            type='button'
            onClick={onPasswordToggle}
            className={`px-4 transition-colors text-base-content/30 hover:text-base-content/60`}>
            {isPasswordVisible ? (
              <svg className='size-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
                <circle cx='12' cy='12' r='3' />
              </svg>
            ) : (
              <svg className='size-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' />
                <line x1='1' y1='1' x2='23' y2='23' />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-error text-[10px] mt-1 pl-4 font-medium'>
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default FloatingLabelInput;
