import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Home from './pages/Home/Home';
import AddRecipe from './pages/AddRecipe/AddRecipe';
import RecipeDetails from './pages/RecipeDetails/RecipeDetails';
import Favorites from './pages/Favorites/Favorites';
import Navbar from './components/Navbar';
import MyRecipes from './components/MyRecipes';
import EditRecipe from './components/EditRecipe';
import Login from './pages//Login/Login';
import Register from './pages/Register/Register'; 
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/my-recipes" element={<MyRecipes />} />
            <Route path="/edit-recipe/:recipeId" element={<EditRecipe />} />
            <Route path="/login" element={<Login />} /> 
            <Route path="/register" element={<Register />} /> 
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
