import React, { useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Xarrow, { Xwrapper } from 'react-xarrows';

// Card component
const Card = ({ id, text, position, onDragEnd, onShowMore, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { id, position },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      id={`card-${id}`}
      className={`absolute bg-white shadow-lg rounded-lg p-4 cursor-move ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      style={{
        width: '200px',
        left: position.x,
        top: position.y,
      }}
      onClick={() => onClick(id)}
    >
      <p className="text-sm">{text.slice(0, 50)}...</p>
      <button
        className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
        onClick={(e) => {
          e.stopPropagation();
          onShowMore(id);
        }}
      >
        Show More
      </button>
    </div>
  );
};

// Canvas component
const Canvas = () => {
  const [cards, setCards] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectStart, setConnectStart] = useState(null);
  const nextId = useRef(1);

  const [, drop] = useDrop({
    accept: 'CARD',
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const newPosition = {
        x: Math.round(item.position.x + delta.x),
        y: Math.round(item.position.y + delta.y),
      };
      updateCardPosition(item.id, newPosition);
    },
  });

  const updateCardPosition = (id, newPosition) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, position: newPosition } : card
      )
    );
  };

  const handleShowMore = (id) => {
    const card = cards.find((c) => c.id === id);
    setSelectedCard(card);
  };

  const addNewCard = () => {
    const newCard = {
      id: nextId.current,
      text: `This is card ${nextId.current} with some dummy text.`,
      position: { x: 50, y: 50 },
    };
    setCards([...cards, newCard]);
    nextId.current += 1;
  };

  const startConnecting = () => {
    setIsConnecting(true);
  };

  const handleCardClick = (id) => {
    if (isConnecting) {
      if (!connectStart) {
        setConnectStart(id);
      } else {
        setConnections([...connections, { start: connectStart, end: id }]);
        setConnectStart(null);
        setIsConnecting(false);
      }
    }
  };

  return (
    <div className="relative w-full h-screen overflow-auto bg-gray-100 p-4">
      <div className="mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          onClick={addNewCard}
        >
          Add New Card
        </button>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            isConnecting ? 'opacity-50' : ''
          }`}
          onClick={startConnecting}
          disabled={isConnecting}
        >
          Connect Cards
        </button>
      </div>
      <div ref={drop} className="relative w-full h-full">
        <Xwrapper>
          {cards.map((card) => (
            <Card
              key={card.id}
              {...card}
              onDragEnd={updateCardPosition}
              onShowMore={handleShowMore}
              onClick={handleCardClick}
            />
          ))}
          {connections.map((connection, index) => (
            <Xarrow
              key={index}
              start={`card-${connection.start}`}
              end={`card-${connection.end}`}
              color="rgba(0, 0, 0, 0.2)"
            />
          ))}
        </Xwrapper>
      </div>
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Card Details</h2>
            <p>{selectedCard.text}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setSelectedCard(null)}
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