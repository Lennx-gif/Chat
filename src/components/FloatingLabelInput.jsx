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
  required = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const isFieldActive = isFocused || value;

  return (
    <div className='relative w-full'>
      <motion.div
        className='relative'
        animate={{
          y: isFocused || value ? -28 : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}>
        
        {/* Label */}
        <motion.label
          className={`absolute left-4 transition-all pointer-events-none font-medium ${
            isFieldActive
              ? 'text-sm text-primary scale-90 origin-left'
              : 'text-base text-base-content/60'
          }`}
          animate={{
            y: isFieldActive ? -32 : 0,
            scale: isFieldActive ? 0.9 : 1,
          }}
          transition={{ duration: 0.2 }}>
          {label}
          {required && <span className='text-error ml-1'>*</span>}
        </motion.label>

        {/* Input Container */}
        <div
          className='relative flex items-center'
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}>
          
          {/* Icon */}
          {Icon && (
            <motion.div
              className={`absolute left-4 pointer-events-none transition-colors ${
                isFieldActive ? 'text-primary' : 'text-base-content/40'
              }`}
              animate={{
                scale: isFieldActive ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}>
              <Icon className='size-5' />
            </motion.div>
          )}

          {/* Input Field */}
          <motion.input
            type={showPasswordToggle && isPasswordVisible ? 'text' : type}
            placeholder={isFieldActive ? placeholder : ''}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full px-4 py-3 pl-12 bg-base-100/50 backdrop-blur-sm rounded-xl
              border-2 transition-all outline-none
              ${
                error
                  ? 'border-error/50 focus:border-error'
                  : isFieldActive
                  ? 'border-primary/60'
                  : 'border-base-300'
              }
              focus:ring-2 focus:ring-primary/20
              placeholder:text-base-content/40
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          />

          {/* Password Toggle Button */}
          {showPasswordToggle && (
            <motion.button
              type='button'
              onClick={onPasswordToggle}
              className='absolute right-4 text-base-content/50 hover:text-base-content/80 transition-colors'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}>
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
            </motion.button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-error text-xs mt-1 pl-4 flex items-center gap-1'>
            <span>⚠</span> {error}
          </motion.p>
        )}
      </motion.div>

      {/* Bottom Border Animation */}
      <motion.div
        className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary to-primary/0'
        style={{ originX: 0 }}
        animate={{
          scaleX: isFieldActive ? 1 : 0,
          opacity: isFieldActive ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default FloatingLabelInput;
