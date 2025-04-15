import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRecipes } from "../../api/spoonacular";
import { auth } from '../../services/firebaseConfig';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

// 🆕 Вземи потребителя от localStorage
const userFromStorage = localStorage.getItem('currentUser');

export const loadRecipes = createAsyncThunk(
  "recipes/loadRecipes",
  async (searchParams, { rejectWithValue }) => {
    try {
      return await fetchRecipes(searchParams.query, searchParams.category);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "recipes/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL
      };
    } catch (error) {
      return rejectWithValue(error.code);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "recipes/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  recipes: [],
  favorites: [],
  loading: false,
  error: null,
  searchQuery: "",
  selectedCategory: "",
  currentUser: userFromStorage ? JSON.parse(userFromStorage) : null, // 🆕
  authStatus: 'idle' 
};

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setCategoryFilter: (state, action) => {
      state.selectedCategory = action.payload;
    },
    addFavorite: (state, action) => {
      const recipeId = action.payload.id;
      const alreadyExists = state.favorites.some(
        (recipe) => recipe.id === recipeId
      );
      if (!alreadyExists) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(
        (recipe) => recipe.id !== action.payload
      );
    },
    toggleFavorite: (state, action) => {
      const recipeId = action.payload.id;
      const index = state.favorites.findIndex(
        (recipe) => recipe.id === recipeId
      );

      if (index >= 0) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(action.payload);
      }
    },
    addRecipe: (state, action) => {
      state.recipes.unshift({
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(loadRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.authStatus = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authStatus = 'succeeded';
        state.currentUser = action.payload;

        // 🆕 Запази в localStorage
        localStorage.setItem('currentUser', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.authStatus = 'idle';

        // 🆕 Изтрий от localStorage
        localStorage.removeItem('currentUser');
      });
  },
});

export const {
  setSearchQuery,
  setCategoryFilter,
  addFavorite,
  removeFavorite,
  addRecipe,
  toggleFavorite,
} = recipeSlice.actions;

export default recipeSlice.reducer;
