import React, { useRef, useEffect, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import Button from '@/components/ui/button';

const CameraFeed = ({ 
  isActive, 
  onVideoReady, 
  onError,
  className = '',
  showControls = true 
}) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Getting user media');

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Camera initialization timeout (5s)')), 5000);
      });

      const streamPromise = navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      const stream = await Promise.race([streamPromise, timeoutPromise]);
      console.log('Stream received');

      if (videoRef.current) {
        console.log('Attaching stream to video element');
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        videoRef.current.onloadedmetadata = () => {
          console.log('Video element ready');
          console.log('Calling video.play()');
          
          videoRef.current.play().then(() => {
            console.log('Video playing successfully');
            setIsLoading(false);
            
            // Verify video.readyState before starting detection
            if (videoRef.current.readyState >= 2) {
              if (onVideoReady) onVideoReady(videoRef.current);
            } else {
              videoRef.current.oncanplay = () => {
                if (onVideoReady) onVideoReady(videoRef.current);
              };
            }
          }).catch(e => {
            console.error('Error playing video:', e);
            setError('Failed to play video stream.');
            setIsLoading(false);
            if (onError) onError('Failed to play video stream.');
          });
        };
      }
    } catch (err) {
      console.error('Camera access error:', err);
      let errorMessage = 'Failed to access camera. Please check your device settings.';
      
      if (err.name === 'NotAllowedError' || err.message.includes('Permission denied')) {
        errorMessage = 'Camera permission denied. Please enable camera access in your browser settings.';
      } else if (err.name === 'NotFoundError' || err.message.includes('Requested device not found')) {
        errorMessage = 'No camera device found. Please connect a camera and try again.';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'Camera initialization timed out. Please try again.';
      }
      
      setError(errorMessage);
      setIsLoading(false);
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className={`relative w-full h-full min-h-[480px] bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-20">
          <Loader2 className="w-12 h-12 text-blue-500 mb-4 animate-spin" />
          <p className="text-white font-medium">Initializing camera...</p>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-20 p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-white text-center mb-4">{error}</p>
          {showControls && (
            <Button onClick={startCamera} variant="destructive">
              Retry Camera
            </Button>
          )}
        </div>
      )}

      <video
        ref={videoRef}
        width="640"
        height="480"
        className={`block w-full h-full object-cover ${isLoading || error ? 'opacity-0' : 'opacity-100'}`}
        autoPlay
        playsInline
        muted
      />
    </div>
  );
};

export default CameraFeed;