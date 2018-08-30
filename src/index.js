import React from 'react'
import { hydrate, render} from 'react-dom'
import { Provider } from 'react-redux'
import { persistor, store } from './store/store'
import App from './App'
import { PersistGate } from 'redux-persist/integration/react'
import './css/app.css';
import 'font-awesome/css/font-awesome.min.css'

// hyndrate is a method for react-snap for a simple Server side rendering=
const rootElement = document.getElementById('root');
if ( rootElement.hasChildNodes() ){
  hydrate(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>,
    rootElement
  );
} else{
  render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>,
    rootElement
  )
}
