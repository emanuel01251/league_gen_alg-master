import React, { useRef } from 'react';
import Champions from './components/champions.js';
import Header from './components/header.js';

import './App.css'
const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)


function App() {
  const myRef = useRef(null)
  const executeScroll = () => {
    scrollToRef(myRef)
  }

  return (
    <div className="App">
      <Header executeScroll={executeScroll}/>
      <Champions/>
    </div>

  );
}

export default App;
