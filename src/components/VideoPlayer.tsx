'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

interface VideoPlayerProps {
  videoSrc: string;
  videoType?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoSrc,
  videoType = 'video/mp4',
  autoPlay = true,
  muted = true,
  loop = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Initialize video and ensure it plays
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial muted state (only for autoplay, then allow user control)
    if (autoPlay) {
      // Muted is required for autoplay in most browsers
      video.muted = muted;
    } else {
      video.muted = muted;
    }
    setIsLoading(true);

    // Handle video load and play
    const handleCanPlay = async () => {
      setIsLoading(false);
      setBuffering(false);
      try {
        if (autoPlay) {
          await video.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Error playing video:', error);
        // If autoplay fails, user can still click play
      }
    };

    const handleCanPlayThrough = () => {
      setIsLoading(false);
      setBuffering(false);
    };

    const handleWaiting = () => {
      setBuffering(true);
    };

    const handlePlaying = () => {
      setBuffering(false);
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setBuffering(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = (e: any) => {
      const video = videoRef.current;
      let errorMessage = 'Failed to load video';
      
      if (video) {
        const errorCode = video.error;
        if (errorCode) {
          switch (errorCode.code) {
            case MediaError.MEDIA_ERR_ABORTED:
              errorMessage = 'Video loading was aborted';
              break;
            case MediaError.MEDIA_ERR_NETWORK:
              errorMessage = 'Network error while loading video';
              break;
            case MediaError.MEDIA_ERR_DECODE:
              errorMessage = 'Video decoding error';
              break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage = 'Video format not supported or file not found';
              break;
            default:
              errorMessage = `Video error (code: ${errorCode.code})`;
          }
        }
      }
      
      console.error('Video error:', errorMessage, e);
      console.error('Video source:', videoSrc);
      setError(errorMessage);
      setIsLoading(false);
      setBuffering(false);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    // Log video source for debugging
    console.log('Loading video from:', videoSrc);
    
    // Try to load and play
    video.load();
    if (autoPlay) {
      // Small delay to ensure video is ready
      setTimeout(() => {
        handleCanPlay();
      }, 100);
    }

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, [autoPlay, muted]);


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
          ref={videoContainerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          sx={{
            position: 'relative',
            width: '100%',
            borderRadius: { xs: 2, sm: 3, md: 4 },
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            backgroundColor: 'black',
            aspectRatio: '16/9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            ref={videoRef}
            component="video"
            src={videoSrc}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            playsInline
            preload="auto"
            controls
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              outline: 'none',
            }}
            onLoadStart={() => {
              setIsLoading(true);
              setError(null);
            }}
            onLoadedMetadata={() => {
              // Video metadata loaded - ready to play
            }}
            onCanPlay={() => {
              setIsLoading(false);
              setBuffering(false);
              // Try to play when video can play
              if (autoPlay && videoRef.current && !isPlaying) {
                videoRef.current.play().catch((error) => {
                  console.error('Autoplay prevented:', error);
                });
              }
            }}
            onCanPlayThrough={() => {
              setIsLoading(false);
              setBuffering(false);
            }}
            onWaiting={() => {
              setBuffering(true);
            }}
            onPlaying={() => {
              setIsLoading(false);
              setBuffering(false);
            }}
          >
            <source
              src={videoSrc}
              type={videoType}
            />
            <source
              src={videoSrc}
              type="video/quicktime"
            />
            <source
              src={videoSrc}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </Box>

          {/* Loading/Buffering Indicator */}
          {(isLoading || buffering) && !error && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                zIndex: 2,
                backdropFilter: 'blur(4px)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <CircularProgress
                  size={60}
                  thickness={4}
                  sx={{
                    color: 'primary.main',
                  }}
                />
                <Box
                  sx={{
                    color: 'white',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 500,
                  }}
                >
                  {isLoading ? 'Loading video...' : 'Buffering...'}
                </Box>
              </Box>
            </Box>
          )}

          {/* Error Message */}
          {error && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                zIndex: 2,
                backdropFilter: 'blur(4px)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  px: 3,
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    color: 'error.main',
                    fontSize: { xs: '2rem', sm: '3rem' },
                  }}
                >
                  ⚠️
                </Box>
                <Box
                  sx={{
                    color: 'white',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 500,
                  }}
                >
                  {error}
                </Box>
                <Box
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    mt: 1,
                  }}
                >
                  Please check the video URL or try again later
                </Box>
              </Box>
            </Box>
          )}

        </MotionBox>
      </Container>
    </Box>
  );
};

export default VideoPlayer;

