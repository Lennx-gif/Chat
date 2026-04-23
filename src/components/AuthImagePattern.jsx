import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { MessageSquare, Users, Video, Phone, Heart, Smile, Send, Share, Hash, AtSign, Bell, Bookmark } from 'lucide-react';

const ICONS = [MessageSquare, Users, Video, Phone, Heart, Smile, Send, Share, Hash, AtSign, Bell, Bookmark];

const AuthImagePattern = ({ title, subtitle }) => {
  const [content, setContent] = useState([]);
  const [isFlowing, setIsFlowing] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const containerRef = useRef(null);

  // Parallax values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for parallax
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), { stiffness: 100, damping: 30 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const generateContent = useCallback(() => {
    return [...Array(9)].map((_, i) => ({
      id: Math.random(),
      type: i % 3 === 0 ? 'image' : 'icon',
      Icon: ICONS[Math.floor(Math.random() * ICONS.length)],
      src: `/user.png?v=${Math.random()}`
    }));
  }, []);

  useEffect(() => {
    setContent(generateContent());

    const flowInterval = setInterval(() => {
      setIsFlowing(true);
      setTimeout(() => {
        setContent(generateContent());
        setIsFlowing(false);
        setLoadingStates({}); // Reset loading states on shuffle
      }, 1500);
    }, 6000);

    return () => clearInterval(flowInterval);
  }, [generateContent]);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className='size-full flex items-center justify-center bg-base-200/50 p-12 relative overflow-hidden perspective-1000'>
      
      {/* Decorative Technical/Sketch Lines */}
      <div className='absolute inset-0 pointer-events-none opacity-20'>
        <div className='absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-base-content to-transparent' />
        <div className='absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-base-content to-transparent' />
        <div className='absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-base-content to-transparent' />
        <div className='absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-base-content to-transparent' />
        
        {/* Diagonal sketch lines */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-px bg-base-content/10 rotate-45' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-px bg-base-content/10 -rotate-45' />
      </div>

      {/* Dynamic background blobs */}
...
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <motion.div 
          className='absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px]'
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className='absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[100px]'
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className='max-w-md text-center relative z-10 flex flex-col items-center'
      >
        {/* Matrix Grid */}
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
                  y: 0,
                  translateZ: isFlowing ? 50 : 0
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
                  translateZ: 100,
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                }}>
                
                {/* Reflective Overlay */}
                <motion.div 
                  className='absolute inset-0 bg-gradient-to-tr from-transparent via-base-content/10 to-transparent -translate-x-full z-20'
                  animate={{ x: ['150%', '-150%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
                />

                <div className='relative z-10 w-full h-full'>
                  {item.type === 'image' ? (
                    <div className='size-full p-2 relative'>
                      {!loadingStates[item.id] && (
                        <div className='absolute inset-2 rounded-2xl bg-base-content/5 animate-pulse flex items-center justify-center'>
                          <div className='size-8 rounded-full bg-base-content/10' />
                        </div>
                      )}
                      <img 
                        src={item.src} 
                        alt="User" 
                        onLoad={() => setLoadingStates(prev => ({ ...prev, [item.id]: true }))}
                        className={`size-full object-cover rounded-2xl bg-base-200 transition-opacity duration-500 ${loadingStates[item.id] ? 'opacity-100' : 'opacity-0'}`} 
                      />
                    </div>
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <div className='p-4 rounded-2xl bg-base-200'>
                        <item.Icon className='size-8 text-primary' />
                      </div>
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
      </motion.div>
    </div>
  );
};

export default AuthImagePattern;
