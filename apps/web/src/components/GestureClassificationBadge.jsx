import React from 'react';
import { Hand, ThumbsUp, Pause as Peace, Pointer, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const GestureClassificationBadge = ({ gesture, className = '' }) => {
  if (!gesture) return null;

  const getGestureIcon = () => {
    switch (gesture) {
      case 'Thumbs Up':
        return <ThumbsUp className="w-4 h-4" />;
      case 'Peace Sign':
        return <Peace className="w-4 h-4" />;
      case 'Pointing':
        return <Pointer className="w-4 h-4" />;
      case 'Closed Fist':
        return <Circle className="w-4 h-4" />;
      case 'Open Hand':
        return <Hand className="w-4 h-4" />;
      default:
        return <Hand className="w-4 h-4" />;
    }
  };

  const getGestureColor = () => {
    switch (gesture) {
      case 'Thumbs Up':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Peace Sign':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Pointing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Closed Fist':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Open Hand':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-2 px-3 py-1.5 ${getGestureColor()} ${className}`}
    >
      {getGestureIcon()}
      <span className="font-medium">{gesture}</span>
    </Badge>
  );
};

export default GestureClassificationBadge;
export { GestureClassificationBadge };