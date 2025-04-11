import { useDispatch } from 'react-redux';
import { addFavorite, removeFavorite } from '../features/recipes/recipeSlice';
import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe, isFavorite }) {
  const dispatch = useDispatch();

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
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? '★' : '☆'}
      </button>
      
      <Link to={`/recipe/${recipe.id}`}>
        <img 
          src={recipe.image || '/placeholder-food.jpg'} 
          alt={recipe.title}
          loading="lazy"
        />
        <h3>{recipe.title}</h3>
        <p className="category">{recipe.category}</p>
      </Link>
    </div>
  );
}