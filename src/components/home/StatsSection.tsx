import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code, Briefcase, Award, Clock } from 'lucide-react';
import AnimatedCounter from '../ui/AnimatedCounter';
import { useTheme } from '../../contexts/ThemeContext';

const StatsSection: React.FC = () => {
  const { theme } = useTheme();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    {
      icon: <Code size={24} />,
      value: 15,
      label: 'Projects Completed',
      suffix: '+',
      delay: 0,
    },
    {
      icon: <Briefcase size={24} />,
      value: 3,
      label: 'Years Experience',
      suffix: '+',
      delay: 0.2,
    },
    {
      icon: <Award size={24} />,
      value: 99,
      label: 'Satisfaction Rate',
      suffix: '%',
      delay: 0.4,
    },
    {
      icon: <Clock size={24} />,
      value: 500,
      label: 'Hours of Coding',
      suffix: '+',
      delay: 0.6,
    },
  ];

  return (
    <section 
      ref={ref} 
      className={`py-16 ${theme === 'dark' ? 'bg-card dark:bg-gray-900' : 'bg-gray-50'}`}
    >
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          By the Numbers
        </motion.h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={`flex flex-col items-center text-center p-6 rounded-lg ${
                theme === 'dark' ? 'dark:spider-card' : 'professional-card'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: stat.delay }}
            >
              <div className={`p-3 rounded-full mb-4 ${
                theme === 'dark' 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-primary/10 text-primary'
              }`}>
                {stat.icon}
              </div>
              
              <AnimatedCounter
                end={stat.value}
                suffix={stat.suffix}
                delay={stat.delay}
                className="text-3xl font-bold mb-2"
              />
              
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
