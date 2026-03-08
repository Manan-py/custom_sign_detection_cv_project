import { useEffect, useRef, useState, useCallback } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

const useMediaPipeHands = () => {
  const [handLandmarker, setHandLandmarker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [hands, setHands] = useState({ landmarks: [], handedness: [] });
  const [detectionRunning, setDetectionRunning] = useState(false);
  
  const requestRef = useRef(null);
  const frameCount = useRef(0);
  const lastVideoTimeRef = useRef(-1);
  const detectionTimeoutRef = useRef(null);

  const initializeHandLandmarker = useCallback(async () => {
    try {
      console.log('Initializing MediaPipe');
      setIsLoading(true);
      setError(null);
      setIsReady(false);

      console.log('Loading HandLandmarker model');

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('MediaPipe model load timeout (5s)')), 5000)
      );

      const loadModelPromise = async () => {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        
        return await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
      };

      const landmarker = await Promise.race([loadModelPromise(), timeoutPromise]);
      
      console.log('Model loaded successfully');
      setHandLandmarker(landmarker);
      setIsReady(true);
      setIsLoading(false);
    } catch (err) {
      console.error('MediaPipe initialization failed:', err);
      setError({ errorMessage: err.message });
      setIsLoading(false);
      setIsReady(false);
    }
  }, []);

  useEffect(() => {
    initializeHandLandmarker();
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (detectionTimeoutRef.current) clearTimeout(detectionTimeoutRef.current);
    };
  }, [initializeHandLandmarker]);

  const stopDetection = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    if (detectionTimeoutRef.current) {
      clearTimeout(detectionTimeoutRef.current);
      detectionTimeoutRef.current = null;
    }
    setDetectionRunning(false);
    setHands({ landmarks: [], handedness: [] });
    console.log('Detection loop stopped');
  }, []);

  const startDetection = useCallback((videoElement) => {
    if (!handLandmarker || !videoElement) {
      console.warn('Cannot start detection: MediaPipe or video element not ready');
      return;
    }

    // Verify video dimensions
    if (videoElement.videoWidth !== 640 || videoElement.videoHeight !== 480) {
      console.warn(`Video dimensions are ${videoElement.videoWidth}x${videoElement.videoHeight}, expected 640x480. Detection may be inaccurate.`);
    }

    console.log('Starting detection loop');
    setDetectionRunning(true);
    frameCount.current = 0;
    lastVideoTimeRef.current = -1;
    let detectionStarted = false;

    // 2-second timeout fallback
    if (detectionTimeoutRef.current) clearTimeout(detectionTimeoutRef.current);
    detectionTimeoutRef.current = setTimeout(() => {
      if (!detectionStarted) {
        console.error('Detection did not start within 2 seconds. Retrying initialization...');
        stopDetection();
        initializeHandLandmarker();
      }
    }, 2000);

    const detect = () => {
      try {
        if (videoElement.readyState >= 2) {
          const startTimeMs = performance.now();
          
          // Only process if video frame has updated
          if (videoElement.currentTime !== lastVideoTimeRef.current) {
            lastVideoTimeRef.current = videoElement.currentTime;
            
            const results = handLandmarker.detectForVideo(videoElement, startTimeMs);
            detectionStarted = true;
            frameCount.current += 1;
            
            const numHands = results.landmarks ? results.landmarks.length : 0;
            console.log(`Processing frame ${frameCount.current}`);
            console.log(`Hands detected: ${numHands}`);
            
            if (numHands > 0) {
              console.log(`Landmarks:`, results.landmarks);
            }

            setHands({
              landmarks: results.landmarks || [],
              handedness: results.handedness || []
            });
          }
        }
        requestRef.current = requestAnimationFrame(detect);
      } catch (err) {
        console.error('Hand detection failed on frame:', err);
        // Continue loop even if one frame fails
        requestRef.current = requestAnimationFrame(detect);
      }
    };

    requestRef.current = requestAnimationFrame(detect);
  }, [handLandmarker, initializeHandLandmarker, stopDetection]);

  const classifyGesture = useCallback((handLandmarks) => {
    if (!handLandmarks || handLandmarks.length === 0) return null;

    const landmarks = handLandmarks[0];
    
    const thumbExtended = landmarks[4].y < landmarks[3].y;
    const indexExtended = landmarks[8].y < landmarks[6].y;
    const middleExtended = landmarks[12].y < landmarks[10].y;
    const ringExtended = landmarks[16].y < landmarks[14].y;
    const pinkyExtended = landmarks[20].y < landmarks[18].y;

    const extendedFingers = [
      thumbExtended,
      indexExtended,
      middleExtended,
      ringExtended,
      pinkyExtended
    ].filter(Boolean).length;

    if (extendedFingers === 0) return 'Closed Fist';
    if (extendedFingers === 5) return 'Open Hand';
    if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) return 'Pointing';
    if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) return 'Peace Sign';
    if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) return 'Thumbs Up';
    if (indexExtended && pinkyExtended && !middleExtended && !ringExtended) return 'Rock On';
    
    return 'Unknown Gesture';
  }, []);

  return {
    hands,
    isLoading,
    error,
    isReady,
    detectionRunning,
    startDetection,
    stopDetection,
    classifyGesture,
    retry: initializeHandLandmarker
  };
};

export { useMediaPipeHands };
export default useMediaPipeHands;