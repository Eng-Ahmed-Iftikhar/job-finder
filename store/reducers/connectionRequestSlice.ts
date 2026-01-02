import { ConnectionRequest } from "@/types/connection-request";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { connectionRequestsApi } from "@/api/services/connectionRequestsApi";
import _ from "lodash";

interface ConnectionRequestState {
  requests: ConnectionRequest[];
  count: number;
}

const initialState: ConnectionRequestState = {
  requests: [],
  count: 0,
};

const connectionRequestSlice = createSlice({
  name: "connectionRequest",
  initialState,
  reducers: {
    addRequest(state, action: PayloadAction<ConnectionRequest>) {
      state.requests.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      connectionRequestsApi.endpoints.getMeConnectionRequests.matchFulfilled,
      (state, action) => {
        const payload = action.payload;
        if (payload.page === 1) {
          state.requests = payload.data;
        } else {
          state.requests = _.uniqBy([...state.requests, ...payload.data], "id");
        }
      }
    );
    builder.addMatcher(
      connectionRequestsApi.endpoints.getMeConnectionRequestsCount
        .matchFulfilled,
      (state, action) => {
        state.count = action.payload;
      }
    );
    builder.addMatcher(
      connectionRequestsApi.endpoints.acceptConnectionRequest.matchFulfilled,
      (state, action) => {
        const acceptedRequest = action.payload;
        state.requests = state.requests.filter(
          (request) => request.id !== acceptedRequest.id
        );
        state.count -= 1;
      }
    );
    builder.addMatcher(
      connectionRequestsApi.endpoints.rejectConnectionRequest.matchFulfilled,
      (state, action) => {
        const rejectedRequest = action.payload;
        state.requests = state.requests.filter(
          (request) => request.id !== rejectedRequest.id
        );
        state.count -= 1;
      }
    );
  },
});

export const { addRequest } = connectionRequestSlice.actions;

export const selectConnectionRequests = (state: RootState) =>
  state.connectionRequest.requests;
export const selectConnectionRequestsCount = (state: RootState) =>
  state.connectionRequest.count;

export default connectionRequestSlice.reducer;
