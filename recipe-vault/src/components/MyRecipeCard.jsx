import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addFavorite, removeFavorite } from '../features/recipes/recipeSlice';
import { FaHeart, FaRegHeart, FaClock, FaUtensils, FaFire, FaTrash } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import '../styles/RecipeCard.css';

export default function RecipeCard({ recipe, isFavorite, onDelete }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const currentUser = useSelector(state => {
    return state?.auth?.currentUser || 
           state?.user?.currentUser || 
           state?.recipes?.currentUser || 
           null;
  });

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite(recipe.id));
    } else {
      dispatch(addFavorite(recipe));
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this recipe?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            if (!recipe.id) {
              console.error("Recipe ID is missing");
              toast.error("Cannot delete recipe - missing ID", {
                position: "bottom-right",
                autoClose: 3000,
              });
              return;
            }
            onDelete(recipe.id);
          }
        },
        {
          label: 'No'
        }
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
    });
  };

  const formatTime = (minutes) => {
    if (!minutes) return 'No cooking time specified';
    return minutes > 60 
      ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` 
      : `${minutes}m`;
  };
  const showDeleteButton = currentUser?.uid === recipe?.authorId;

  return (
    <div className="recipe-card">
      <Link to={`/my-recipe/${recipe.id}`} className="recipe-link">
        <div className="recipe-image-container">
          <img 
            src={recipe?.imageBase64 || recipe?.image || './images/food.jpg'} 
            alt={recipe?.title || 'Recipe image'}
            loading="lazy"
            className="recipe-image"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = './images/food.jpg'
            }}
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
          {recipe?.category && (
            <div className="category-badge">
              {recipe.category}
            </div>
          )}
        </div>
        <div className="recipe-content">
          <h3 className="recipe-title">{recipe?.title || 'Untitled Recipe'}</h3>
          <div className="recipe-meta">
            <div className="meta-item">
              <FaClock className="meta-icon" />
              <span>{formatTime(recipe?.cookingTime || recipe?.readyInMinutes)}</span>
            </div>
            
            <div className="meta-item">
              <FaUtensils className="meta-icon" />
              <span>{recipe?.servings || 'Not specified'} portions</span>
            </div>
          </div>
          {recipe?.authorName && (
            <div className="author-info">
              <span>от {recipe.authorName}</span>
              {showDeleteButton && (
                <button 
                  onClick={handleDelete}
                  className="delete-btn"
                  aria-label="Delete recipe"
                >
                  <FaTrash className="delete-icon" />
                </button>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}