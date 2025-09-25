'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import FloatingButton from './FloatingButton';

const FloatingButtonWrapper = () => {
  const router = useRouter();

  const handleFloatingButtonClick = () => {
    // TODO: Uncomment when customize page is ready
    // router.push('/custom-seats');
    
    // Temporary: Show alert that feature is coming soon
    alert('Customize feature coming soon!');
  };

  return <FloatingButton onClick={handleFloatingButtonClick} />;
};

export default FloatingButtonWrapper;
