import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../services/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './AddRecipe.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

function AddRecipe() {
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    category: 'main',
  });
  const [imageBase64, setImageBase64] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Снимката трябва да е по-малка от 2MB');
      return;
    }

    if (!file.type.match('image.*')) {
      setError('Моля, изберете валиден изображение (JPEG, PNG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageBase64(event.target.result);
    };
    reader.onerror = () => {
      setError('Грешка при прочитане на файла');
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageBase64(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (!formData.title.trim() || formData.title.length < 5) {
        throw new Error('Заглавието трябва да е поне 5 символа');
      }

      const ingredientsArray = formData.ingredients.split('\n').filter(i => i.trim());
      if (ingredientsArray.length < 3) {
        throw new Error('Трябва да добавите поне 3 съставки');
      }
      if (!formData.instructions.trim() || formData.instructions.length < 50) {
        throw new Error('Начинът на приготвяне трябва да е поне 50 символа');
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
          authorName: auth.currentUser.displayName || 'Анонимен'
        })
      };
      if (imageBase64) {
        recipeData.imageBase64 = imageBase64;
      }
      const docRef = await addDoc(collection(db, 'recipes'), recipeData);
      navigate(`/recipe/${docRef.id}`);
    } catch (err) {
      console.error('Грешка при добавяне на рецепта:', err);
      setError(err.message || 'Възникна грешка при запазване на рецептата. Моля, опитайте отново.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-recipe-container">
      <h1>Добави нова рецепта</h1>
      
      {error && (
        <div className="error-message">
          <i className="bi bi-exclamation-circle"></i> {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-group">
          <label htmlFor="title">Заглавие на рецептата*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Въведете заглавие на рецептата"
            required
            minLength="5"
          />
          <small className="form-hint">Мин. 5 символа</small>
        </div>

        <div className="form-group">
          <label htmlFor="ingredients">Съставки*</label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            placeholder="Въведете всяка съставка на нов ред"
            required
            rows="5"
          />
          <small className="form-hint">Мин. 3 съставки, всяка на нов ред</small>
        </div>

        <div className="form-group">
          <label htmlFor="instructions">Начин на приготвяне*</label>
          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="Опишете подробно как се приготвя ястието"
            required
            minLength="50"
            rows="8"
          />
          <small className="form-hint">Мин. 50 символа</small>
        </div>

        <div className="form-group">
          <label htmlFor="category">Категория*</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="main">Основно ястие</option>
            <option value="soup">Супа</option>
            <option value="salad">Салата</option>
            <option value="dessert">Десерт</option>
            <option value="other">Друго</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Снимка (по избор)</label>
          <div className="file-input-container">
            <input
              type="file"
              id="image"
              accept="image/jpeg, image/png"
              onChange={handleImageChange}
              className="file-input"
            />
            <label htmlFor="image" className="file-input-label">
              <i className="bi bi-image"></i>Прикачване на снимка на ястието
            </label>
            <small className="form-hint">Макс. размер: 2MB (JPEG/PNG)</small>
          </div>
          
          {imageBase64 && (
            <div className="image-preview-container">
              <div className="image-preview">
                <img 
                  src={imageBase64} 
                  alt="Преглед на избраната снимка" 
                />
                <button 
                  type="button" 
                  onClick={removeImage}
                  className="remove-image-btn"
                  aria-label="Премахни снимка"
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
                <span>Запазване...</span>
              </>
            ) : (
              <>
                <i className="bi bi-save"></i> Запази рецептата
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddRecipe;