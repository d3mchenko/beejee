import {configureStore} from "@reduxjs/toolkit";
import userReducer from '../redux/slices/userSlice';
import tasksReducer from './slices/tasksSlice';

const reducer = {
    userReducer,
    tasksReducer
}

export const store = configureStore({
    reducer,
})