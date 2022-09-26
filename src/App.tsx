import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ApplyLayout from './components/ui/ApplyLayout';
import HomePage from './components/home/HomPage';

function App() {
  const notFoundPage = (
    <div>
      <h1>Why you here.. 404!!</h1>
    </div>
  );

  return (
    <ApplyLayout>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='*' element={notFoundPage} />
      </Routes>
    </ApplyLayout>
  );
}

export default App;
