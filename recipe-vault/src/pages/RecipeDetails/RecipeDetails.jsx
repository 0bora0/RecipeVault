import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchRecipeDetails } from "../../api/spoonacular";
import NutritionFacts from "../../components/NutritionFacts";
import { FaUtensils, FaListUl, FaBookOpen, FaClock, FaChartPie } from "react-icons/fa";
import { motion } from "framer-motion";
import Loader from "../../components/Loader";
import "../RecipeDetails/RecipeDetails.css";

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ingredients');

  useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true);
      try {
        const data = await fetchRecipeDetails(id);
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };
    loadRecipe();
  }, [id]);

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  if (loading) return <Loader />;
  if (!recipe) return (
    <motion.div 
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <FaUtensils className="display-1 text-danger mb-4" />
      <h1 className="h2 text-danger mb-2">Рецептата не е намерена</h1>
      <p className="lead text-secondary">Моля, опитайте с друга рецепта</p>
    </motion.div>
  );

  return (
    <motion.div 
      className="min-vh-100 bg-light py-5 px-3"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container">
        <motion.div className="row mb-5" variants={slideUp}>
          <div className="col-md-6 mb-4 mb-md-0">
            <motion.img 
              src={recipe.image} 
              alt={recipe.title}
              className="img-fluid rounded shadow"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </div>
          
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <motion.h1 
              className="display-5 fw-bold text-danger mb-4"
              variants={slideUp}
            >
              {recipe.title}
            </motion.h1>

            <div className="d-flex flex-wrap gap-3 mb-4">
              {recipe.readyInMinutes && (
                <motion.div 
                  className="d-flex align-items-center bg-white px-3 py-2 rounded shadow-sm"
                  variants={slideUp}
                  whileHover={{ y: -2 }}
                >
                  <FaClock className="text-warning me-2" />
                  <span className="text-secondary">{recipe.readyInMinutes} минути</span>
                </motion.div>
              )}
              {recipe.servings && (
                <motion.div 
                  className="d-flex align-items-center bg-white px-3 py-2 rounded shadow-sm"
                  variants={slideUp}
                  whileHover={{ y: -2 }}
                >
                  <FaUtensils className="text-warning me-2" />
                  <span className="text-secondary">{recipe.servings} порции</span>
                </motion.div>
              )}
            </div>

            {recipe.summary && (
              <motion.div 
                className="text-muted mb-4"
                variants={slideUp}
                dangerouslySetInnerHTML={{ __html: recipe.summary }}
              />
            )}
          </div>
        </motion.div>

        <motion.div className="d-flex border-bottom mb-4" variants={slideUp}>
          <button
            className={`btn me-3 ${activeTab === 'ingredients' ? 'btn-danger' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('ingredients')}
          >
            <FaListUl className="me-2" /> Съставки
          </button>
          <button
            className={`btn me-3 ${activeTab === 'instructions' ? 'btn-danger' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('instructions')}
          >
            <FaBookOpen className="me-2" /> Инструкции
          </button>
          {recipe.nutrition && (
            <button
              className={`btn ${activeTab === 'nutrition' ? 'btn-danger' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('nutrition')}
            >
              <FaChartPie className="me-2" /> Хранителни стойности
            </button>
          )}
        </motion.div>

        <motion.div variants={slideUp}>
          {activeTab === 'ingredients' && (
            <div className="row">
              {recipe.ingredients.map((ingredient, index) => (
                <motion.div
                  key={index}
                  className="col-md-6 col-lg-4 mb-3"
                  whileHover={{ y: -3 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex align-items-center">
                      <div className="rounded-circle bg-warning me-3" style={{ width: '10px', height: '10px' }}></div>
                      <span className="text-secondary">{ingredient}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="card p-4 shadow mb-4">
              {recipe.instructions.split(". ").map((sentence, index) => (
                <motion.div
                  key={index}
                  className="mb-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <p className="mb-0 text-secondary">
                    <strong className="text-danger me-2">{index + 1}.</strong>
                    {sentence.trim()}
                    {!sentence.endsWith(".") && "."}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'nutrition' && recipe.nutrition && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <NutritionFacts nutrition={recipe.nutrition} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
