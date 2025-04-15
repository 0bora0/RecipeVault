import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchQuery, setCategoryFilter } from '../features/recipes/recipeSlice';

const CATEGORIES = [
  'italian', 'asian', 'mexican', 
  'american', 'mediterranean', 'vegetarian'
];

export default function SearchAndFilter() {
  const dispatch = useDispatch();
  const [localSearch, setLocalSearch] = useState('');

  const handleSearch = () => {
    dispatch(setSearchQuery(localSearch));
  };

  const handleCategoryChange = (e) => {
    dispatch(setCategoryFilter(e.target.value));
  };

  return (
    <div className="search-filter">
      <div className="search-box">
        <input
          type="text"
          placeholder="Търси рецепти..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>
          <i className="fa fa-search"></i>
        </button>
      </div>
      
      <select onChange={handleCategoryChange} defaultValue="">
        <option value="">All Categories</option>
        {CATEGORIES.map(category => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}