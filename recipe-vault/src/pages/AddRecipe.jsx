import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addRecipe } from '../features/recipes/recipeSlice';
import { useNavigate } from 'react-router-dom';

export default function AddRecipe() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    ingredients: '',
    instructions: '',
    image: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
              e.preventDefault();
              dispatch(addRecipe({
                title: formData.title,
                category: formData.category,
                ingredients: formData.ingredients.split('\n').filter(i => i.trim()),
                instructions: formData.instructions,
                image: formData.image
              }));
              navigate('/');
            };

  return (
    <div className="add-recipe-form">
      <h2>Добави нова рецепта</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Заглавие"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        
        <select
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          required
        >
          <option value="">Избери категория</option>
          <option value="Веган">Веган</option>
          <option value="Десерти">Десерти</option>
          <option value="Основни">Основни</option>
        </select>

        <textarea
          placeholder="Съставки (по една на ред)"
          value={formData.ingredients}
          onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
          required
        />

        <textarea
          placeholder="Инструкции"
          value={formData.instructions}
          onChange={(e) => setFormData({...formData, instructions: e.target.value})}
          required
        />

        <input
          type="text"
          placeholder="URL на изображение"
          value={formData.image}
          onChange={(e) => setFormData({...formData, image: e.target.value})}
        />

        <button type="submit">Запази рецепта</button>
      </form>
    </div>
  );
}