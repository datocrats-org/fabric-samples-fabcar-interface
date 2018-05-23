import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App';
import config from 'react-global-configuration';
config.set({ apiurl: 'http://82.196.13.98:3001' });
//config.set({ apiurl: 'http://localhost:3001' });

render((
    <BrowserRouter>
    <App />
    </BrowserRouter>
), document.getElementById('root'));
