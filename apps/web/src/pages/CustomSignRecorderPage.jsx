import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Camera, CameraOff, Circle, Save, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import Textarea from '@/components/ui/textarea';
import CameraFeed from '@/components/CameraFeed.jsx';
import { RecordingIndicator } from '@/components/RecordingIndicator.jsx';
import useVideoRecorder from '@/hooks/useVideoRecorder.js';
import { useNavigate } from 'react-router-dom';

const CustomSignRecorderPage = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [videoElement, setVideoElement] = useState(null);
  const [step, setStep] = useState(1); // 1: Recording, 2: Form
  const [formData, setFormData] = useState({
    sign_name: '',
    sign_meaning: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const intervalRef = useRef(null);

  const {
    isRecording,
    frames,
    recordingTime,
    startRecording,
    stopRecording,
    captureFrame,
    clearFrames,
    getCanvas
  } = useVideoRecorder();

  const handleVideoReady = (video) => {
    setVideoElement(video);
    getCanvas(); // Initialize canvas
  };

  const handleStartRecording = () => {
    if (!videoElement) return;
    
    startRecording();
    
    // Capture frames every 200ms (5 fps)
    intervalRef.current = setInterval(() => {
      captureFrame(videoElement);
    }, 200);
  };

  const handleStopRecording = () => {
    stopRecording();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStep(2);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    if (!formData.sign_name || !formData.sign_meaning) {
      alert('Please fill in both sign name and meaning');
      return;
    }

    if (frames.length === 0) {
      alert('Please record some video frames first');
      return;
    }

    setIsSaving(true);
    // Auth/storage disabled: simulate success and navigate
    alert('Storage is disabled in this build. Navigating to gallery.');
    navigate('/custom-gallery');
    setIsSaving(false);
  };

  const handleReset = () => {
    clearFrames();
    setFormData({ sign_name: '', sign_meaning: '' });
    setStep(1);
  };

  return (
    <>
      <Helmet>
        <title>Custom Sign Recorder - Create Your Own ISL Signs</title>
        <meta name="description" content="Record and save custom Indian Sign Language signs with video frames and descriptions." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Custom Sign Recorder</h1>
            <p className="text-gray-600">Create and save your own sign language gestures</p>
          </div>

          {step === 1 ? (
            /* Recording Step */
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Camera Feed</h2>
                  <div className="flex items-center gap-3">
                    {isActive && (
                      <RecordingIndicator isRecording={isRecording} recordingTime={recordingTime} />
                    )}
                    <Button
                      onClick={() => setIsActive(!isActive)}
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
                </div>

                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-4">
                  <CameraFeed
                    isActive={isActive}
                    onVideoReady={handleVideoReady}
                    className="w-full h-full object-cover"
                    showControls={false}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Frames captured: <span className="font-bold text-gray-900">{frames.length}</span>
                  </div>
                  
                  <div className="flex gap-3">
                    {!isRecording ? (
                      <Button
                        onClick={handleStartRecording}
                        disabled={!isActive}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Circle className="w-4 h-4 mr-2 fill-white" />
                        Start Recording
                      </Button>
                    ) : (
                      <Button
                        onClick={handleStopRecording}
                        variant="outline"
                      >
                        Stop Recording
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {frames.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Preview Frames</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {frames.slice(0, 16).map((frame, index) => (
                      <div key={index} className="aspect-square bg-gray-200 rounded overflow-hidden">
                        <img
                          src={URL.createObjectURL(frame)}
                          alt={`Frame ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  {frames.length > 16 && (
                    <p className="text-sm text-gray-500 mt-2">
                      +{frames.length - 16} more frames
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Form Step */
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign Details</h2>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="sign_name" className="text-gray-900">Sign Name</Label>
                  <Input
                    id="sign_name"
                    name="sign_name"
                    value={formData.sign_name}
                    onChange={handleFormChange}
                    placeholder="e.g., Hello, Thank You, Help"
                    className="mt-2 bg-white text-gray-900"
                  />
                </div>

                <div>
                  <Label htmlFor="sign_meaning" className="text-gray-900">Sign Meaning</Label>
                  <Textarea
                    id="sign_meaning"
                    name="sign_meaning"
                    value={formData.sign_meaning}
                    onChange={handleFormChange}
                    placeholder="Describe what this sign means and how to perform it..."
                    rows={4}
                    className="mt-2 bg-white text-gray-900"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Frames recorded:</span> {frames.length}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Sign'}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    disabled={isSaving}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomSignRecorderPage;