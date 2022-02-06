import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import App from '../shared/App';

const Root = () =>(
    <BrowserRouter basename={process.env.PUBLIC_URL}>
        <App/>
    </BrowserRouter>
);

export default Root;