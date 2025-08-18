'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import FloatingButton from './FloatingButton';

const FloatingButtonWrapper = () => {
  const router = useRouter();

  const handleFloatingButtonClick = () => {
    router.push('/custom-seats');
  };

  return <FloatingButton onClick={handleFloatingButtonClick} />;
};

export default FloatingButtonWrapper;
