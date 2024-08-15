import React, { useState } from 'react';
import Draggable from 'react-draggable';

const Card = ({ id, text, onShowMore }) => {
  const [size, setSize] = useState({ width: 250, height: 150 }); // Increased initial size

  const truncatedText = text.length > 100 ? text.slice(0, 100) + '...' : text; // Increased character limit

  const handleResize = (e, { size }) => {
    setSize({ width: size.width, height: size.height });
  };

  return (
    <Draggable bounds="parent" handle=".handle">
      <div
        id={id}
        className="absolute bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden"
        style={{ width: size.width, height: size.height }}
      >
        <div className="handle bg-gray-100 p-2 cursor-move">Drag here</div>
        <div className="p-4 flex flex-col justify-between h-full">
          <p className="mb-2">{truncatedText}</p>
          <button
            onClick={() => onShowMore(id)}
            className="mt-auto bg-blue-500 text-white px-2 py-1 rounded self-start"
          >
            Show More
          </button>
        </div>
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-gray-300 cursor-se-resize"
          style={{ cursor: 'se-resize' }}
          onMouseDown={(e) => {
            const startSize = { width: size.width, height: size.height };
            const startPos = { x: e.clientX, y: e.clientY };

            const onMouseMove = (e) => {
              const newWidth = startSize.width + (e.clientX - startPos.x);
              const newHeight = startSize.height + (e.clientY - startPos.y);
              setSize({ width: newWidth, height: newHeight });
            };

            const onMouseUp = () => {
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
          }}
        />
      </div>
    </Draggable>
  );
};

export default Card;