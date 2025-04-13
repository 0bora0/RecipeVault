import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../services/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FaSave, FaTimes, FaUpload, FaUtensils, FaClock, FaFire, FaListUl, FaBookOpen } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditRecipe.css';

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  // Форматиране на времето за готвене
  const formatTime = (minutes) => {
    if (!minutes) return '';
    return minutes > 60 
      ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` 
      : `${minutes}m`;
  };

  // Зареждане на рецептата от Firestore
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, "recipes", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRecipe({
            id: docSnap.id,
            ...data,
            cookingTime: data.cookingTime || '',
            servings: data.servings || '',
            calories: data.calories || ''
          });
          setImagePreview(data.imageBase64 || '');
        } else {
          toast.error('Рецептата не беше намерена!');
          navigate('/my-recipes');
        }
      } catch (error) {
        console.error("Грешка при зареждане:", error);
        toast.error('Грешка при зареждане на рецептата');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  // Обработка на промените във формата
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

  // Обработка на изображението
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setRecipe(prev => ({ ...prev, imageBase64: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Запазване на промените
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const recipeRef = doc(db, "recipes", id);
      await updateDoc(recipeRef, {
        title: recipe.title,
        category: recipe.category,
        ingredients: recipe.ingredients.split('\n').filter(i => i.trim()),
        instructions: recipe.instructions.split('\n').filter(i => i.trim()),
        cookingTime: parseInt(recipe.cookingTime) || 0,
        servings: parseInt(recipe.servings) || 0,
        calories: parseInt(recipe.calories) || 0,
        imageBase64: recipe.imageBase64,
        updatedAt: new Date()
      });
      
      toast.success('Рецептата е обновена успешно!');
      navigate(`/recipe/${id}`);
    } catch (error) {
      console.error("Грешка при запазване:", error);
      toast.error('Грешка при обновяване на рецептата');
    }
  };

  if (loading) {
    return (
      <div className="edit-recipe-loading">
        <div className="spinner"></div>
        <p>Зареждане на рецептата...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="edit-recipe-error">
        <h2>Грешка при зареждане на рецептата</h2>
        <button onClick={() => navigate('/my-recipes')} className="back-button">
          Назад към моите рецепти
        </button>
      </div>
    );
  }

  return (
    <div className="edit-recipe-container">
      <div className="edit-recipe-header">
        <h1>
          <FaUtensils /> Редактиране на рецепта
        </h1>
        <button 
          onClick={() => navigate(`/recipe/${id}`)} 
          className="cancel-button"
        >
          <FaTimes /> Отказ
        </button>
      </div>

      <form onSubmit={handleSubmit} className="edit-recipe-form">
        <div className="form-grid">
          {/* Лява колона - Основна информация */}
          <div className="form-left-column">
            <div className="form-group image-upload-group">
              <label htmlFor="image-upload" className="image-upload-label">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                ) : (
                  <div className="image-placeholder">
                    <FaUpload className="upload-icon" />
                    <span>Качи снимка</span>
                  </div>
                )}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-upload-input"
              />
            </div>

            <div className="form-group">
              <label>Заглавие</label>
              <input
                type="text"
                name="title"
                value={recipe.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Категория</label>
              <select
                name="category"
                value={recipe.category || ''}
                onChange={handleChange}
                required
              >
                <option value="">Изберете категория</option>
                <option value="Предястия">Предястия</option>
                <option value="Основни">Основни ястия</option>
                <option value="Десерти">Десерти</option>
                <option value="Салати">Салати</option>
                <option value="Супи">Супи</option>
                <option value="Напитки">Напитки</option>
              </select>
            </div>
          </div>

          {/* Дясна колона - Допълнителна информация */}
          <div className="form-right-column">
            <div className="meta-fields">
              <div className="form-group">
                <label>
                  <FaClock /> Време за приготвяне (мин.)
                </label>
                <input
                  type="number"
                  name="cookingTime"
                  value={recipe.cookingTime}
                  onChange={handleChange}
                  min="1"
                />
                {recipe.cookingTime && (
                  <span className="time-display">{formatTime(recipe.cookingTime)}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  <FaUtensils /> Порции
                </label>
                <input
                  type="number"
                  name="servings"
                  value={recipe.servings}
                  onChange={handleChange}
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>
                  <FaFire /> Калории (на порция)
                </label>
                <input
                  type="number"
                  name="calories"
                  value={recipe.calories}
                  onChange={handleChange}
                  min="1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Табове за съставки и инструкции */}
        <div className="form-tabs">
          <button
            type="button"
            className={`form-tab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <FaListUl /> Съставки
          </button>
          <button
            type="button"
            className={`form-tab ${activeTab === 'instructions' ? 'active' : ''}`}
            onClick={() => setActiveTab('instructions')}
          >
            <FaBookOpen /> Инструкции
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'general' && (
            <div className="form-group">
              <label>Съставки (по една на ред)</label>
              <textarea
                name="ingredients"
                value={Array.isArray(recipe.ingredients) ? recipe.ingredients.join('\n') : recipe.ingredients}
                onChange={handleChange}
                rows="8"
                required
              />
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="form-group">
              <label>Инструкции (по една стъпка на ред)</label>
              <textarea
                name="instructions"
                value={Array.isArray(recipe.instructions) ? recipe.instructions.join('\n') : recipe.instructions}
                onChange={handleChange}
                rows="8"
                required
              />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button">
            <FaSave /> Запази промените
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipe;