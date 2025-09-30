import React, { useState, useRef, useEffect, useCallback } from 'react';

const DraggablePhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [highestZ, setHighestZ] = useState(10);
  const dragRef = useRef({ startX: 0, startY: 0, photoX: 0, photoY: 0 });

  // Photo URLs from scraps folder
  const photoUrls = [
    require('./scraps/IMG_0110-1.png'),
    require('./scraps/premium_photo-1751306746683-c5c455c22f9f.png'),
    require('./scraps/IMG_0111-1.png'),
    require('./scraps/IMG_0112-1.png'),
    require('./scraps/IMG_0113-1.png'),
    require('./scraps/IMG_7963-2.png'),
    require('./scraps/IMG_8147-6.png'),
    require('./scraps/IMG_7975-141.png'),
    require('./scraps/IMG_7962-1.png'),
    require('./scraps/IMG_7962-2.png'),
    require('./scraps/IMG_7967-6.png'),
    require('./scraps/IMG_7965-4.png'),
    require('./scraps/IMG_7968-7.png'),

    require('./scraps/IMG_23981.png'),
    require('./scraps/IMG_23982.png'),
    require('./scraps/IMG_23983.png'),
    require('./scraps/annie-spratt-jgAm_HHpth0-unsplash.jpg'),
  ];

  useEffect(() => {
    // Saved positions as percentages of viewport (based on your arrangement)
    const savedPositions = [
      { xPercent: 0.21, yPercent: 6.33, z: 36 },   // Photo 1
      { xPercent: 11.49, yPercent: 8.68, z: 120 }, // Photo 2
      { xPercent: 42.01, yPercent: -9.01, z: 97 }, // Photo 3
      { xPercent: 7.90, yPercent: -3.67, z: 89 },  // Photo 4
      { xPercent: 83.66, yPercent: 35.58, z: 101 }, // Photo 5
      { xPercent: 75.76, yPercent: 2.18, z: 118 }, // Photo 6
      { xPercent: 87.74, yPercent: -1.38, z: 117 }, // Photo 7
      { xPercent: 24.16, yPercent: -4.71, z: 90 }, // Photo 8
      { xPercent: 85.85, yPercent: 57.36, z: 69 }, // Photo 9
      { xPercent: 11.52, yPercent: 72.75, z: 104 }, // Photo 10
      { xPercent: 28.66, yPercent: 80.09, z: 110 }, // Photo 11
      { xPercent: 45.58, yPercent: 72.61, z: 111 }, // Photo 12
      { xPercent: 57.68, yPercent: -2.07, z: 119 }, // Photo 13
      { xPercent: 78.85, yPercent: 74.69, z: 115 }, // Photo 14
      { xPercent: 62.95, yPercent: 77.10, z: 116 }, // Photo 15
      { xPercent: 5.75, yPercent: 46.15, z: 40 },  // Photo 16
      { xPercent: -6.75, yPercent: 40.17, z: 34 }, // Photo 17
    ];

    // Small screen positions as percentages (based on 390x844 reference screen)
    const smallScreenPositions = [
      { xPercent: -39.53, yPercent: 3.95, z: 202 },   // Photo 1
      { xPercent: -15.87, yPercent: -5.35, z: 205 },  // Photo 2
      { xPercent: 76.57, yPercent: 9.75, z: 170 },    // Photo 3
      { xPercent: -32.10, yPercent: -5.35, z: 164 },  // Photo 4
      { xPercent: -57.07, yPercent: 21.14, z: 203 },  // Photo 5
      { xPercent: 93.89, yPercent: 55.40, z: 197 },   // Photo 6
      { xPercent: -27.10, yPercent: 65.94, z: 185 },  // Photo 7
      { xPercent: -49.07, yPercent: 47.54, z: 158 },  // Photo 8
      { xPercent: 80.96, yPercent: 29.30, z: 192 },   // Photo 9
      { xPercent: 88.64, yPercent: 25.64, z: 196 },   // Photo 10
      { xPercent: 71.68, yPercent: 68.03, z: 190 },   // Photo 11
      { xPercent: -33.25, yPercent: 50.76, z: 183 },  // Photo 12
      { xPercent: 22.04, yPercent: -4.27, z: 169 },   // Photo 13
      { xPercent: 67.00, yPercent: 64.73, z: 194 },   // Photo 14
      { xPercent: 11.97, yPercent: 76.04, z: 191 },   // Photo 15
      { xPercent: -16.36, yPercent: -12.58, z: 165 }, // Photo 16
      { xPercent: 93.41, yPercent: -26.95, z: 149 },  // Photo 17
    ];

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isSmallScreen = width < 1080;

    const initialPhotos = photoUrls.map((url, index) => {
      const position = isSmallScreen ? smallScreenPositions[index] : savedPositions[index];
      return {
        id: index,
        url,
        x: (position.xPercent / 100) * width,
        y: (position.yPercent / 100) * height,
        z: position.z,
      };
    });

    setPhotos(initialPhotos);

    // Set highestZ to the maximum z value in the initial positions
    const positions = isSmallScreen ? smallScreenPositions : savedPositions;
    const maxZ = Math.max(...positions.map(p => p.z));
    setHighestZ(maxZ);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseDown = (e, photo) => {
    e.preventDefault();
    setDragging(photo.id);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      photoX: photo.x,
      photoY: photo.y,
    };

    // Bring photo to front
    const newZ = highestZ + 1;
    setHighestZ(newZ);
    setPhotos(prev =>
      prev.map(p => (p.id === photo.id ? { ...p, z: newZ } : p))
    );
  };

  const handleMouseMove = useCallback((e) => {
    if (dragging === null) return;

    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;

    setPhotos(prev =>
      prev.map(p =>
        p.id === dragging
          ? {
              ...p,
              x: dragRef.current.photoX + deltaX,
              y: dragRef.current.photoY + deltaY,
            }
          : p
      )
    );
  }, [dragging]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="w-full h-screen  overflow-hidden absolute top-0">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="absolute cursor-move ntransition-shadow rounded-lg overflow-hidden"
          style={{
            position: 'absolute',
            left: `${photo.x}px`,
            top: `${photo.y}px`,
            zIndex: photo.z,
            transform: dragging === photo.id ? 'scale(1.02)' : 'scale(1)',
            transition: dragging === photo.id ? 'none' : 'transform 0.2s',
          }}
          onMouseDown={(e) => handleMouseDown(e, photo)}
        >
          <img
            src={photo.url}
            alt={`Photo ${photo.id + 1}`}
            className="pointer-events-none select-none"
            style={{ maxWidth: '300px' }}
            draggable="false"
          />
        </div>
      ))}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
        <p className="text-sm text-gray-700">Click and drag photos to move them around</p>
      </div>
    </div>
  );
};

export default DraggablePhotos;