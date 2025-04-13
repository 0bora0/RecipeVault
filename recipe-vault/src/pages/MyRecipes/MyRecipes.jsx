import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../../services/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../MyRecipes/MyRecipes.css";

function MyRecipes() {
  const { userId } = useParams();  
  const navigate = useNavigate(); 
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      // If no userId, redirect to the login page
      navigate("/login");
      return;
    }

    const fetchRecipes = async () => {
      try {
        const recipesRef = collection(db, "recipes");
        const q = query(recipesRef, where("authorId", "==", userId));
        const querySnapshot = await getDocs(q);

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
  }, [userId, navigate]);

  const handleDelete = async (recipeId) => {
    confirmAlert({
      title: "Confirmation",
      message: "Are you sure you want to delete this recipe?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await deleteDoc(doc(db, "recipes", recipeId));
              setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
            } catch (error) {
              console.error("Error deleting recipe:", error);
              setError("Error deleting recipe");
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

  const handleEdit = (recipeId) => {
    navigate(`/edit-recipe/${recipeId}`);
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your recipes...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <i className="bi bi-exclamation-triangle"></i>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Try Again
        </button>
      </div>
    );

  return (
    <div className="my-recipes-container">
      <div className="my-recipes-header">
        <h1>
          <i className="bi bi-journal-bookmark"></i> My Recipes
        </h1>
        <Link to="/add-recipe" className="add-recipe-btn">
          <i className="bi bi-plus-circle"></i> Add New Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-emoji-frown"></i>
          <p>You have no recipes yet.</p>
          <Link to="/add-recipe" className="add-recipe-btn">
            <i className="bi bi-plus-circle"></i> Add Your First Recipe
          </Link>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              {recipe.imageBase64 ? (
                <img
                  src={recipe.imageBase64}
                  alt={recipe.title}
                  className="recipe-image"
                />
              ) : (
                <div className="recipe-image-placeholder">
                  <i className="bi bi-image"></i>
                </div>
              )}

              <div className="recipe-content">
                <h3>{recipe.title}</h3>
                <div className="recipe-meta">
                  <span>
                    <i className="bi bi-clock"></i>{" "}
                    {new Date(recipe.createdAt?.toDate()).toLocaleDateString()}
                  </span>
                  <span>
                    <i className="bi bi-heart"></i> {recipe.likes || 0}
                  </span>
                  <span>
                    <i className="bi bi-eye"></i> {recipe.views || 0}
                  </span>
                </div>

                <div className="recipe-actions">
                  <button
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                    className="action-btn view-btn"
                  >
                    <i className="bi bi-eye"></i> View
                  </button>
                  <button
                    onClick={() => handleEdit(recipe.id)}
                    className="action-btn edit-btn"
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(recipe.id)}
                    className="action-btn delete-btn"
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRecipes;
