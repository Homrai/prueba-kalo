import { createSlice } from "@reduxjs/toolkit";

const initialState=[];

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        addUser: (state,action)=>{
            state[0]=action.payload;
        },
        cerrar: (state,action)=>{
            state.pop();
        }
    }
});

export const {addUser,cerrar}= userSlice.actions;

export default userSlice.reducer;