import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../services/firebaseConfig";
import {
  collection,
  query,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../MyRecipes/MyRecipes.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function MyRecipes() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all recipes
        const recipesRef = collection(db, "recipes");
        const recipesQuery = query(recipesRef);
        const recipesSnapshot = await getDocs(recipesQuery);

        const recipesData = [];
        recipesSnapshot.forEach((doc) => {
          recipesData.push({ id: doc.id, ...doc.data() });
        });

        // Fetch all users to show in filter
        const usersRef = collection(db, "users");
        const usersQuery = query(usersRef);
        const usersSnapshot = await getDocs(usersQuery);

        const usersData = [];
        usersSnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });

        setRecipes(recipesData);
        setAllUsers(usersData);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Error loading recipes and users");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const filteredRecipes = filterAuthor === "all" 
    ? recipes 
    : recipes.filter(recipe => recipe.authorId === filterAuthor);

  const getUserName = (userId) => {
    const user = allUsers.find(user => user.id === userId);
    return user ? user.displayName || user.email : "Unknown User";
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading recipes...</p>
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
    <div className="my-recipes-page">
      <Header />
    <div className="my-recipes-container">
      <div className="my-recipes-header">
        <h1>
          <i className="bi bi-journal-bookmark"></i> All Recipes
        </h1>
        <div className="filter-container">
          <label htmlFor="author-filter">Filter by author:</label>
          <select 
            id="author-filter"
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Authors</option>
            {allUsers.map(user => (
              <option key={user.id} value={user.id}>
                {user.displayName || user.email}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-emoji-frown"></i>
          <p>No recipes found{filterAuthor !== "all" ? " for this author" : ""}.</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {filteredRecipes.map((recipe) => (
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
                    <i className="bi bi-person"></i> {getUserName(recipe.authorId)}
                  </span>
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

    <Footer />
    </div>
  );
}

export default MyRecipes;