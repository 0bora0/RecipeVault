import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../services/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./AddRecipe.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
function AddRecipe() {
  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    category: "main",
  });
  const [imageBase64, setImageBase64] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      setError("Photo must be smaller than 2MB");
      return;
    }

    if (!file.type.match("image.*")) {
      setError("Please select an image file (JPEG, PNG)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageBase64(event.target.result);
    };
    reader.onerror = () => {
      setError("Error uploading file!");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageBase64(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (!formData.title.trim() || formData.title.length < 5) {
        throw new Error("Title must be at least 5 characters long!");
      }

      const ingredientsArray = formData.ingredients
        .split("\n")
        .filter((i) => i.trim());
      if (ingredientsArray.length < 3) {
        throw new Error("At least 3 ingredients are required!");
      }
      if (!formData.instructions.trim() || formData.instructions.length < 50) {
        throw new Error("Instructions must be at least 50 characters long!");
      }

      const recipeData = {
        title: formData.title.trim(),
        ingredients: ingredientsArray,
        instructions: formData.instructions.trim(),
        category: formData.category,
        createdAt: serverTimestamp(),
        likes: 0,
        views: 0,
        ...(auth.currentUser && {
          authorId: auth.currentUser.uid,
          authorName: auth.currentUser.displayName || "Anonymous",
        }),
      };
      if (imageBase64) {
        recipeData.imageBase64 = imageBase64;
      }
      const docRef = await addDoc(collection(db, "recipes"), recipeData);
      navigate(`/recipe/${docRef.id}`);
    } catch (err) {
      console.error("Error adding recipe:", err);
      setError(err.message || "Failed to add recipe");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-recipe-page">
      <Header />
      <div className="add-recipe-container">
        <h1>Add Recipe</h1>

        {error && (
          <div className="error-message">
            <i className="bi bi-exclamation-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="recipe-form">
          <div className="form-group">
            <label htmlFor="title">Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Add a title"
              required
              minLength="5"
            />
            <small className="form-hint">Min 5 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="ingredients">Ingredients*</label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="Enter each ingredient on a new line."
              required
              rows="5"
            />
            <small className="form-hint">Min. 3 ingredients.</small>
          </div>

          <div className="form-group">
            <label htmlFor="instructions">Instructions*</label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Enter the instructions here."
              required
              minLength="50"
              rows="8"
            />
            <small className="form-hint">Min. 50 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category*</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="main">Main dish</option>
              <option value="soup">Soup</option>
              <option value="salad">Salad</option>
              <option value="dessert">Dessert</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image">Photo (optional)</label>
            <div className="file-input-container">
              <input
                type="file"
                id="image"
                accept="image/jpeg, image/png"
                onChange={handleImageChange}
                className="file-input"
              />
              <label htmlFor="image" className="file-input-label">
                <i className="bi bi-image"></i>Upload Image
              </label>
              <small className="form-hint">Max size: 2MB (JPEG/PNG)</small>
            </div>

            {imageBase64 && (
              <div className="image-preview-container">
                <div className="image-preview">
                  <img src={imageBase64} alt="Preview" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="remove-image-btn"
                    aria-label="Remove image"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-save"></i> Save recipe
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default AddRecipe;
