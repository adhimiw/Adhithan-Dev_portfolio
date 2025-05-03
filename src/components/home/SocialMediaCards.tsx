import React from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaLinkedin, FaGithub, FaMedium } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardContent, CardMedia, Typography, Box, Button, useTheme as useMuiTheme } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

interface SocialMediaCardsProps {
  instagramUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  mediumUrl?: string;
}

const SocialMediaCards: React.FC<SocialMediaCardsProps> = ({
  instagramUrl = 'https://instagram.com/adhithanraja6',
  linkedinUrl = 'https://linkedin.com/in/adhithan-r',
  githubUrl = 'https://github.com/adhimiw',
  mediumUrl = 'https://medium.com/@adhithan',
}) => {
  const { theme } = useTheme();
  const muiTheme = useMuiTheme();

  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: {
      y: -5,
      boxShadow: theme === 'dark'
        ? '0 10px 25px -5px rgba(0, 102, 255, 0.4)'
        : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
    }
  };

  const socialCards = [
    {
      name: 'Instagram',
      icon: <FaInstagram style={{ fontSize: '2rem' }} />,
      url: instagramUrl,
      color: theme === 'dark' ? 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCAF45 100%)' : 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCAF45 100%)',
      description: 'Follow me on Instagram for behind-the-scenes content and updates on my latest projects.',
      position: 'left'
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin style={{ fontSize: '2rem' }} />,
      url: linkedinUrl,
      color: theme === 'dark' ? 'linear-gradient(135deg, #0077B5 0%, #0e76a8 100%)' : 'linear-gradient(135deg, #0077B5 0%, #0e76a8 100%)',
      description: 'Connect with me on LinkedIn for professional updates and networking opportunities.',
      position: 'right'
    },
    {
      name: 'Medium',
      icon: <FaMedium style={{ fontSize: '2rem' }} />,
      url: mediumUrl,
      color: theme === 'dark' ? 'linear-gradient(135deg, #12100E 0%, #30302f 100%)' : 'linear-gradient(135deg, #12100E 0%, #30302f 100%)',
      description: 'Read my articles and thoughts on technology, development, and AI on Medium.',
      position: 'left'
    },
    {
      name: 'GitHub',
      icon: <FaGithub style={{ fontSize: '2rem' }} />,
      url: githubUrl,
      color: theme === 'dark' ? 'linear-gradient(135deg, #333333 0%, #626262 100%)' : 'linear-gradient(135deg, #333333 0%, #626262 100%)',
      description: 'Check out my code repositories and open-source contributions on GitHub.',
      position: 'right'
    }
  ];

  // Filter cards by position
  const leftCards = socialCards.filter(card => card.position === 'left');
  const rightCards = socialCards.filter(card => card.position === 'right');

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      justifyContent: 'space-between',
      gap: 4,
      my: 6,
      position: 'relative',
      zIndex: 10
    }}>
      {/* Left side cards */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        width: { xs: '100%', md: '30%' }
      }}>
        {leftCards.map((card, index) => (
          <motion.div
            key={card.name}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{
              duration: 0.3,
              delay: index * 0.1
            }}
          >
            <Card
              sx={{
                background: card.color,
                color: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                height: '100%',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -32,
                  left: -32,
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {card.icon}
                  <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                    {card.name}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                  {card.description}
                </Typography>

                <Button
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<ArrowForward />}
                  sx={{
                    color: '#fff',
                    p: 0,
                    '&:hover': {
                      background: 'transparent',
                      opacity: 0.9
                    }
                  }}
                >
                  Follow
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Center content placeholder - this is where the main content goes */}
      <Box sx={{
        width: { xs: '100%', md: '40%' },
        display: { xs: 'none', md: 'block' }
      }}>
        {/* Main content goes here */}
      </Box>

      {/* Right side cards */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        width: { xs: '100%', md: '30%' }
      }}>
        {rightCards.map((card, index) => (
          <motion.div
            key={card.name}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{
              duration: 0.3,
              delay: index * 0.1 + 0.2
            }}
          >
            <Card
              sx={{
                background: card.color,
                color: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                height: '100%',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -32,
                  left: -32,
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {card.icon}
                  <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                    {card.name}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                  {card.description}
                </Typography>

                <Button
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<ArrowForward />}
                  sx={{
                    color: '#fff',
                    p: 0,
                    '&:hover': {
                      background: 'transparent',
                      opacity: 0.9
                    }
                  }}
                >
                  Follow
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default SocialMediaCards;
