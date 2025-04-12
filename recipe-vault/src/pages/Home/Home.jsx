import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadRecipes } from '../../features/recipes/recipeSlice';
import RecipeCard from '../../components/RecipeCard';
import SearchAndFilter from '../../components/SearchAndFilter'; 
import Loader from '../../components/Loader';
import { Link } from 'react-router-dom';
import { FaPlusCircle, FaSearch } from 'react-icons/fa';
import './Home.css';

export default function Home() {
  const dispatch = useDispatch();
  const {
    recipes,
    favorites,
    loading,
    error,
    searchQuery,
    selectedCategory
  } = useSelector(state => state.recipes);

  useEffect(() => {
    dispatch(loadRecipes({ query: searchQuery, category: selectedCategory }));
  }, [dispatch, searchQuery, selectedCategory]);

  return (
    <div className="home-page">
      {/* Floating Add Recipe Button (mobile only) */}
      <Link to="/add-recipe" className="floating-add-btn">
        <FaPlusCircle />
      </Link>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>RecipeVault</h1>
          <p>Открий и запази любимите си кулинарни творения</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <SearchAndFilter />
          </div>
          <Link to="/add-recipe" className="add-recipe-btn">
            <FaPlusCircle /> Добави рецепта
          </Link>
        </div>

        {/* Loading and Error States */}
        {loading && <Loader />}

        {error && (
          <div className="error-message">
            <i className="bi bi-exclamation-triangle"></i> Грешка: {error.message}
          </div>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && (
          <div className="empty-state">
            <img src="/images/empty-recipes.svg" alt="Няма рецепти" />
            <h3>Няма намерени рецепти</h3>
            <p>Опитайте с различни критерии за търсене или добавете нова рецепта</p>
            <Link to="/add-recipe" className="add-recipe-btn">
              <FaPlusCircle /> Добави първата рецепта
            </Link>
          </div>
        )}

        {/* Recipes Grid */}
        <div className="recipes-grid">
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={favorites.some(fav => fav.id === recipe.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}