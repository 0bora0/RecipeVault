import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addFavorite, removeFavorite } from '../features/recipes/recipeSlice';

export default function RecipeCard({ recipe }) {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.recipes.favorites);
  const isFavorite = favorites.some(fav => fav.id === recipe.id);

  const handleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(recipe.id));
    } else {
      dispatch(addFavorite(recipe));
    }
  };

  return (
    <div className="recipe-card">
      <button 
        onClick={handleFavorite}
        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
      >
        {isFavorite ? '★' : '☆'}
      </button>
      
      <Link to={`/recipe/${recipe.id}`}>
        <h3>{recipe.title}</h3>
        <img 
          src={recipe.image || '/placeholder-food.jpg'} 
          alt={recipe.title}
          loading="lazy"
        />
      </Link>
    </div>
  );
}