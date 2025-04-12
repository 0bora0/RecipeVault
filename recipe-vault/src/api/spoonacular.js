import axios from "axios";
const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export const fetchRecipes = async (query = "") => {
  try {
    const response = await axios.get(`${BASE_URL}/search.php`, {
      params: { s: query },
    });

    const meals = response.data.meals;
    if (!meals) return [];

    return meals.map((meal) => ({
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      ingredients: getIngredientsList(meal),
      instructions: meal.strInstructions || "Няма налични инструкции",
      category: meal.strCategory || "Other",
    }));
  } catch (error) {
    console.error("Error fetching recipes from TheMealDB:", error);
    return [];
  }
};
export const fetchRecipeDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/lookup.php`, {
      params: { i: id },
    });

    const meal = response.data.meals?.[0];
    if (!meal) return null;

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      ingredients: getIngredientsList(meal),
      instructions: meal.strInstructions || "Няма налични инструкции",
      category: meal.strCategory || "Other",
      area: meal.strArea || "",
      youtube: meal.strYoutube || "",
    };
  } catch (error) {
    console.error("Error fetching recipe details from TheMealDB:", error);
    return null;
  }
};

const getIngredientsList = (meal) => {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure} ${ingredient}`.trim());
    }
  }
  return ingredients;
};
