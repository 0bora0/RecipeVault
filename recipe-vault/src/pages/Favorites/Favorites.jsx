import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFavorite } from '../../features/recipes/recipeSlice';
import RecipeCard from '../../components/RecipeCard';

export default function Favorites() {
  const favorites = useSelector(state => state.recipes.favorites);
  const dispatch = useDispatch();

  return (
    <div className="favorites-page">
      <h1>Любими рецепти</h1>
      
      {favorites.length === 0 ? (
        <p>Нямате любими рецепти</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map(recipe => (
            <div key={recipe.id} className="favorite-item">
              <RecipeCard recipe={recipe} />
              <button 
                onClick={() => dispatch(removeFavorite(recipe.id))}
                className="remove-favorite-btn"
              >
                Премахни от любими
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}