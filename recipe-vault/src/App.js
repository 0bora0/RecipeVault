import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Home from './pages/Home/Home';
import AddRecipe from './pages/AddRecipe/AddRecipe';
import RecipeDetails from './pages/RecipeDetails/RecipeDetails';
import Favorites from './pages/Favorites/Favorites';
import MyRecipes from './pages/MyRecipes/MyRecipes';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register'; 
import ProfileEdit from './pages/ProfileEdit/ProfileEdit';
import ProtectedRoute from './components/ProtectedRoute';
import MyRecipeDetails from './pages/MyRecipeDetails/MyRecipeDetails';
import MyRecipeCard from './components/MyRecipeCard';

import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="container">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} /> 
            <Route path="/register" element={<Register />} /> 
            <Route path="/recipe/:id" element={<RecipeDetails />} />

            {/* Protected Routes */}
            <Route path="/add-recipe" element={
              <ProtectedRoute>
                <AddRecipe />
              </ProtectedRoute>
            } />

            <Route path="/favorites" element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            } />

            <Route path="/my-recipes" element={
              <ProtectedRoute>
                <MyRecipes />
              </ProtectedRoute>
            } />

            <Route path="/profile-edit" element={
              <ProtectedRoute>
                <ProfileEdit />
              </ProtectedRoute>
            } />

            <Route path="/my-recipe-details" element={
              <ProtectedRoute>
                <MyRecipeDetails />
              </ProtectedRoute>
            } />
<Route path="/my-recipe/:id" element={<MyRecipeDetails />} />
            {/* Fallback Route */}
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
