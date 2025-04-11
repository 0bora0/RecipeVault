import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadRecipes } from '../features/recipes/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import SearchAndFilter from '../components/SearchAndFilter';
import Loader from '../components/Loader';

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
    <div className="home-page" style={{ position: 'relative' }}>
      {loading && <Loader />}

      <h1>RecipeVault</h1>
      <SearchAndFilter />

      {error && <div className="error">Грешка: {error.message}</div>}

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
  );
}
