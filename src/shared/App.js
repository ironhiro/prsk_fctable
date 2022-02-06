import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {Home, FcTable,Page} from '../pages';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" 
        element={<Home />} />
        <Route path="/fcTable" element={<FcTable title="프로젝트 세카이 기록체크표"/>} />
      </Routes>
    </div>
  );
}

export default App;
