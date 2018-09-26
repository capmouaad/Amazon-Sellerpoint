import { createStore, applyMiddleware, compose } from 'redux';
import { persistReducer, persistStore } from 'redux-persist'
import reducers from '../reducers/index';
import localforage from 'localforage'

const persistConfig = {
  key: 'root',
  storage: localforage,
  blacklist: ['dashFilter', 'statusBar']
}

const createStoreWithMiddleware = compose(
  applyMiddleware()
)(createStore);

const persistedReducer = persistReducer(persistConfig, reducers)

const store = createStoreWithMiddleware(persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const persistor = persistStore(store)

export {
  store,
  persistor
}
