
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './css/App.css';
import Aside from './layouts/aside/Aside';
import Content from './layouts/content/Content';




function App() {

    return (
        <div className="flex min-h-screen bg-peaches overflow-x-hidden">
            <BrowserRouter>
                <Aside/>
                <Content/>
            </BrowserRouter>
        </div>
    );
}

export default App;
