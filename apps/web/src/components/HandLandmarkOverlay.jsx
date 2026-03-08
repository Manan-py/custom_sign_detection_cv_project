import React, { useRef, useEffect } from 'react';

const HandLandmarkOverlay = ({ landmarks, handedness, width, height, className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !landmarks || landmarks.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, width, height);

    landmarks.forEach((handLandmarks, handIndex) => {
      const isRightHand = handedness[handIndex]?.[0]?.categoryName === 'Right';
      const handColor = isRightHand ? '#3b82f6' : '#10b981';

      // Draw connections
      const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
        [0, 5], [5, 6], [6, 7], [7, 8], // Index
        [0, 9], [9, 10], [10, 11], [11, 12], // Middle
        [0, 13], [13, 14], [14, 15], [15, 16], // Ring
        [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
        [5, 9], [9, 13], [13, 17] // Palm
      ];

      ctx.strokeStyle = handColor;
      ctx.lineWidth = 2;

      connections.forEach(([start, end]) => {
        const startPoint = handLandmarks[start];
        const endPoint = handLandmarks[end];
        
        ctx.beginPath();
        ctx.moveTo(startPoint.x * width, startPoint.y * height);
        ctx.lineTo(endPoint.x * width, endPoint.y * height);
        ctx.stroke();
      });

      // Draw landmarks
      handLandmarks.forEach((landmark, index) => {
        const x = landmark.x * width;
        const y = landmark.y * height;

        // Color code landmarks
        let color;
        if (index === 0) {
          color = '#ef4444'; // Wrist - red
        } else if ([4, 8, 12, 16, 20].includes(index)) {
          color = '#22c55e'; // Fingertips - green
        } else {
          color = '#3b82f6'; // Other joints - blue
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Add white border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    });
  }, [landmarks, handedness, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`absolute top-0 left-0 pointer-events-none ${className}`}
    />
  );
};

export default HandLandmarkOverlay;
export { HandLandmarkOverlay };