/* eslint-disable camelcase */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from 'app/services/api/';

export const saveOne = createAsyncThunk('message/saveOne', async (data, { dispatch }) => {
  const request = { ...data };

  const response = await ApiService.doPost('/messages', request);

  return { success: response.success, loading: false, error: !response.success };
});

export const updateOne = createAsyncThunk(
  'message/updateOne',
  async ({ data, uid }, { dispatch, getState }) => {
    const request = { ...data };

    const response = await ApiService.doPut(`/messages/${uid}`, request);

    return { success: response.success, loading: false, error: !response.success };
  }
);

export const deleteOne = createAsyncThunk('message/deleteOne', async ({ uid }, { dispatch }) => {
  const response = await ApiService.doDelete(`/messages/${uid}`);

  return { success: response.success, error: !response.success, loading: false };
});

const initialState = {
  success: false,
  error: false,
  loading: false,
  title: '',
  detail: '',
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    newData: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          title: '',
          detail: '',
          error: false,
          success: false,
          loading: false,
        },
      }),
    },
    clearState: (state, action) => initialState,
    updateState: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateResponse: (state, action) => {
      state.success = action.payload.success;
      state.message = action.payload.message;
    },
    updateLoading: (state, action) => {
      state.loading = action.payload;
    },
    setOne: (state, action) => action.payload,
  },
  extraReducers: {
    // [getOne.fulfilled]: (state, action) => action.payload,
    [saveOne.fulfilled]: (state, action) => action.payload,
    [updateOne.fulfilled]: (state, action) => action.payload,
    [deleteOne.fulfilled]: (state, action) => action.payload,
  },
});

export const { newData, updateResponse, updateLoading, setOne } = messageSlice.actions;

export default messageSlice.reducer;
