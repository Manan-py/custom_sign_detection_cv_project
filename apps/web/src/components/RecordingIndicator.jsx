import React from 'react';
import { Circle } from 'lucide-react';

const RecordingIndicator = ({ isRecording, recordingTime, className = '' }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isRecording) return null;

  return (
    <div className={`flex items-center gap-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg ${className}`}>
      <Circle className="w-3 h-3 text-red-600 fill-red-600 animate-pulse" />
      <span className="text-sm font-medium text-red-700">Recording</span>
      <span className="text-sm font-mono text-red-600">{formatTime(recordingTime)}</span>
    </div>
  );
};

export default RecordingIndicator;
export { RecordingIndicator };