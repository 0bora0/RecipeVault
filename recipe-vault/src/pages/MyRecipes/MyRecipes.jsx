import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../services/firebaseConfig";
import { collection, query, getDocs, doc, deleteDoc } from "firebase/firestore";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FaPlusCircle, FaClock, FaUtensils, FaFire, FaTrash } from "react-icons/fa";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
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

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  const handleDelete = async (recipeId, e) => {
    e.stopPropagation(); 
    
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
        },
      ],
    });
  };

  const formatTime = (minutes) => {
    if (!minutes) return "No time specified";
    return minutes > 60
      ? `${Math.floor(minutes / 60)}h ${minutes % 60}min`
      : `${minutes}min`;
  };

  return (
    <>
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
          {loading && <Loader />}

          {error && (
            <div className="error-message">
              <i className="bi bi-exclamation-triangle"></i> Error: {error}
            </div>
          )}

          {!loading && recipes.length === 0 && (
            <div className="empty-state">
              <img src="/images/empty-recipes.svg" alt="No recipes" />
              <h3>You haven't added any recipes yet</h3>
              <p>Click the button below to add your first recipe</p>
              <Link to="/add-recipe" className="add-recipe-btn">
                <FaPlusCircle /> Add your first recipe
              </Link>
            </div>
          )}

          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <div 
                key={recipe.id} 
                onClick={() => handleRecipeClick(recipe.id)}
                className="recipe-card-wrapper"
              >
                <div className="recipe-card">
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
                  
                  <button
                    onClick={(e) => handleDelete(recipe.id, e)}
                    className="delete-btn"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MyRecipes;