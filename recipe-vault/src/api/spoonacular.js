import axios from 'axios';

const API_KEY = 'eb2f566fd76949eba400f59765b373bc'; // Регистрирайте се на spoonacular.com за безплатен ключ
const BASE_URL = 'https://api.spoonacular.com/recipes';

export const fetchRecipes = async (query = '', cuisine = '', number = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/complexSearch`, {
      params: {
        apiKey: API_KEY,
        query,
        cuisine,
        number,
        addRecipeInformation: true,
        instructionsRequired: true
      }
    });
    return response.data.results.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      ingredients: recipe.extendedIngredients?.map(ing => ing.original) || [],
      instructions: recipe.instructions || 'Няма налични инструкции',
      category: recipe.dishTypes?.[0] || 'Other'
    }));
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};
export const fetchRecipeDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}/information`, {
      params: {
        apiKey: API_KEY,
        includeNutrition: true
      }
    });
    
    // Функция за чистене на HTML тагове
    const cleanInstructions = (html) => {
      return html.replace(/<[^>]*>?/gm, '')
                .replace(/\n/g, ' ')
                .trim();
    };

    return {
      id: response.data.id,
      title: response.data.title,
      image: response.data.image,
      ingredients: response.data.extendedIngredients.map(ing => ing.original),
      instructions: response.data.instructions 
        ? cleanInstructions(response.data.instructions)
        : 'Няма налични инструкции',
      nutrition: response.data.nutrition
    };
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
};