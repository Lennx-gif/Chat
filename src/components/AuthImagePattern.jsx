import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Users, Video, Phone, Heart, Smile, Send, Share, Hash, AtSign, Bell, Bookmark } from 'lucide-react';

const ICONS = [MessageSquare, Users, Video, Phone, Heart, Smile, Send, Share, Hash, AtSign, Bell, Bookmark];

const AuthImagePattern = ({ title, subtitle }) => {
  const [content, setContent] = useState([]);
  const [isFlowing, setIsFlowing] = useState(false);

  const generateContent = useCallback(() => {
    return [...Array(9)].map((_, i) => ({
      id: Math.random(),
      type: i % 3 === 0 ? 'image' : 'icon',
      Icon: ICONS[Math.floor(Math.random() * ICONS.length)],
      src: '/user.png'
    }));
  }, []);

  useEffect(() => {
    setContent(generateContent());

    const flowInterval = setInterval(() => {
      setIsFlowing(true);
      // Wait for the "forward" part of the flow to swap content
      setTimeout(() => {
        setContent(generateContent());
        setIsFlowing(false);
      }, 1500);
    }, 6000);

    return () => clearInterval(flowInterval);
  }, [generateContent]);

  return (
    <div className='hidden lg:flex items-center justify-center bg-base-200/50 p-12 relative overflow-hidden'>
      {/* Background Blobs */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px]' />
        <div className='absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[100px]' />
      </div>

      <div className='max-w-md text-center relative z-10 flex flex-col items-center'>
        {/* Plain Matrix Grid with Fluid Flow */}
        <div className='grid grid-cols-3 gap-6 mb-16'>
          <AnimatePresence mode='popLayout'>
            {content.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: isFlowing ? 1.1 : 1,
                  z: isFlowing ? 50 : 0,
                  y: 0
                }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 200, 
                  damping: 25,
                  delay: i * 0.05,
                  duration: 0.8
                }}
                className='relative size-24 rounded-3xl bg-base-100 border border-base-300 shadow-xl flex items-center justify-center overflow-hidden z-10'
                whileHover={{
                  scale: 1.2,
                  zIndex: 50,
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                }}>
                
                {/* Reflective Overlay */}
                <motion.div 
                  className='absolute inset-0 bg-gradient-to-tr from-transparent via-base-content/10 to-transparent -translate-x-full z-20'
                  animate={{ x: ['150%', '-150%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
                />

                <div className='relative z-10'>
                  {item.type === 'image' ? (
                    <div className='size-full p-2'>
                      <img src={item.src} alt="User" className="size-full object-cover rounded-2xl bg-base-200" />
                    </div>
                  ) : (
                    <div className='p-4 rounded-2xl bg-base-200'>
                      <item.Icon className='size-8 text-primary' />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.h2 className='text-3xl font-bold mb-4 text-base-content'>{title}</motion.h2>
        <motion.p className='text-base-content/60 text-sm font-medium leading-relaxed mb-10'>{subtitle}</motion.p>

        <div className='flex justify-center gap-2'>
          {[0, 1, 2].map((i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-primary' : 'bg-primary/20'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;
