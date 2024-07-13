import { createSlice } from '@reduxjs/toolkit';

const idSlice = createSlice({
    name: 'eid',
    initialState: {
        issend: '',
        isrece: ''
    },
    reducers: {
        setSendid: (state,action) => {
            state.issend = action.payload
        },
        setReceiverId: (state,action) => {
            state.isrece = action.payload
        }
    },
})

export const {setSendid,setReceiverId} = idSlice.actions;
export default idSlice.reducer; 