import React from 'react';
import ReactDOM from 'react-dom';
import './App/layout/styles.css';
import App from './App/layout/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';

const root = document.getElementById('root');
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  root
);

reportWebVitals();
