import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IState } from "./types";
import axios from "axios";

const initialState: IState = {
    list: [],
};

export const getAllStudents = createAsyncThunk("students/get", async () => {
    const response = await axios.get("http://localhost:3004/students"); 
    return response.data;
});

const studentsSlice = createSlice({
    name: "students",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllStudents.fulfilled, (state, action) => {
            state.list = action.payload;
        });
    },
});

export const studentReducer = studentsSlice.reducer;
