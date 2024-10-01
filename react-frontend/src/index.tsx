import React from 'react';
import './index.css';
import 'intro.js/introjs.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// https://github.com/plouc/nivo/issues/2415#issuecomment-1914297461
// NOTE: this doesn't seem to interfere with the library functioning
// since the default props are inserted within the component
function ignoreDefaultPropsError() {
  const originalWarn = console.error;
  console.error = (...args) => {
    if (args?.[0].includes('Warning: Failed %s type: %s%s')) {
      return;
    }
    originalWarn(...args);
  };
}

ignoreDefaultPropsError();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
