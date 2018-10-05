import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';

import lively from './services/lively';

ReactDOM.render(
    <Provider store={lively.store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
