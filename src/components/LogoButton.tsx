'use client';

import React from 'react';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const MotionButton = motion.create(Button);

interface LogoButtonProps {
  onClick?: () => void;
}

const LogoButton = ({ onClick }: LogoButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push('/customize-your-seat');
    }
  };

  return (
    <MotionButton
      variant="contained"
      size="large"
      onClick={handleClick}
      initial={{ opacity: 0, rotateY: 0 }}
      animate={{
        rotateY: 360,
      }}
      transition={{
        rotateY: {
          duration: 2.5,
          repeat: Infinity,
          ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for smoother, slower start
          repeatDelay: 0.5,
        },
      }}
      whileInView={{ 
        opacity: 1,
        transition: { 
          duration: 1,
          ease: "easeInOut",
          delay: 0.1
        }
      }}
      viewport={{ once: false, amount: 0.1, margin: "0px 0px -100px 0px" }}
      whileHover={{ 
        scale: 1.05,
        transition: { 
          duration: 0.3, 
          ease: "easeInOut"
        }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      sx={{
        backgroundColor: 'transparent',
        color: '#DA291C',
        borderRadius: '50%',
        marginTop: { xs: '-10px', sm: '-10px', md: '60px', lg: '60px', xl: '70px' },  
        marginLeft: { xs: '-10px', sm: '-10px', md: '-25px', lg: '-35px', xl: '15px' }, // S logo  size button
        width: { xs: '140px', sm: '140px', md: '150px', lg: '170px', xl: '200px' },
        height: { xs: '120px', sm: '120px', md: '130px', lg: '150px', xl: '180px' },
        minWidth: 'unset',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 20,
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Image
        src="/superiorlogo/sp.png"
        alt="Superior Seating Logo"
        fill
        style={{
          objectFit: 'cover',
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
          borderRadius: '50%',
        }}
        priority
      />
    </MotionButton>
  );
};

export default LogoButton; 