import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Config from "../../config/config";
import axiosInstance from "../../config/axios.instance";

const initialState = {
    tasks: [],
}

const baseURL = Config.getBaseUrl();

export const getTasks = createAsyncThunk(
    'tasks/getAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${baseURL}/tasks/get-all`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
)

export const createTask = createAsyncThunk(
    'tasks/create',
    async (taskData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${baseURL}/tasks/create`, taskData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
)

export const editTask = createAsyncThunk(
    'tasks/edit',
    async (taskData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/tasks/edit/${taskData.id}`, taskData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
)

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setSortedTasks(state, action) {
            state.tasks = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getTasks.fulfilled, (state, action) => {
            state.tasks = action.payload;
        })

        builder.addCase(createTask.fulfilled, (state, action) => {
            state.tasks.push(action.payload);
        })

        builder.addCase(editTask.fulfilled, (state, action) => {
            const indexEditedTask = state.tasks.findIndex((task) => task.id === action.payload.id);
            state.tasks.splice(indexEditedTask, 1, action.payload);
        })
    }
})

export const { setSortedTasks } = tasksSlice.actions;
export default tasksSlice.reducer