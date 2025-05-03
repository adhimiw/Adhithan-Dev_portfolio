import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import { useTheme } from '../../contexts/ThemeContext';
import PlaceholderImage from '../ui/PlaceholderImage';
import { fetchAbout } from '../../services/dataService';

interface HeroSectionProps {
  name: string;
  title: string;
  bio: string;
}

const HeroSection = ({ name, title, bio }: HeroSectionProps) => {
  const { theme } = useTheme();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    initialInView: true,
  });
  const [avatar, setAvatar] = useState<string | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Fetch avatar from the About model
  useEffect(() => {
    const getAvatar = async () => {
      try {
        const aboutData = await fetchAbout();
        if (aboutData && aboutData.avatar) {
          console.log("Avatar URL:", aboutData.avatar);
          setAvatar(aboutData.avatar);
        } else {
          console.error("No avatar found in about data");
        }
      } catch (error) {
        console.error('Error fetching avatar:', error);
      }
    };

    getAvatar();
  }, []);

  // GSAP animation for the hero section
  useEffect(() => {
    if (inView && heroRef.current && textRef.current && imageRef.current) {
      const tl = gsap.timeline();

      tl.from(textRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });

      tl.from(imageRef.current, {
        x: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      }, '-=0.5');
    }
  }, [inView]);

  // Particle animation for the background
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined' || !heroRef.current) return;

    let animationFrameId: number;
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null;

    try {
      canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '0';

      heroRef.current.appendChild(canvas);

      const particles: { x: number; y: number; size: number; speedX: number; speedY: number; color: string }[] = [];
      const particleCount = 30; // Reduced for better performance

      // Create particles
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 1,
          speedX: Math.random() * 1.5 - 0.75,
          speedY: Math.random() * 1.5 - 0.75,
          color: theme === 'dark' ?
            `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 50)}, ${Math.random() * 0.4 + 0.1})` :
            `rgba(${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.random() * 0.2 + 0.1})`
        });
      }

      const animate = () => {
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
          ctx!.fillStyle = particle.color;
          ctx!.beginPath();
          ctx!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx!.fill();

          particle.x += particle.speedX;
          particle.y += particle.speedY;

          if (particle.x < 0 || particle.x > canvas.width) {
            particle.speedX = -particle.speedX;
          }

          if (particle.y < 0 || particle.y > canvas.height) {
            particle.speedY = -particle.speedY;
          }
        });

        animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        if (heroRef.current && canvas) {
          try {
            heroRef.current.removeChild(canvas);
          } catch (e) {
            console.error('Error removing canvas:', e);
          }
        }
      };
    } catch (error) {
      console.error('Error in particle animation:', error);
      return () => {};
    }
  }, [theme]);

  return (
    <div
      ref={heroRef}
      className={`relative min-h-[90vh] flex items-center overflow-hidden ${
        theme === 'dark' ? 'dark:spider-card' : 'premium-section'
      }`}
    >
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: theme === 'dark'
            ? 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0V0zm10 10L0 0v20h20V0L10 10z\' fill=\'%23ffffff\' fill-opacity=\'0.1\'/%3E%3C/svg%3E")'
            : 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0V0zm10 10L0 0v20h20V0L10 10z\' fill=\'%23000000\' fill-opacity=\'0.05\'/%3E%3C/svg%3E")',
          backgroundSize: '30px 30px'
        }}
      />

      {theme !== 'dark' && (
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
      )}

      {theme !== 'dark' && (
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />
      )}

      <div ref={ref} className="container mx-auto px-4 py-16 z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div ref={textRef} className="space-y-6">
          <motion.h1
            className={`text-4xl md:text-6xl font-bold ${theme !== 'dark' ? 'premium-heading' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Hi, I'm <span className={theme === 'dark' ? 'text-primary' : ''}>{name}</span>
          </motion.h1>

          <motion.h2
            className="text-2xl md:text-3xl font-medium text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {title}
          </motion.h2>

          <motion.p
            className="text-lg leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {bio}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <a
              href="#projects"
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                theme === 'dark'
                  ? 'dark:spider-button bg-primary text-white hover:bg-primary/90'
                  : 'professional-button'
              }`}
            >
              View My Work
            </a>
            <a
              href="#contact"
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-transparent border border-primary text-primary hover:bg-primary/10'
                  : 'bg-transparent border-2 border-primary text-primary hover:bg-primary/5 hover:shadow-lg'
              }`}
            >
              Contact Me
            </a>
          </motion.div>
        </div>

        <div ref={imageRef} className="relative">
          <div className={`relative w-full aspect-square max-w-md mx-auto overflow-hidden rounded-full ${
            theme === 'dark'
              ? 'border-4 border-primary'
              : 'border-4 border-primary/20 shadow-[0_0_30px_rgba(0,0,0,0.08)]'
          }`}>
            <div className={`absolute inset-0 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-primary/20 to-transparent'
                : 'bg-gradient-to-br from-primary/10 via-primary/5 to-transparent'
            }`} />
            <PlaceholderImage
              src={avatar || "/profile.jpg"}
              alt={name}
              className="w-full h-full object-cover"
              fallbackWidth={400}
              fallbackHeight={400}
            />
          </div>

          {theme === 'dark' && (
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-[#0066ff] blur-2xl opacity-60 animate-pulse" />
          )}

          {theme === 'dark' && (
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-primary blur-2xl opacity-60 animate-pulse" />
          )}

          {theme !== 'dark' && (
            <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-primary/20 blur-3xl opacity-60 animate-pulse-slow" />
          )}

          {theme !== 'dark' && (
            <div className="absolute -top-4 -left-4 w-32 h-32 rounded-full bg-primary/10 blur-3xl opacity-60 animate-pulse-slow" />
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
