import axios from "axios";
const API_KEY = "601e72e6c603466d96810cc05c6b88c3";
const BASE_URL = "https://api.spoonacular.com/recipes";

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
    });

    return response.data.results.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      ingredients: recipe.extendedIngredients?.map((ing) => ing.original) || [],
      instructions: recipe.instructions || "Няма налични инструкции",
      category: recipe.dishTypes?.[0] || "Other",
      servings: recipe.servings,
      prepTime: recipe.readyInMinutes || "Не е посочено време за приготвяне",
    }));
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

export const fetchRecipeDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}/information`, {
      params: {
        apiKey: API_KEY,
        includeNutrition: true,
      },
    });

    const cleanInstructions = (html) => {
      return html
        .replace(/<[^>]*>?/gm, " ")
        .replace(/\n/g, " ")
        .trim();
    };

    if (!response.data) {
      throw new Error("Не бяха открити подробности за рецептата.");
    }

    return {
      id: response.data.id,
      title: response.data.title,
      image: response.data.image,
      ingredients: response.data.extendedIngredients.map(
        (ing) => ing.original
      ) || ["Няма съставки посочени"],
      instructions: response.data.instructions
        ? cleanInstructions(response.data.instructions)
        : "Няма налични инструкции",
      nutrition:
        response.data.nutrition ||
        "Няма налична информация за хранителната стойност",
      servings: response.data.servings || "Не е посочено колко порции",
      prepTime:
        response.data.readyInMinutes || "Не е посочено време за приготвяне",
    };
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    return {
      error: true,
      message: error.response
        ? error.response.data
        : "Неуспешно извличане на данни.",
    };
  }
};
