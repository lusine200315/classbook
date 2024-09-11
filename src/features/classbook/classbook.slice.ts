import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { InputLesson, InputRating, IRating, IState } from "./types";
import axios from "axios";

const initialState:IState = {
    lessons: []
};

export const addLesson = createAsyncThunk("lesson/add", async (param:InputLesson) => {
    const response = await axios.post("http://localhost:3004/lessons", param);
    return response.data;
});

export const getAllLessons = createAsyncThunk("lessons/get", async () => {
    const response = await axios.get("http://localhost:3004/lessons");
    return response.data;
});

export const addRate = createAsyncThunk("rate/add", async (param: { lessonId: number; studentId: number; rating: number }) => {
    const lessonResponse = await axios.get(`http://localhost:3004/lessons/${param.lessonId}`);
    const lesson = lessonResponse.data;

    const newRating = {
        id: Date.now().toString(),
        student: param.studentId.toString(),
        rate: param.rating.toString(),
    };

    const updatedLesson = {
        ...lesson,
        ratings: [...lesson.ratings, newRating]
    };

    const response = await axios.put(`http://localhost:3004/lessons/${param.lessonId}`, updatedLesson);
    return response.data;
});


const ClassBookSlice = createSlice({
    name:'classbook',
    initialState,
    reducers:{},
    extraReducers: (bulder) => {
        bulder
        .addCase(getAllLessons.fulfilled, (state, action) => {
            state.lessons = action.payload;
        })
        .addCase(addLesson.fulfilled, (state, action) => {
            state.lessons.push(action.payload);
        })
        .addCase(addRate.fulfilled, (state, action) => {
            const updatedLesson = action.payload;
            
            const index = state.lessons.findIndex(lesson => lesson.id === updatedLesson.id);
            if (index !== -1) {
                state.lessons[index] = updatedLesson;
            };
        });
    },
})
 
export const classReducer= ClassBookSlice.reducer