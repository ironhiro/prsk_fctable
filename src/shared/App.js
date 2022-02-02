import React, {useRef} from 'react';
import {Routes, Route} from 'react-router-dom';
import {Home, FcTable} from '../pages';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/fcTable" element={<FcTable/>} />
      </Routes>
    </div>
  );
}

export default App;
