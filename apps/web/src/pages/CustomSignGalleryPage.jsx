import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Trash2, Play, X } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Link } from 'react-router-dom';

const CustomSignGalleryPage = () => {
  const [signs, setSigns] = useState([]);
  const [filteredSigns, setFilteredSigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSign, setSelectedSign] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [signToDelete, setSignToDelete] = useState(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchSigns();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = signs.filter(sign =>
        sign.sign_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sign.sign_meaning.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSigns(filtered);
    } else {
      setFilteredSigns(signs);
    }
  }, [searchQuery, signs]);

  useEffect(() => {
    let interval;
    if (isPlaying && selectedSign && selectedSign.video_frames.length > 0) {
      interval = setInterval(() => {
        setCurrentFrameIndex(prev => 
          prev >= selectedSign.video_frames.length - 1 ? 0 : prev + 1
        );
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedSign]);

  const fetchSigns = async () => {
    setIsLoading(false);
    setSigns([]);
    setFilteredSigns([]);
  };

  const handleDelete = async () => {
    if (!signToDelete) return;
    setSigns(prev => prev.filter(s => s.id !== signToDelete.id));
    setDeleteConfirmOpen(false);
    setSignToDelete(null);
    // notification removed
  };

  const openSignViewer = (sign) => {
    setSelectedSign(sign);
    setCurrentFrameIndex(0);
    setIsPlaying(false);
  };

  const closeSignViewer = () => {
    setSelectedSign(null);
    setIsPlaying(false);
    setCurrentFrameIndex(0);
  };

  return (
    <>
      <Helmet>
        <title>My Custom Signs - ISL Recognition Gallery</title>
        <meta name="description" content="View and manage your custom Indian Sign Language signs collection." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Custom Signs</h1>
              <p className="text-gray-600">Manage your personal sign language collection</p>
            </div>
            <Link to="/custom-recorder">
              <Button>Record New Sign</Button>
            </Link>
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search signs by name or meaning..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white text-gray-900"
              />
            </div>
          </div>

          {/* Gallery */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredSigns.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSigns.map(sign => (
                <div key={sign.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                  <div 
                    className="aspect-video bg-gray-200 cursor-pointer relative group"
                    onClick={() => openSignViewer(sign)}
                  >
                    {sign.video_frames && sign.video_frames.length > 0 ? (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Preview unavailable
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No frames
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{sign.sign_name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{sign.sign_meaning}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{sign.video_frames?.length || 0} frames</span>
                      <span>{new Date(sign.created).toLocaleDateString()}</span>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSignToDelete(sign);
                        setDeleteConfirmOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">
                {searchQuery ? 'No signs found matching your search' : 'No custom signs yet'}
              </p>
              {!searchQuery && (
                <Link to="/custom-recorder">
                  <Button>Record Your First Sign</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sign Viewer Dialog */}
      {selectedSign && (
        <Dialog open={!!selectedSign} onOpenChange={closeSignViewer}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedSign.sign_name}</DialogTitle>
              <DialogDescription>{selectedSign.sign_meaning}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Preview unavailable
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Frame {currentFrameIndex + 1} of {selectedSign.video_frames?.length || 0}
                </span>
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  variant="outline"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={closeSignViewer} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{signToDelete?.sign_name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomSignGalleryPage;