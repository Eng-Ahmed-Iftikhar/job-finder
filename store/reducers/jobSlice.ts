import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jobsApi, SuggestedJobResponseItem } from "@/api/services/jobsApi";

export interface JobState {
  jobs: SuggestedJobResponseItem[];
  savedJobsIds: string[];
  savedJobs: SuggestedJobResponseItem[];
  appliedJobs: SuggestedJobResponseItem[];
  appliedJobsIds: string[];
}

const initialState: JobState = {
  jobs: [],
  savedJobsIds: [],
  savedJobs: [],
  appliedJobs: [],
  appliedJobsIds: [],
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<SuggestedJobResponseItem[]>) => {
      state.jobs = action.payload;
    },
    addSavedJobId: (state, action: PayloadAction<string>) => {
      if (!state.savedJobsIds.includes(action.payload)) {
        state.savedJobsIds.push(action.payload);
      }
    },
    removeSavedJobId: (state, action: PayloadAction<string>) => {
      state.savedJobsIds = state.savedJobsIds.filter(
        (id) => id !== action.payload
      );
    },
    clearJobs: (state) => {
      state.jobs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Capture suggested jobs
      .addMatcher(
        jobsApi.endpoints.getSuggestedJobs.matchFulfilled,
        (state, action) => {
          const payload = action.payload;

          const page = payload.page;

          if (page && page > 1) {
            const existingIds = new Set(state.jobs.map((j) => String(j.id)));
            const newItems = payload.data.filter(
              (j) => !existingIds.has(String(j.id))
            );
            state.jobs = [...state.jobs, ...newItems];
          } else {
            state.jobs = payload.data;
          }
        }
      )
      // On saveJob success, record saved job id
      .addMatcher(jobsApi.endpoints.saveJob.matchFulfilled, (state, action) => {
        // The request arg contains the jobId we sent
        const jobId = (action as any).meta?.arg?.originalArgs?.jobId as
          | string
          | undefined;
        if (jobId && !state.savedJobsIds.includes(jobId)) {
          state.savedJobsIds.push(jobId);
        }
      })
      .addMatcher(
        jobsApi.endpoints.getSavedJobIds.matchFulfilled,
        (state, action) => {
          state.savedJobsIds = action.payload;
        }
      )
      .addMatcher(
        jobsApi.endpoints.getSavedJobs.matchFulfilled,
        (state, action) => {
          const payload = action.payload;
          const page = payload.page;

          if (page && page > 1) {
            const existingIds = new Set(
              state.savedJobs.map((j) => String(j.id))
            );
            const newItems = payload.data.filter(
              (j) => !existingIds.has(String(j.id))
            );
            state.savedJobs = [...state.savedJobs, ...newItems];
            state.savedJobsIds = [
              ...state.savedJobsIds,
              ...newItems.map((j) => String(j.id)),
            ];
          } else {
            state.savedJobs = payload.data;
            state.savedJobsIds = payload.data.map((j) => String(j.id));
          }
        }
      )
      .addMatcher(
        jobsApi.endpoints.unsaveJob.matchFulfilled,
        (state, action) => {
          const jobId = (action as any).meta?.arg?.originalArgs?.jobId as
            | string
            | undefined;
          if (jobId) {
            state.savedJobsIds = state.savedJobsIds.filter(
              (id) => id !== jobId
            );
            state.savedJobs = state.savedJobs.filter(
              (job) => String(job.id) !== jobId
            );
          }
        }
      )
      .addMatcher(
        jobsApi.endpoints.getAppliedJobs.matchFulfilled,
        (state, action) => {
          const payload = action.payload;
          const page = payload.page;

          if (page && page > 1) {
            const existingIds = new Set(
              state.appliedJobs.map((j) => String(j.id))
            );
            const newItems = payload.data.filter(
              (j) => !existingIds.has(String(j.id))
            );
            state.appliedJobs = [...state.appliedJobs, ...newItems];
            state.appliedJobsIds = [
              ...state.appliedJobsIds,
              ...newItems.map((j) => String(j.id)),
            ];
          } else {
            state.appliedJobs = payload.data;
            state.appliedJobsIds = payload.data.map((j) => String(j.id));
          }
        }
      );
  },
});

export const { setJobs, addSavedJobId, removeSavedJobId, clearJobs } =
  jobSlice.actions;

export default jobSlice.reducer;

// Selectors
export const selectJobs = (state: any) =>
  state.job.jobs as SuggestedJobResponseItem[];
export const selectSavedJobsIds = (state: any) =>
  state.job.savedJobsIds as string[];
export const selectSavedJobs = (state: any) =>
  state.job.savedJobs as SuggestedJobResponseItem[];

export const selectAppliedJobs = (state: any) =>
  state.job.appliedJobs as SuggestedJobResponseItem[];
