import axios from "axios";

const API_KEY = "601e72e6c603466d96810cc05c6b88c3";
const BASE_URL = "https://api.spoonacular.com/recipes";

/**
 *
 * @param {string} image
 * @returns {string}
 */
const normalizeImageUrl = (url) => {
  if (!url) return 'https://spoonacular.com/recipeImages/default.jpg'; // или замени със снимка по подразбиране
  return url.startsWith('http') ? url : `https://spoonacular.com/recipeImages/${url}`;
};

/**
 * 
 * @param {Array} ingredients 
 * @returns {Array} 
 */
const normalizeIngredients = (ingredients) => {
  if (!ingredients || !Array.isArray(ingredients)) {
    return ['Няма съставки посочени'];
  }
  
  return ingredients.map(ing => {
    if (ing.original) return ing.original;
    if (ing.name && ing.amount) {
      return `${ing.amount} ${ing.unit || ''} ${ing.name}`.trim();
    }
    return JSON.stringify(ing);
  });
};

/**
 * 
 * @param {string} instructions 
 * @returns {string} 
 */
const cleanInstructions = (instructions) => {
  if (!instructions) return 'Няма налични инструкции';
  
  return instructions
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};


export const fetchRecipes = async (
  query = "",
  cuisine = "",
  diet = "",
  intolerances = "",
  number = 10
) => {
  try {
    const response = await axios.get(`${BASE_URL}/complexSearch`, {
      params: {
        apiKey: API_KEY,
        query,
        cuisine,
        diet,
        intolerances,
        number,
        addRecipeInformation: true,
        instructionsRequired: true,
      },
      timeout: 10000 
    });

    if (!response?.data?.results) {
      throw new Error("Невалиден отговор от API");
    }

    return response.data.results.map((recipe) => ({
      id: recipe.id,
      title: recipe.title || "Рецепта без име",
      image: normalizeImageUrl(recipe.image),
      ingredients: normalizeIngredients(recipe.extendedIngredients),
      instructions: cleanInstructions(recipe.instructions),
      category: recipe.dishTypes?.[0] || "Други",
      servings: recipe.servings || "Не е посочено",
      prepTime: recipe.readyInMinutes || "Не е посочено",
      summary: recipe.summary || "",
      cuisines: recipe.cuisines || []
    }));
  } catch (error) {
    console.error("Грешка при зареждане на рецепти:", error);
    return [];
  }
};

export const fetchRecipeDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}/information`, {
      params: {
        apiKey: API_KEY,
        includeNutrition: true,
        includeIngredients: true,
      },
      timeout: 10000 
    });

    if (!response.data) {
      throw new Error("Не бяха открити подробности за рецептата");
    }

    return {
      id: response.data.id,
      title: response.data.title || "Рецепта без име",
      image: normalizeImageUrl(response.data.image),
      ingredients: normalizeIngredients(response.data.extendedIngredients),
      instructions: cleanInstructions(response.data.instructions),
      nutrition: response.data.nutrition || { nutrients: [] },
      servings: response.data.servings || "Не е посочено",
      prepTime: response.data.readyInMinutes || "Не е посочено",
      summary: response.data.summary || "",
      analyzedInstructions: response.data.analyzedInstructions || [{ steps: [] }],
      cuisines: response.data.cuisines || [],
      sourceUrl: response.data.sourceUrl || "",
    };
  } catch (error) {
    console.error("Грешка при зареждане на детайли за рецепта:", error);
    return {
      error: true,
      message: error.response?.data?.message || "Неуспешно извличане на данни",
    };
  }
};