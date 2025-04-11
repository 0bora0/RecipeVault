import { useState } from "react";
import { fetchRecipes } from "../api/spoonacular";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    const recipes = await fetchRecipes(query);
    onSearch(recipes);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Търси рецепта..."
      />
      <button onClick={handleSearch}>Търси</button>
    </div>
  );
}