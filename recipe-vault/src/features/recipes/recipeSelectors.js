export const selectFilteredRecipes = (state) => {
  const { recipes, searchQuery, selectedCategory } = state.recipes;

  return recipes.filter((recipe) => {
    const searchMatch =
      searchQuery === "" ||
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(recipe.ingredients) &&
        recipe.ingredients.some((ing) =>
          ing.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    const categoryMatch =
      selectedCategory === "" || recipe.category === selectedCategory;

    return searchMatch && categoryMatch;
  });
};
