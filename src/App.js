import React from "react";
import Weather from "./weather";

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

