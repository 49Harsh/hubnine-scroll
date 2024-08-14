import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Rnd } from 'react-rnd';
import Xarrow from 'react-xarrows';

const Canvas = () => {
  const [cards, setCards] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const canvasRef = useRef(null);

  const addCard = () => {
    const newCard = {
      id: uuidv4(),
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      position: { x: 50, y: 50 },
      size: { width: 200, height: 150 },
    };
    setCards([...cards, newCard]);
  };

  const updateCardPosition = (id, position) => {
    setCards(cards.map(card => card.id === id ? { ...card, position } : card));
  };

  const updateCardSize = (id, size) => {
    setCards(cards.map(card => card.id === id ? { ...card, size } : card));
  };

  const addArrow = () => {
    if (cards.length < 2) return;
    const newArrow = {
      id: uuidv4(),
      start: cards[0].id,
      end: cards[1].id,
    };
    setArrows([...arrows, newArrow]);
  };

  const handleShowMore = (card) => {
    setSelectedCard(card);
    setShowPopup(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (canvasRef.current && !canvasRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-gray-100 overflow-auto p-4">
      <div className="mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={addCard}
        >
          Add Card
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={addArrow}
        >
          Add Arrow
        </button>
      </div>
      <div ref={canvasRef} className="relative w-[2000px] h-[2000px] bg-white border border-gray-300 rounded-lg">
        {cards.map((card) => (
          <Rnd
            key={card.id}
            position={card.position}
            size={card.size}
            onDragStop={(e, d) => updateCardPosition(card.id, { x: d.x, y: d.y })}
            onResizeStop={(e, direction, ref, delta, position) =>
              updateCardSize(card.id, { width: ref.style.width, height: ref.style.height })
            }
            className="bg-white shadow-lg rounded-lg p-4 cursor-move"
          >
            <div className="h-full flex flex-col justify-between">
              <p className="text-sm line-clamp-3">{card.text}</p>
              <button
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded"
                onClick={() => handleShowMore(card)}
              >
                Show More
              </button>
            </div>
          </Rnd>
        ))}
        {arrows.map((arrow) => (
          <Xarrow
            key={arrow.id}
            start={arrow.start}
            end={arrow.end}
            color="rgb(59, 130, 246)"
            strokeWidth={2}
            path="smooth"
          />
        ))}
      </div>
      {showPopup && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Card Details</h2>
            <p className="mb-4">{selectedCard.text}</p>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;