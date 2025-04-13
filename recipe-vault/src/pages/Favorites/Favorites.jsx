import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFavorite } from '../../features/recipes/recipeSlice';
import RecipeCard from '../../components/RecipeCard';
import { FaHeartBroken, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../Favorites/Favorites.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import '../../App.css';

export default function Favorites() {
  const favorites = useSelector(state => state.recipes.favorites);
  const dispatch = useDispatch();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <>
         <Header />
    <motion.div 
      className="favorites-page py-8 px-4 md:px-8 min-h-screen bg-gradient-to-b from-rose-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center mb-8 text-rose-600"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <FaHeart className="inline mr-3" /> Любими рецепти
        </motion.h1>
        
        {favorites.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <FaHeartBroken className="mx-auto text-4xl text-rose-300 mb-4" />
            <p className="text-xl text-gray-600">Все още нямате любими рецепти</p>
            <p className="text-gray-500 mt-2">Добавете някоя, за да я видите тук!</p>
          </motion.div>
        ) : (
          <motion.div 
            className="favorites-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {favorites.map(recipe => (
              <motion.div 
                key={recipe.id} 
                className="favorite-item relative group"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <RecipeCard recipe={recipe} />
                <motion.button 
                  onClick={() => dispatch(removeFavorite(recipe.id))}
                  className="remove-favorite-btn absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-lg text-rose-500 hover:text-white hover:bg-rose-600 transition-all duration-300 group-hover:scale-110"
                  whileTap={{ scale: 0.9 }}
                  title="Премахни от любими"
                >
                  <FaHeartBroken className="text-xl" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
    <Footer />
</>
  );
}