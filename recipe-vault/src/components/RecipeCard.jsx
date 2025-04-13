import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addFavorite, removeFavorite } from '../features/recipes/recipeSlice';
import { FaHeart, FaRegHeart, FaClock, FaUtensils, FaFire } from 'react-icons/fa';
import '../styles/RecipeCard.css';

export default function RecipeCard({ recipe }) {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.recipes.favorites);
  const isFavorite = favorites.some(fav => fav.id === recipe.id);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite(recipe.id));
    } else {
      dispatch(addFavorite(recipe));
    }
  };

  const formatTime = (minutes) => {
    if (!minutes) return 'No cooking time specified';
    return minutes > 60 
      ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` 
      : `${minutes}m`;
  };

  return (
    <div className="recipe-card">
      <Link to={`/recipe/${recipe.id}`} className="recipe-link">
        <div className="recipe-image-container">
          <img 
            src={recipe.imageBase64 || recipe.image || '/images/placeholder-food.jpg'} 
            alt={recipe.title}
            loading="lazy"
            className="recipe-image"
          />
          <button 
            onClick={handleFavorite}
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? (
              <FaHeart className="heart-icon" />
            ) : (
              <FaRegHeart className="heart-icon" />
            )}
          </button>
          {recipe.category && (
            <div className="category-badge">
              {recipe.category}
            </div>
          )}
        </div>
        <div className="recipe-content">
          <h3 className="recipe-title">{recipe.title}</h3>
          <div className="recipe-meta">
            <div className="meta-item">
              <FaClock className="meta-icon" />
              <span>{formatTime(recipe.cookingTime)}</span>
            </div>
            
            <div className="meta-item">
              <FaUtensils className="meta-icon" />
              <span>{recipe.servings || 'No listed portions'} portions</span>
            </div>
            
            {recipe.calories && (
              <div className="meta-item">
                <FaFire className="meta-icon" />
                <span>{recipe.calories} kcal</span>
              </div>
            )}
          </div>
          {recipe.authorName && (
            <div className="author-info">
              <span>от {recipe.authorName}</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}