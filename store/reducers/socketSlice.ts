// src/store/socketSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface SocketState {
  connected: boolean;
}

const initialState: SocketState = {
  connected: false,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    socketConnected(state) {
      state.connected = true;
    },
    socketDisconnected(state) {
      state.connected = false;
    },
  },
});

export const { socketConnected, socketDisconnected } = socketSlice.actions;

export const selectSocketConnected = (state: { socket: SocketState }) =>
  state.socket.connected;

export default socketSlice.reducer;
