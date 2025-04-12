import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from '../services/firebaseConfig'; 
import { collection, query, where, getDocs } from "firebase/firestore";

function MyRecipes() {
  const { userId } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        console.error("Грешка при зареждане на рецепти:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [userId]);

  if (loading) return <div>Зареждане...</div>;

  return (
    <div className="my-recipes-container">
      <h1>Мои рецепти</h1>
      
      {recipes.length === 0 ? (
        <p>Все още нямате добавени рецепти</p>
      ) : (
        <div className="recipes-grid">
          {recipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRecipes;