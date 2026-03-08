import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Camera, CameraOff, Info, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import CameraFeed from '@/components/CameraFeed.jsx';
import { HandLandmarkOverlay } from '@/components/HandLandmarkOverlay.jsx';
import GestureClassificationBadge from '@/components/GestureClassificationBadge.jsx';
import useMediaPipeHands from '@/hooks/useMediaPipeHands.js';

const MediaPipeHandPosePage = () => {
  const [isActive, setIsActive] = useState(false);
  const [videoElement, setVideoElement] = useState(null);
  const [selectedLandmark, setSelectedLandmark] = useState(null);
  const [currentGesture, setCurrentGesture] = useState(null);
  const containerRef = useRef(null);

  const { 
    isLoading: modelLoading,
    error: modelError,
    isReady: modelReady,
    hands,
    detectionRunning,
    startDetection,
    stopDetection,
    classifyGesture
  } = useMediaPipeHands();

  // Handle starting/stopping detection when video is ready and active
  useEffect(() => {
    if (isActive && videoElement && modelReady) {
      startDetection(videoElement);
    } else {
      stopDetection();
    }
    
    return () => {
      stopDetection();
    };
  }, [isActive, videoElement, modelReady, startDetection, stopDetection]);

  // Update gesture classification in real-time based on detected landmarks
  useEffect(() => {
    if (hands.landmarks && hands.landmarks.length > 0) {
      const gesture = classifyGesture(hands.landmarks);
      setCurrentGesture(gesture);
    } else {
      setCurrentGesture(null);
    }
  }, [hands.landmarks, classifyGesture]);

  const handleVideoReady = (video) => {
    setVideoElement(video);
  };

  const toggleCamera = () => {
    setIsActive(!isActive);
    if (isActive) {
      setCurrentGesture(null);
      setSelectedLandmark(null);
      setVideoElement(null);
    }
  };

  const landmarkNames = [
    'Wrist', 'Thumb CMC', 'Thumb MCP', 'Thumb IP', 'Thumb Tip',
    'Index MCP', 'Index PIP', 'Index DIP', 'Index Tip',
    'Middle MCP', 'Middle PIP', 'Middle DIP', 'Middle Tip',
    'Ring MCP', 'Ring PIP', 'Ring DIP', 'Ring Tip',
    'Pinky MCP', 'Pinky PIP', 'Pinky DIP', 'Pinky Tip'
  ];

  return (
    <>
      <Helmet>
        <title>Hand Pose Detection - MediaPipe Visualization</title>
        <meta name="description" content="Real-time hand pose detection and landmark visualization using MediaPipe. Track 21 hand points with 3D coordinates." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Hand Pose Detection</h1>
            <p className="text-gray-600">Real-time hand landmark visualization with MediaPipe</p>
          </div>

          {/* Status Indicators */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6 max-w-3xl mx-auto">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">System Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="font-medium text-gray-700">MediaPipe Model</span>
                {modelLoading ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Loader2 className="w-3 h-3 mr-1 animate-spin"/> Loading
                  </Badge>
                ) : modelError ? (
                  <Badge variant="destructive">
                    <AlertCircle className="w-3 h-3 mr-1"/> Error
                  </Badge>
                ) : modelReady ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-transparent">
                    <CheckCircle className="w-3 h-3 mr-1"/> Ready
                  </Badge>
                ) : null}
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="font-medium text-gray-700">Camera Feed</span>
                {isActive ? (
                  videoElement ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-transparent">
                      <CheckCircle className="w-3 h-3 mr-1"/> Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Loader2 className="w-3 h-3 mr-1 animate-spin"/> Starting
                    </Badge>
                  )
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="font-medium text-gray-700">Detection Loop</span>
                {detectionRunning ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-transparent flex items-center gap-1">
                    <span className="relative flex h-2 w-2 mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Running
                  </Badge>
                ) : (
                  <Badge variant="secondary">Stopped</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Camera Feed */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Camera Feed</h2>
                  <Button
                    onClick={toggleCamera}
                    disabled={modelLoading}
                    variant={isActive ? 'destructive' : 'default'}
                  >
                    {isActive ? (
                      <>
                        <CameraOff className="w-4 h-4 mr-2" />
                        Stop Camera
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        Start Camera
                      </>
                    )}
                  </Button>
                </div>

                <div ref={containerRef} className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                  <CameraFeed
                    isActive={isActive}
                    onVideoReady={handleVideoReady}
                    className="w-full h-full object-cover"
                    showControls={false}
                  />
                  {isActive && videoElement && detectionRunning && (
                    <HandLandmarkOverlay
                      landmarks={hands.landmarks}
                      handedness={hands.handedness}
                      width={containerRef.current?.offsetWidth || 640}
                      height={containerRef.current?.offsetHeight || 480}
                    />
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-bold text-gray-900">Landmark Color Legend</h2>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="text-sm text-gray-700">Wrist</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-700">Joints</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-700">Fingertips</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="space-y-4">
              {/* Hand Orientation */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Hand Orientation</h2>
                
                {hands.handedness && hands.handedness.length > 0 ? (
                  <div className="space-y-2">
                    {hands.handedness.map((hand, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">Hand {index + 1}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          hand[0]?.categoryName === 'Right' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {hand[0]?.categoryName}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    {detectionRunning ? 'Waiting for hands...' : 'No hands detected'}
                  </p>
                )}
              </div>

              {/* Gesture Classification */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Gesture Classification</h2>
                
                {currentGesture ? (
                  <GestureClassificationBadge gesture={currentGesture} className="w-full justify-center text-lg py-3" />
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    {detectionRunning ? 'Show a gesture...' : 'No gesture detected'}
                  </p>
                )}
              </div>

              {/* Landmark Coordinates */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Landmark Coordinates</h2>
                
                {hands.landmarks && hands.landmarks.length > 0 && hands.landmarks[0] ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {hands.landmarks[0].map((landmark, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedLandmark(index)}
                        className={`w-full text-left p-2 rounded-lg transition-colors ${
                          selectedLandmark === index 
                            ? 'bg-blue-100 border border-blue-300' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-900">{landmarkNames[index]}</p>
                        <p className="text-xs text-gray-600 font-mono">
                          x: {landmark.x.toFixed(3)}, y: {landmark.y.toFixed(3)}, z: {landmark.z.toFixed(3)}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    {detectionRunning ? 'Tracking landmarks...' : 'No landmarks detected'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MediaPipeHandPosePage;