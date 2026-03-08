import { useState, useRef } from 'react';

const useVideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [frames, setFrames] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const intervalRef = useRef(null);
  const canvasRef = useRef(null);

  const startRecording = () => {
    setIsRecording(true);
    setFrames([]);
    setRecordingTime(0);
    
    intervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const captureFrame = (videoElement) => {
    if (!videoElement || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `frame-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setFrames(prev => [...prev, file]);
          resolve(file);
        } else {
          resolve(null);
        }
      }, 'image/jpeg', 0.9);
    });
  };

  const clearFrames = () => {
    setFrames([]);
    setRecordingTime(0);
  };

  const getCanvas = () => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    return canvasRef.current;
  };

  return {
    isRecording,
    frames,
    recordingTime,
    startRecording,
    stopRecording,
    captureFrame,
    clearFrames,
    getCanvas
  };
};

export { useVideoRecorder };
export default useVideoRecorder;