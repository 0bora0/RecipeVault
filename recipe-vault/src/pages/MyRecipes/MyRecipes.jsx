import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../services/firebaseConfig";
import { collection, query, getDocs, doc, deleteDoc } from "firebase/firestore";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FaPlusCircle, FaFilter, FaUser, FaTimes } from "react-icons/fa";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import MyRecipeCard from "../../components/MyRecipeCard";
import "./MyRecipes.css";

function MyRecipes() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipesRef = collection(db, "recipes");
        const recipesQuery = query(recipesRef);
        const recipesSnapshot = await getDocs(recipesQuery);

        const recipesData = [];
        const usersMap = new Map();
        
        recipesSnapshot.forEach((doc) => {
          const recipeData = doc.data();
          const recipe = {
            id: doc.id,
            ...recipeData,
            cookingTime: recipeData.cookingTime || 0,
            servings: recipeData.servings || 0,
            calories: recipeData.calories || 0,
            cuisines: recipeData.cuisines || [],
          };
          
          recipesData.push(recipe);
          
          if (recipeData.authorId && recipeData.authorName) {
            if (!usersMap.has(recipeData.authorId)) {
              usersMap.set(recipeData.authorId, {
                id: recipeData.authorId,
                name: recipeData.authorName,
                photoURL: recipeData.authorPhotoURL || null
              });
            }
          }
        });

        setRecipes(recipesData);
        setFilteredRecipes(recipesData);
        setUsers(Array.from(usersMap.values()));
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Error loading recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedUser === "all") {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter(recipe => recipe.authorId === selectedUser);
      setFilteredRecipes(filtered);
    }
  }, [selectedUser, recipes]);

  const handleDelete = async (recipeId) => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this recipe?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              // 1. Delete from Firestore
              await deleteDoc(doc(db, "recipes", recipeId));
              
              // 2. Update local state
              setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
              setFilteredRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
              
              // 3. Show success message
              toast.success("Recipe deleted successfully!", {
                position: "bottom-right",
                autoClose: 3000,
              });
              
              // 4. Redirect if on recipe detail page
              if (window.location.pathname.includes(`/my-recipe/${recipeId}`)) {
                navigate('/my-recipes');
              }
            } catch (error) {
              console.error("Error deleting recipe:", error);
              toast.error("Failed to delete recipe", {
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

          <div className="content-wrapper">
          
              
            
            

            <div className="recipes-content">
              {!loading && filteredRecipes.length === 0 && (
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
                {filteredRecipes.map((recipe) => (
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
      </div>
      <Footer />
    </>
  );
}

export default MyRecipes;