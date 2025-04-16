import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../services/firebaseConfig";
import { collection, query, getDocs, doc, deleteDoc } from "firebase/firestore";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FaPlusCircle } from "react-icons/fa";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import MyRecipeCard from "../../components/MyRecipeCard";
import "./MyRecipes.css";

function MyRecipes() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecipes = async () => {
    try {
      const recipesRef = collection(db, "recipes");
      const recipesQuery = query(recipesRef);
      const recipesSnapshot = await getDocs(recipesQuery);

      const recipesData = recipesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        cookingTime: doc.data().cookingTime || 0,
        servings: doc.data().servings || 0,
      }));

      setRecipes(recipesData);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Error loading recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
              const recipeRef = doc(db, "recipes", recipeId);
              if (!recipeRef.id) {
                throw new Error("Invalid document reference");
              }

              await deleteDoc(recipeRef);
              setRecipes((prevRecipes) =>
                prevRecipes.filter((recipe) => recipe.id !== recipeId)
              );

              toast.success("Recipe deleted successfully!", {
                position: "bottom-right",
                autoClose: 3000,
              });

              if (window.location.pathname.includes(`/my-recipe/${recipeId}`)) {
                navigate("/my-recipes");
              }
            } catch (error) {
              console.error("Error deleting recipe:", error);
              toast.error(`Failed to delete recipe: ${error.message}`, {
                position: "bottom-right",
                autoClose: 3000,
              });
            }
          },
        },
        {
          label: "No",
        },
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
      overlayClassName: "confirm-overlay",
    });
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
            <p>Manage your culinary creations</p>
          </div>
        </div>

        <div className="main-content">
          {loading && <Loader />}
          {error && <div className="error-message">{error}</div>}

          <div className="recipes-content">
            {!loading && recipes.length === 0 && (
              <div className="empty-state">
                <img src="../images/food.jpg" alt="No recipes" />
                <h3>No recipes found</h3>
                <p>Click the button below to add your first recipe</p>
                <Link to="/add-recipe" className="add-recipe-btn">
                  <FaPlusCircle /> Add Recipe
                </Link>
              </div>
            )}

            <div className="recipes-grid">
              {recipes.map((recipe) => (
                <MyRecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MyRecipes;
