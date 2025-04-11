import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRecipeDetails } from '../api/spoonacular';
import NutritionFacts from '../components/NutritionFacts';

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
              const loadRecipe = async () => {
                setLoading(true);
                const data = await fetchRecipeDetails(id);
                setRecipe(data);
                setLoading(false);
              };
              loadRecipe();
            }, [id]);

  if (loading) return <div>Зареждане...</div>;
  if (!recipe) return <div>Рецептата не е намерена</div>;

  return (
    <div className="recipe-details">
      <h1>{recipe.title}</h1>
      <img src={recipe.image} alt={recipe.title} />
      
      <div className="ingredients-section">
        <h2>Съставки</h2>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
      
      <div className="instructions-section">
        <h2>Инструкции</h2>
        <div className="instructions-text">
          {recipe.instructions.split('. ').map((sentence, index) => (
            <p key={index}>
              {index + 1}. {sentence.trim()}
              {!sentence.endsWith('.') && '.'}
            </p>
          ))}
        </div>
      </div>
      
      {recipe.nutrition && <NutritionFacts nutrition={recipe.nutrition} />}
    </div>
  );
}