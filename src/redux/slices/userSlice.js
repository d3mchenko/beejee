import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../config/axios.instance";
import TokenService from "../../services/tokenService";
import Config from "../../config/config";

const baseURL = Config.getBaseUrl();

const initialState = {
    login: "",
    isAdmin: false,

    isLogin: !!TokenService.getToken(),
}

export const loginUser = createAsyncThunk(
    'user/login',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${baseURL}/user/login`, userData);
            return response.data;
        } catch (err){
            return rejectWithValue(err.response.data);
        }
    }
)

export const getUser = createAsyncThunk(
    'user/getUserData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/user/get-data`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            const { login, isAdmin, accessToken } = action.payload;
            state.login = login;
            state.isLogin = true;
            state.isAdmin = isAdmin;

            TokenService.setToken(accessToken);
        },
        logoutUser(state) {
            state.login = '';
            state.isLogin = false;
            state.isAdmin = false;

            TokenService.removeToken();
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.fulfilled, (state, action) => {
            userSlice.caseReducers.setUser(state, action);
        })

        builder.addCase(getUser.fulfilled, (state, action) => {
            userSlice.caseReducers.setUser(state, action);
        })
    }
})

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;