'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

interface YouTubePlayerProps {
  videoUrl: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

// Extract video ID from YouTube URL
const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoUrl,
  autoPlay = true,
  muted = true,
  loop = true,
  controls = true,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoId = extractVideoId(videoUrl);

  useEffect(() => {
    if (!videoId) {
      setError('Invalid YouTube URL');
      setIsLoading(false);
      return;
    }
  }, [videoId]);

  // Build YouTube embed URL with parameters
  const getEmbedUrl = (): string => {
    if (!videoId) return '';
    
    const params = new URLSearchParams({
      autoplay: autoPlay ? '1' : '0',
      mute: muted ? '1' : '0',
      loop: loop ? '1' : '0',
      controls: controls ? '1' : '0',
      rel: '0', // Don't show related videos
      modestbranding: '1', // Remove YouTube logo
      playsinline: '1', // Play inline on mobile
      enablejsapi: '1', // Enable JavaScript API
    });

    // For looping a single video, we need to add playlist parameter
    if (loop) {
      params.append('playlist', videoId);
    }

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load YouTube video');
  };

  if (!videoId) {
    return (
      <Box
        sx={{
          width: '100%',
          aspectRatio: '16/9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'black',
          color: 'white',
        }}
      >
        <Typography>Invalid YouTube URL</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 4, sm: 5, md: 6, lg: 8, xl: 8 },
        backgroundColor: 'white',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 0, xl: 0 } }}>
        <MotionBox
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: { xs: 2, sm: 3, md: 4 },
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            backgroundColor: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
      {isLoading && !error && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 2,
          }}
        >
          <CircularProgress sx={{ color: 'white' }} />
        </Box>
      )}

      {error ? (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
            color: 'white',
            p: 3,
          }}
        >
          <Typography>{error}</Typography>
        </Box>
      ) : (
        <Box
          component="iframe"
          ref={iframeRef}
          src={getEmbedUrl()}
          onLoad={handleLoad}
          onError={handleError}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
        />
      )}
        </MotionBox>
      </Container>
    </Box>
  );
};

export default YouTubePlayer;

