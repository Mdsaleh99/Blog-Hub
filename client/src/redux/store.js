import { configureStore, combineReducers } from '@reduxjs/toolkit'
import useReducer from './user/userSlice'
import themeReducer from './theme/themeSlice'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { persistStore } from 'redux-persist'



const rootReducer = combineReducers({
  user: useReducer,
  theme: themeReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  version: 1
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
  // https://redux-toolkit.js.org/api/getDefaultMiddleware#included-default-middleware
})

export const persistor = persistStore(store)



/**
 * 
 * 
 * Usage: Once set up, redux-persist automatically saves your Redux state whenever it changes and loads it back when the app starts. You don't need to manually manage saving and loading state.

Integration with React: In a React app, you use the PersistGate component to ensure your app only renders once the saved state has been loaded. This prevents your app from rendering with incomplete or missing data.

Overall, redux-persist simplifies the process of persisting and rehydrating your Redux state, making it easier to create apps that remember user preferences and maintain state across sessions or page refreshes.
 * 
 * 
 * 
 * 
 * 
 * 
 * getDefaultMiddleware: This is a function provided by Redux Toolkit that returns an array of default middleware used by Redux.
(getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }): This is an arrow function that takes getDefaultMiddleware as a parameter and returns an array of middleware. By default, Redux's serializable state check middleware ensures that the state is serializable. However, in some cases, such as when persisting the state using redux-persist, the state may contain non-serializable values (e.g., functions, Date objects). Disabling the serializable state check with { serializableCheck: false } allows the store to accept non-serializable state without throwing errors.
middleware: This property in configureStore allows you to override the default middleware with custom middleware or modify its behavior. In this case, we're using it to disable the serializable state check middleware by passing { serializableCheck: false } as an option to getDefaultMiddleware.
 * 
 */