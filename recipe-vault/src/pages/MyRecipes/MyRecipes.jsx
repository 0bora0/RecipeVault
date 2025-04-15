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

  useEffect(() => {
    
    const fetchRecipes = async () => {
      try {
        const recipesRef = collection(db, "recipes");
        const recipesQuery = query(recipesRef);
        const querySnapshot = await getDocs(recipesQuery);

        const recipesData = [];
        querySnapshot.forEach((doc) => {
          recipesData.push({
            id: doc.id,
            ...doc.data(),
            cookingTime: doc.data().cookingTime || 0,
            servings: doc.data().servings || 0,
            calories: doc.data().calories || 0,
            cuisines: doc.data().cuisines || [],
          });
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
              setRecipes(prevRecipes => 
                prevRecipes.filter(recipe => recipe.id !== recipeId)
              );
              toast.success("Recipe deleted successfully!");
            } catch (error) {
              console.error("Error deleting recipe:", error);
              toast.error("Failed to delete recipe");
            }
          },
        },
        {
          label: "No",
        },
      ],
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
              <MyRecipeCard 
                key={recipe.id}
                recipe={recipe}
                isFavorite={false} // Можете да добавите логика за любими
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MyRecipes;