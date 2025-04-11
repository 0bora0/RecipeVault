import { useSelector } from "react-redux";
import RecipeCard from "../components/RecipeCard";

export default function Favorites() {
  const favorites = useSelector((state) => state.recipes.favorites);

  return (
    <div>
      <h1>Любими рецепти</h1>
      {favorites.length === 0 ? (
        <p>Нямате любими рецепти.</p>
      ) : (
        <div className="recipes-grid">
          {favorites.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}