import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../services/firebaseConfig";
import { collection, query, getDocs, doc, deleteDoc } from "firebase/firestore";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {  FaClock, FaUtensils, FaFire, FaPencilAlt, FaTrash } from "react-icons/fa";
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
      title: "Потвърждение",
      message: "Сигурни ли сте, че искате да изтриете тази рецепта?",
      buttons: [
        {
          label: "Да",
          onClick: async () => {
            try {
              await deleteDoc(doc(db, "recipes", recipeId));
              setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
              toast.success("Рецептата е изтрита успешно!");
            } catch (error) {
              console.error("Error deleting recipe:", error);
              toast.error("Грешка при изтриване на рецепта");
            }
          },
        },
        {
          label: "Не",
          onClick: () => {},
        },
      ],
    });
  };

  const formatTime = (minutes) => {
    if (!minutes) return 'Не е посочено';
    return minutes > 60 
      ? `${Math.floor(minutes / 60)}ч ${minutes % 60}мин` 
      : `${minutes}мин`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Зареждане на рецепти...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">!</div>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Опитайте отново
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
              <span className="icon-wrapper"><FaUtensils /></span>
              Моите рецепти
            </h1>
            <Link to="/add-recipe" className="add-recipe-btn">
              <FaPencilAlt /> Добави нова рецепта
            </Link>
          </div>

          {recipes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"></div>
              <h3>Все още нямате добавени рецепти</h3>
              <p>Започнете, като добавите първата си рецепта</p>
              <Link to="/add-recipe" className="primary-btn">
                <FaPencilAlt /> Добави рецепта
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
                          src={recipe.imageBase64 || '/images/placeholder-food.jpg'} 
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
                            <span>{recipe.servings || 'Няма посочени'} порции</span>
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
                        <FaTrash /> Изтрий
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