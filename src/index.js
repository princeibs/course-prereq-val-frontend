import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className='bg-primary-50'>
      <App />
    </div>
  </React.StrictMode>
);