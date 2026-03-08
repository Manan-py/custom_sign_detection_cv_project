import React, { useState } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const CameraPermissionPrompt = ({ isOpen, onRequestPermission, onClose }) => {
  const [error, setError] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequest = async () => {
    try {
      setIsRequesting(true);
      setError(null);
      
      // Test camera access directly to catch specific errors
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop tracks immediately since we just wanted to check permission
      stream.getTracks().forEach(track => track.stop());
      
      if (onRequestPermission) {
        onRequestPermission();
      }
    } catch (err) {
      console.error('Permission request failed:', err);
      if (err.name === 'NotAllowedError' || err.message.includes('Permission denied')) {
        setError('Camera permission denied. Please enable camera access in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.message.includes('Requested device not found')) {
        setError('No camera device found. Please connect a camera and try again.');
      } else {
        setError('Failed to access camera: ' + err.message);
      }
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
            <Camera className="w-8 h-8 text-blue-600" />
          </div>
          <DialogTitle className="text-center text-xl">Camera Access Required</DialogTitle>
          <DialogDescription className="text-center">
            This application needs access to your camera to detect hand gestures and recognize Indian Sign Language signs.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Why we need camera access:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>Real-time hand gesture detection</li>
                <li>ISL sign recognition</li>
                <li>Custom sign recording</li>
              </ul>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Your camera feed is processed locally and never stored or transmitted.
          </p>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 text-left">
              <p className="font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Error
              </p>
              <p className="mt-1">{error}</p>
              {error.includes('denied') && (
                <div className="mt-2 text-xs text-red-700">
                  <p className="font-medium">To enable camera access:</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Click the lock/tune icon in your browser's address bar</li>
                    <li>Find "Camera" in the site settings</li>
                    <li>Change the permission to "Allow"</li>
                    <li>Refresh the page</li>
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-center">
          <Button 
            onClick={handleRequest} 
            className="w-full sm:w-auto"
            disabled={isRequesting}
          >
            {isRequesting ? 'Requesting...' : 'Grant Camera Access'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CameraPermissionPrompt;