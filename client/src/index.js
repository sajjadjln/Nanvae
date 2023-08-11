import React from 'react';
import ReactDOM from 'react-dom';
import './App/layout/styles.css';
import App from './App/layout/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './App/store/configureStore';
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const root = document.getElementById('root');

ReactDOM.render(
  <React.StrictMode>

    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>

  </React.StrictMode>,
  root
);

reportWebVitals();
