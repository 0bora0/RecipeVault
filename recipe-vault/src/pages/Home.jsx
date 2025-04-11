import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadRecipes, setSearchQuery, setCategoryFilter } from '../features/recipes/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import SearchAndFilter from '../components/SearchAndFilter';

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

  if (loading) return <div className="loading">Зареждане на рецепти...</div>;
  if (error) return <div className="error">Грешка: {error.message}</div>;

  return (
    <div className="home-page">
      <h1>RecipeVault</h1>
      <SearchAndFilter />
      
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