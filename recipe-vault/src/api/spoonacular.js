import axios from "axios";

const API_KEY = "6f8af30a72db4e6dbdd244dc39fc3965";
const BASE_URL = "https://api.spoonacular.com/recipes";

/**
 * Нормализира URL адреса на изображението
 * @param {string} image - URL на изображението
 * @returns {string} Нормализиран URL
 */
const normalizeImageUrl = (url) => {
  if (!url) return 'https://spoonacular.com/recipeImages/default.jpg'; // или замени със снимка по подразбиране
  return url.startsWith('http') ? url : `https://spoonacular.com/recipeImages/${url}`;
};

/**
 * Нормализира списъка със съставки
 * @param {Array} ingredients - Масив от съставки
 * @returns {Array} Нормализиран масив
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
    return JSON.stringify(ing); // Fallback за неочаквани формати
  });
};

/**
 * Почиства текстови инструкции от HTML тагове
 * @param {string} instructions - Текст с инструкции
 * @returns {string} Почистен текст
 */
const cleanInstructions = (instructions) => {
  if (!instructions) return 'Няма налични инструкции';
  
  // Премахва HTML тагове и излишни интервали
  return instructions
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Взима списък с рецепти от Spoonacular API
 */
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
      timeout: 10000 // 10 секунди timeout
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

/**
 * Взима детайли за конкретна рецепта от Spoonacular API
 */
export const fetchRecipeDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}/information`, {
      params: {
        apiKey: API_KEY,
        includeNutrition: true,
        includeIngredients: true,
      },
      timeout: 10000 // 10 секунди timeout
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