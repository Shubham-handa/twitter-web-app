import { applyMiddleware, createStore } from "redux";
import thunk  from 'redux-thunk';
import {reducers} from './reducers';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const persistConfig = {
    key:'main-root',
    storage,
}

const persistedReducer = persistReducer(persistConfig,reducers);

const store = createStore (persistedReducer, {}, applyMiddleware(thunk));

const Persistor = persistStore(store);

export{Persistor};
export default store;