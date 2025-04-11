import axios from 'axios';

const API_KEY = 'eb2f566fd76949eba400f59765b373bc'; // Регистрирайте се на spoonacular.com за безплатен ключ
const BASE_URL = 'https://api.spoonacular.com/recipes';

export const fetchRecipes = async (query = '', cuisine = '') => {
  try {
    const response = await axios.get(`${BASE_URL}/complexSearch`, {
      params: {
        apiKey: API_KEY,
        query,
        cuisine,
        number: 10,
        addRecipeInformation: true
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('API Error, using mock data:', error);
    // Mock data fallback
    return [
      {
        id: 1,
        title: "Шоколадово кейк",
        image: "https://spoonacular.com/recipeImages/1-312x231.jpg",
        dishTypes: ["dessert"],
        extendedIngredients: [
          { original: "1 cup flour" },
          { original: "1/2 cup sugar" }
        ]
      },
      // Add more mock recipes as needed
    ];
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