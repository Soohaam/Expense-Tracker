import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';

// Async thunks
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await axios.get(`${API_URL}?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSummary = createAsyncThunk(
  'transactions/fetchSummary',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await axios.get(`${API_URL}/summary?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCategoryBreakdown = createAsyncThunk(
  'transactions/fetchCategoryBreakdown',
  async (type = '', { rejectWithValue }) => {
    try {
      const params = type ? `?type=${type}` : '';
      const response = await axios.get(`${API_URL}/breakdown${params}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, transactionData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMonthlyHeatmap = createAsyncThunk(
  'transactions/fetchMonthlyHeatmap',
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/transactions/heatmap?year=${year}&month=${month}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: [],
    summary: {
      income: 0,
      expense: 0,
      balance: 0,
    },
    categoryBreakdown: [],
    heatmapData: null, // Add this
    loading: false,
    error: null,
    filters: {
      type: '',
      category: '',
      startDate: '',
      endDate: '',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        type: '',
        category: '',
        startDate: '',
        endDate: '',
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Summary
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      })
      // Fetch Category Breakdown
      .addCase(fetchCategoryBreakdown.fulfilled, (state, action) => {
        state.categoryBreakdown = action.payload;
      })
      // Create Transaction
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Transaction
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      // Delete Transaction
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (t) => t._id !== action.payload
        );
      })

      .addCase(fetchMonthlyHeatmap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyHeatmap.fulfilled, (state, action) => {
        state.loading = false;
        state.heatmapData = action.payload;
      })
      .addCase(fetchMonthlyHeatmap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError } = transactionSlice.actions;
export default transactionSlice.reducer;