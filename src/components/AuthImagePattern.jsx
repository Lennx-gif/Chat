import { motion } from 'motion/react';

const AuthImagePattern = ({ title, subtitle }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className='hidden lg:flex items-center justify-center bg-gradient-to-br from-base-200 via-base-200 to-base-300 p-12 relative overflow-hidden'>
      {/* Animated background elements */}
      <div className='absolute inset-0 opacity-20'>
        <motion.div
          className='absolute top-10 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply blur-3xl'
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className='absolute bottom-10 right-10 w-72 h-72 bg-secondary rounded-full mix-blend-multiply blur-3xl'
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      <motion.div
        className='max-w-md text-center relative z-10'
        variants={containerVariants}
        initial='hidden'
        animate='visible'>
        {/* Grid Pattern with Animation */}
        <motion.div
          className='grid grid-cols-3 gap-3 mb-8'
          variants={containerVariants}>
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              className='aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm border border-primary/20 overflow-hidden'
              variants={itemVariants}
              whileHover={{
                scale: 1.1,
                boxShadow: '0 8px 16px rgba(var(--color-primary), 0.2)',
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 10,
              }}>
              {/* Shimmer effect */}
              <motion.div
                className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent'
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Title */}
        <motion.h2
          className='text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60'
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}>
          {title}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className='text-base-content/60 leading-relaxed'
          variants={itemVariants}>
          {subtitle}
        </motion.p>

        {/* Decorative dots */}
        <motion.div className='flex justify-center gap-2 mt-8'>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className='w-2 h-2 rounded-full bg-primary'
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthImagePattern;

