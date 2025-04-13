import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchRecipeDetails } from "../../api/spoonacular";
import {
  FaUtensils,
  FaListUl,
  FaBookOpen,
  FaClock,
  FaChartPie,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Loader from "../../components/Loader";
import "../RecipeDetails/RecipeDetails.css";

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ingredients");
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchRecipeDetails(id);

        if (!data || data.error) {
          throw new Error(data?.message || "Failed to load recipe");
        }

        const normalizedRecipe = {
          id: data.id,
          title: data.title || "No recipe name",
          image: data.image,
          ingredients: Array.isArray(data.ingredients)
            ? data.ingredients
            : ["No ingredients available"],
          instructions: data.instructions || "No instructions available",
          nutrition: data.nutrition || { nutrients: [] },
          servings: data.servings || "No listed portions",
          readyInMinutes: data.readyInMinutes || "No cooking time specified",
          analyzedInstructions: Array.isArray(data.analyzedInstructions)
            ? data.analyzedInstructions
            : [{ steps: [] }],
          summary: data.summary || "",
          cuisines: Array.isArray(data.cuisines) ? data.cuisines : [],
        };

        setRecipe(normalizedRecipe);
      } catch (err) {
        console.error("Error loading recipe:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  const formatInstructions = (text) => {
    if (!text) return null;

    if (text.includes("<ol>") || text.includes("<ul>")) {
      return (
        <div
          className="instructions-html"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      );
    }

    return text.split("\n").map((step, i) => (
      <p key={i} className="instruction-text">
        {step}
      </p>
    ));
  };

  if (loading) return <Loader />;

  if (error || !recipe)
    return (
  <>
      <motion.div
        className="recipe-error-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <FaClock className="recipe-error-icon" />
        <h1 className="recipe-error-title">Грешка при зареждане</h1>
        <p className="recipe-error-message">
          {error || "Recipe not found. Please try another recipe."}
        </p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Опитайте отново
        </button>
      </motion.div>
      </>
    );
  return (
    <>
    <motion.div
      className="recipe-details-container"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="recipe-content-wrapper">
        <motion.div className="recipe-header-grid" variants={slideUp}>
          <motion.div
            className="recipe-image-wrapper"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img
              src={recipe.image}
              alt={recipe.title}
              className="recipe-image"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://spoonacular.com/recipeImages/default.jpg";
              }}
            />
          </motion.div>

          <div className="recipe-info-wrapper">
            <div className="recipe-info">
              <motion.h1 className="recipe-title" variants={slideUp}>
                {recipe.title}
              </motion.h1>

              <div className="recipe-meta-container">
                <motion.div
                  className="recipe-meta-item"
                  variants={slideUp}
                  whileHover={{ y: -3, scale: 1.05 }}
                >
                  <FaClock className="recipe-meta-icon" />
                  <span>{recipe.readyInMinutes} minutes</span>
                </motion.div>

                <motion.div
                  className="recipe-meta-item"
                  variants={slideUp}
                  whileHover={{ y: -3, scale: 1.05 }}
                >
                  <FaUtensils className="recipe-meta-icon" />
                  <span>{recipe.servings} portions</span>
                </motion.div>

                {recipe.cuisines.length > 0 && (
                  <motion.div
                    className="recipe-meta-item"
                    variants={slideUp}
                    whileHover={{ y: -3, scale: 1.05 }}
                  >
                    <FaUtensils className="recipe-meta-icon" />
                    <span>{recipe.cuisines.join(", ")}</span>
                  </motion.div>
                )}
              </div>

              {recipe.summary && (
                <motion.div
                  className="recipe-summary"
                  variants={slideUp}
                  dangerouslySetInnerHTML={{ __html: recipe.summary }}
                />
              )}
            </div>
          </div>
        </motion.div>

        <motion.div className="recipe-tabs-container" variants={slideUp}>
          <div className="recipe-tabs">
            <button
              className={`recipe-tab ${
                activeTab === "ingredients" ? "active" : ""
              }`}
              onClick={() => setActiveTab("ingredients")}
            >
              <FaListUl className="recipe-tab-icon" />
              <span>Ingredients</span>
            </button>

            <button
              className={`recipe-tab ${
                activeTab === "instructions" ? "active" : ""
              }`}
              onClick={() => setActiveTab("instructions")}
            >
              <FaBookOpen className="recipe-tab-icon" />
              <span>Instructions</span>
            </button>

            {recipe.nutrition && recipe.nutrition.nutrients?.length > 0 && (
              <button
                className={`recipe-tab ${
                  activeTab === "nutrition" ? "active" : ""
                }`}
                onClick={() => setActiveTab("nutrition")}
              >
                <FaChartPie className="recipe-tab-icon" />
                <span>Nutritional values</span>
              </button>
            )}
          </div>
        </motion.div>
        <motion.div className="tab-content-container" variants={slideUp}>
          {activeTab === "ingredients" && (
            <div className="ingredients-section">
              <h2 className="section-title">Recipe ingredients</h2>
              <div className="ingredients-grid">
                {recipe.ingredients.map((ingredient, index) => (
                  <motion.div
                    key={`ingredient-${index}`}
                    className="ingredient-card"
                    whileHover={{ y: -5, scale: 1.02 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <div className="ingredient-content">
                      <div className="ingredient-bullet"></div>
                      <span className="ingredient-text">{ingredient}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "instructions" && (
            <div className="instructions-section">
              <h2 className="section-title">Preparation steps</h2>
              <div className="instructions-container">
                {recipe.analyzedInstructions[0].steps.length > 0 ? (
                  recipe.analyzedInstructions[0].steps.map((step, index) => (
                    <motion.div
                      key={`step-${index}`}
                      className="instruction-step"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <span className="step-number">{step.number}.</span>
                      <p className="step-text">{step.step}</p>
                    </motion.div>
                  ))
                ) : recipe.instructions ? (
                  formatInstructions(recipe.instructions)
                ) : (
                  <p className="no-data-message">Instructions are not available.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "nutrition" && recipe.nutrition && (
            <div className="nutrition-section">
              <h2 className="section-title">Nutritional values</h2>
              <div className="nutrition-facts-wrapper">
                {recipe.nutrition.nutrients.map((nutrient, index) => (
                  <div
                    key={`nutrient-${index}`}
                    className="nutrition-fact-card"
                  >
                    <div className="nutrition-fact-content">
                      <div className="nutrition-bullet"></div>
                      <div className="nutrition-text">
                        <span className="nutrition-name">{nutrient.name}</span>
                        <span className="nutrition-value">
                          {Math.round(nutrient.amount)}
                          {nutrient.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
    </>
  )
};

