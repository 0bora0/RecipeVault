import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addFavorite, removeFavorite } from '../features/recipes/recipeSlice';
import { FaHeart, FaRegHeart, FaClock, FaUtensils, FaFire, FaTrash } from 'react-icons/fa';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import '../styles/RecipeCard.css';

export default function RecipeCard({ recipe, isFavorite, onDelete }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Safely get currentUser from Redux store
  const currentUser = useSelector(state => {
    // Try different possible paths to currentUser in your Redux store
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

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this recipe?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteDoc(doc(db, "recipes", recipe.id));
              
              if (onDelete) {
                onDelete(recipe.id);
              }
              
              toast.success('Recipe deleted successfully!', {
                position: "bottom-right",
                autoClose: 3000,
              });
              
              if (window.location.pathname.includes(`/my-recipe/${recipe.id}`)) {
                navigate('/my-recipes');
              }
            } catch (error) {
              console.error('Error deleting recipe:', error);
              toast.error('Failed to delete recipe', {
                position: "bottom-right",
                autoClose: 3000,
              });
            }
          }
        },
        {
          label: 'No'
        }
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
      overlayClassName: "confirm-overlay",
    });
  };

  const formatTime = (minutes) => {
    if (!minutes) return 'No cooking time specified';
    return minutes > 60 
      ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` 
      : `${minutes}m`;
  };

  // Safely check if current user is the author
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
              <span>{recipe?.servings || 'N/A'} portions</span>
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