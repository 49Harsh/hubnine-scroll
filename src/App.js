import React from 'react';
import Canvas from './Canvas';

function App() {
  return (
    <div className="App">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Drag and Drop Canvas</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Canvas />
        </div>
      </main>
    </div>
  );
}

export default App;