import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../services/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "react-confirm-alert/src/react-confirm-alert.css";


function EditRecipe() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    category: "main",
  });
  const [imageBase64, setImageBase64] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, "recipes", recipeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            title: data.title,
            ingredients: data.ingredients.join("\n"),
            instructions: data.instructions,
            category: data.category || "main",
          });
          if (data.imageBase64) {
            setImageBase64(data.imageBase64);
          }
        } else {
          setError("Рецептата не е намерена");
        }
      } catch (error) {
        console.error("Грешка при зареждане на рецепта:", error);
        setError("Грешка при зареждане на рецептата");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Снимката трябва да е по-малка от 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (!formData.title.trim() || formData.title.length < 5) {
        throw new Error("Заглавието трябва да е поне 5 символа");
      }

      const ingredientsArray = formData.ingredients
        .split("\n")
        .filter((i) => i.trim());
      if (ingredientsArray.length < 3) {
        throw new Error("Трябва да добавите поне 3 съставки");
      }

      const recipeData = {
        title: formData.title.trim(),
        ingredients: ingredientsArray,
        instructions: formData.instructions.trim(),
        category: formData.category,
      };

      if (imageBase64) {
        recipeData.imageBase64 = imageBase64;
      }

      const recipeRef = doc(db, "recipes", recipeId);
      await updateDoc(recipeRef, recipeData);

      navigate(`/recipe/${recipeId}`);
    } catch (err) {
      console.error("Грешка при обновяване на рецепта:", err);
      setError(err.message || "Грешка при запазване на промените");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Зареждане...</div>;

  return (
    <div className="edit-recipe-container">
      <h1>
        <i className="bi bi-pencil-square"></i> Редактиране на рецепта
      </h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="recipe-form">
        {/* Формата е същата като в AddRecipe.jsx */}
        {/* ... */}

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Запазване..." : "Запази промените"}
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            Откажи
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditRecipe;
