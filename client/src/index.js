import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss'
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from './store/store'

//creating a concurrent root that supports concurrent rendering
const root = ReactDOM.createRoot(document.getElementById('root'));
//rendering the Application
root.render(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>
	
);
