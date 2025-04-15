import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import {
  FaUtensils,
  FaListUl,
  FaBookOpen,
  FaClock,
  FaChartPie,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Loader from "../../components/Loader";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "../RecipeDetails/RecipeDetails.css";

export default function MyRecipeDetails() {
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
        const docRef = doc(db, "recipes", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error("Recipe not found");
        }

        const recipeData = docSnap.data();

        // Transform Firestore data to match your component's expectations
        const normalizedRecipe = {
          id: docSnap.id,
          title: recipeData.title || "No recipe name",
          image: recipeData.image || "/images/placeholder-food.jpg",
          ingredients: recipeData.ingredients || ["No ingredients available"],
          instructions: recipeData.instructions || "No instructions available",
          nutrition: {
            nutrients: [
              {
                name: "Calories",
                amount: recipeData.calories || 0,
                unit: "kcal",
              },
            ],
          },
          servings: recipeData.servings || "No listed portions",
          cookingTime: recipeData.readyInMinutes || "No cooking time specified",
          analyzedInstructions: recipeData.analyzedInstructions || [
            {
              steps: recipeData.instructions
                ? recipeData.instructions
                    .split("\n")
                    .filter((step) => step.trim())
                    .map((step, index) => ({
                      number: index + 1,
                      step: step.trim(),
                    }))
                : [],
            },
          ],
          summary: recipeData.summary || "",
          cuisines: recipeData.cuisines || [],
          category: recipeData.category || "other",
          authorName: recipeData.authorName || "Anonymous",
          createdAt: recipeData.createdAt?.toDate() || new Date(),
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
        <Header />
        <motion.div
          className="recipe-error-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FaClock className="recipe-error-icon" />
          <h1 className="recipe-error-title">Error loading recipe</h1>
          <p className="recipe-error-message">
            {error || "Recipe not found. Please try another recipe."}
          </p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </motion.div>
        <Footer />
      </>
    );

  return (
    <>
      <Header />
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
                  e.target.src = "/images/placeholder-food.jpg";
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
                    <span>{recipe.readyInMinutes}</span>
                  </motion.div>

                  <motion.div
                    className="recipe-meta-item"
                    variants={slideUp}
                    whileHover={{ y: -3, scale: 1.05 }}
                  >
                    <FaUtensils className="recipe-meta-icon" />
                    <span>{recipe.servings}</span>
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

                  {recipe.category && (
                    <motion.div
                      className="recipe-meta-item"
                      variants={slideUp}
                      whileHover={{ y: -3, scale: 1.05 }}
                    >
                      <span className="category-badge">{recipe.category}</span>
                    </motion.div>
                  )}
                </div>

                {recipe.summary && (
                  <motion.div className="recipe-summary" variants={slideUp}>
                    {recipe.summary}
                  </motion.div>
                )}

                <div className="recipe-actions">
                  <button className="edit-btn">
                    <FaEdit /> Edit
                  </button>
                  <button className="delete-btn">
                    <FaTrash /> Delete
                  </button>
                </div>
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
                  <span>Nutrition</span>
                </button>
              )}
            </div>
          </motion.div>

          <motion.div className="tab-content-container" variants={slideUp}>
            {activeTab === "ingredients" && (
              <div className="ingredients-section">
                <h2 className="section-title">Ingredients</h2>
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
                <h2 className="section-title">Instructions</h2>
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
                    <p className="no-data-message">No instructions available</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "nutrition" && recipe.nutrition && (
              <div className="nutrition-section">
                <h2 className="section-title">Nutrition Facts</h2>
                <div className="nutrition-facts-wrapper">
                  {recipe.nutrition.nutrients.map((nutrient, index) => (
                    <div
                      key={`nutrient-${index}`}
                      className="nutrition-fact-card"
                    >
                      <div className="nutrition-fact-content">
                        <div className="nutrition-bullet"></div>
                        <div className="nutrition-text">
                          <span className="nutrition-name">
                            {nutrient.name}
                          </span>
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
      <Footer />
    </>
  );
}
