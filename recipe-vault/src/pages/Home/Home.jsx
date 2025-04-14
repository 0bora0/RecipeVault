import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadRecipes } from '../../features/recipes/recipeSlice';
import RecipeCard from '../../components/RecipeCard';
import Loader from '../../components/Loader';
import { Link } from 'react-router-dom';
import { FaPlusCircle } from 'react-icons/fa';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Home.css';
import '../../App.css';
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
    <>
      <Header />
    <div className="home-page">
      <Link to="/add-recipe" className="floating-add-btn">
        <FaPlusCircle />
      </Link>
      <div className="hero-section">
        <div className="hero-content">
          <h1>RecipeVault</h1>
          <p>Discover and save your favorite culinary creations</p>
        </div>
      </div>

      <div className="main-content">
        {loading && <Loader />}

        {error && (
          <div className="error-message">
            <i className="bi bi-exclamation-triangle"></i> Грешка: {error.message}
          </div>
        )}

        {!loading && recipes.length === 0 && (
          <div className="empty-state">
            <img src="/images/empty-recipes.svg" alt="No recipes" />
            <h3>No results available</h3>
            <p>Try different search criteria or add a new recipe</p>
            <Link to="/add-recipe" className="add-recipe-btn">
              <FaPlusCircle /> Add your first recipe
            </Link>
          </div>
        )}
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
    <Footer />
    </>
  );
}