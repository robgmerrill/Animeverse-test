import { useEffect, useState } from 'react';
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './components/homepage';

export default function App() {
  const [serverData, setServerData] = useState('');

  useEffect(() => {
    async function readServerData() {
      const resp = await fetch('/api/hello');
      const data = await resp.json();

      console.log('Data from server:', data);

      setServerData(data.message);
    }

    readServerData();
  }, []);

  return (
    <>
      <HomePage></HomePage>
      <h1>{serverData}</h1>
    </>
  );
}
