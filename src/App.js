import React from "react";
import Weather from "./weather";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';

function App() {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" exact component={Weather} />
    //     <Route path="/fullweatherpage" component={Fullpage} />
    //   </Routes>
    // </Router>
    <div>
      <Weather />
    </div>
    
  );
}

export default App;

