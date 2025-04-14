import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../services/firebaseConfig";
import { collection, query, getDocs, doc, deleteDoc } from "firebase/firestore";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FaClock, FaUtensils, FaFire, FaPencilAlt, FaTrash, FaPlusCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { toast } from "react-toastify";
import "../MyRecipes/MyRecipes.css";

function MyRecipes() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipesRef = collection(db, "recipes");
        const recipesQuery = query(recipesRef);
        const querySnapshot = await getDocs(recipesQuery);

        const recipesData = [];
        querySnapshot.forEach((doc) => {
          recipesData.push({ id: doc.id, ...doc.data() });
        });

        setRecipes(recipesData);
      } catch (error) {
        console.error("Error loading recipes:", error);
        setError("Error loading recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleDelete = async (recipeId) => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this recipe?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await deleteDoc(doc(db, "recipes", recipeId));
              setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
              toast.success("Recipe deleted successfully!");
            } catch (error) {
              console.error("Error deleting recipe:", error);
              toast.error("Error deleting recipe");
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const formatTime = (minutes) => {
    if (!minutes) return "No cooking time specified";
    return minutes > 60
      ? `${Math.floor(minutes / 60)}h ${minutes % 60}min`
      : `${minutes}min`;
  };

  if (loading) {
    return (
      <div className="app-container">
        <Header />
        <div className="home-page">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading recipes...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <Header />
        <div className="home-page">
          <div className="error-message">
            <i className="bi bi-exclamation-triangle"></i> Error: {error}
            <button onClick={() => window.location.reload()} className="retry-button">
              Try again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />
      <div className="home-page">
        <Link to="/add-recipe" className="floating-add-btn">
          <FaPlusCircle />
        </Link>

        <div className="hero-section">
          <div className="hero-content">
            <h1>My Recipes</h1>
            <p>Manage and organize your culinary creations</p>
          </div>
        </div>

        <div className="main-content">
          <div className="top-bar">
            <h2 className="section-title">Your Recipe Collection</h2>
            <Link to="/add-recipe" className="add-recipe-btn">
              <FaPencilAlt /> Add new recipe
            </Link>
          </div>

          {recipes.length === 0 ? (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src="/images/empty-recipes.svg" alt="No recipes" />
              <h3>You haven't added any recipes yet</h3>
              <p>Start by adding your first recipe to your collection</p>
              <Link to="/add-recipe" className="add-recipe-btn">
                <FaPlusCircle /> Add recipe
              </Link>
            </motion.div>
          ) : (
            <motion.div 
              className="recipes-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {recipes.map((recipe) => (
                <motion.div 
                  key={recipe.id} 
                  className="recipe-card-wrapper"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="recipe-card">
                    <Link to={`/recipe/${recipe.id}`} className="recipe-link">
                      <div className="recipe-image-container">
                        <img
                          src={recipe.imageBase64 || "/images/placeholder-food.jpg"}
                          alt={recipe.title}
                          loading="lazy"
                          className="recipe-image"
                        />
                        {recipe.category && (
                          <div className="category-badge">
                            {recipe.category}
                          </div>
                        )}
                      </div>
                      <div className="recipe-content">
                        <h3 className="recipe-title">{recipe.title}</h3>
                        <div className="recipe-meta">
                          <div className="meta-item">
                            <FaClock className="meta-icon" />
                            <span>{formatTime(recipe.cookingTime)}</span>
                          </div>

                          <div className="meta-item">
                            <FaUtensils className="meta-icon" />
                            <span>
                              {recipe.servings || "No specified"} portions
                            </span>
                          </div>

                          {recipe.calories && (
                            <div className="meta-item">
                              <FaFire className="meta-icon" />
                              <span>{recipe.calories} kcal</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                    <div className="recipe-actions">
                      <Link 
                        to={`/edit-recipe/${recipe.id}`}
                        className="action-btn edit"
                      >
                        <FaPencilAlt /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(recipe.id)}
                        className="action-btn delete"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MyRecipes;