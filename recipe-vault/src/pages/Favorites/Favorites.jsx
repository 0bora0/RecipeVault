import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFavorite } from '../../features/recipes/recipeSlice';
import RecipeCard from '../../components/RecipeCard';
import { FaHeart, FaRegHeart, FaHeartBroken } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Favorites.css';

export default function Favorites() {
  const favorites = useSelector(state => state.recipes.favorites);
  const dispatch = useDispatch();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 120 }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  };

  return (
    <>
      <Header />
      <div className="favorites-page">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-content">
            <h1>
              <span className="heart-icon"><FaHeart /></span>
              Favorite recipes
            </h1>
            <p className="subtitle">Your saved culinary masterpieces</p>
          </div>
          <div className="header-decoration"></div>
        </motion.div>

        <div className="page-container">
          {favorites.length === 0 ? (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="empty-icon">
                <FaHeartBroken />
              </div>
              <h3>You don't have any favorite recipes yet.</h3>
              <p>Mark recipes as favorites to see them here</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a href="/" className="explore-btn">
                Browse recipes
                </a>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              className="favorites-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {favorites.map(recipe => (
                <motion.div 
                  key={recipe.id}
                  className="favorite-card-wrapper"
                  variants={itemVariants}
                  whileHover="hover"
                >
                  <RecipeCard recipe={recipe} />
                  <motion.button
                    className="remove-favorite-btn"
                    onClick={() => dispatch(removeFavorite(recipe.id))}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Премахни от любими"
                  >
                    <FaHeart className="filled-heart" />
                    <FaRegHeart className="outline-heart" />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}