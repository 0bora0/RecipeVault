import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../services/firebaseConfig";
import { collection, query, getDocs, doc, deleteDoc } from "firebase/firestore";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  FaClock,
  FaUtensils,
  FaFire,
  FaPencilAlt,
  FaTrash,
} from "react-icons/fa";
import "../../styles/RecipeCard.css";
import "./MyRecipes.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { toast } from "react-toastify";

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
      ? `${Math.floor(minutes / 60)}ч ${minutes % 60} min`
      : `${minutes}min`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">!</div>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Try again!
        </button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="my-recipes-page">
        <div className="container">
          <div className="page-header">
            <h1>
              <span className="icon-wrapper">
                <FaUtensils />
              </span>
              My recipes
            </h1>
            <Link to="/add-recipe" className="add-recipe-btn">
              <FaPencilAlt /> Add new recipe
            </Link>
          </div>

          {recipes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"></div>
              <h3>You haven't added any recipes yet.</h3>
              <p>Click the button below to add your first recipe.</p>
              <Link to="/add-recipe" className="primary-btn">
                <FaPencilAlt /> Add recipe
              </Link>
            </div>
          ) : (
            <div className="recipes-grid">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="recipe-card-wrapper">
                  <div className="recipe-card">
                    <Link to={`/recipe/${recipe.id}`} className="recipe-link">
                      <div className="recipe-image-container">
                        <img
                          src={
                            recipe.imageBase64 || "/images/placeholder-food.jpg"
                          }
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
                      <button
                        onClick={() => handleDelete(recipe.id)}
                        className="action-btn delete"
                      >
                        <FaTrash /> Delete recipe
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MyRecipes;
