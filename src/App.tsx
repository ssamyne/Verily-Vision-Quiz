import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ApplyLayout from './components/ui/ApplyLayout';

function App() {
  const notFoundPage = (
    <div>
      <h1>Why you here.. 404!!</h1>
    </div>
  );

  return (
    <ApplyLayout>
      <Routes>
        <Route path='/' element={<div>welcome to verily quiz</div>} />
        <Route path='*' element={notFoundPage} />
      </Routes>
    </ApplyLayout>
  );
}

export default App;
