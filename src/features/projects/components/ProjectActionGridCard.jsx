import { motion } from 'framer-motion'
import { useFavorites } from '../hooks/useFavorites';
import { useNavigate } from 'react-router-dom';
import * as Icon from 'lucide-react';

function ProjectActionGridCard({feature}) {
    const navigate = useNavigate();
    const { favorites, toggleFavorite, isFavorite } = useFavorites('project-favorites');
    const CurrentIcon = Icon[feature.icon] || Icon.HelpCircle;
    const favorite = isFavorite(feature.id);

    return (
        <motion.div
            key={feature.id}
            className={`relative rounded-xl p-6 border transition-all cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:hover:border-purple-500 bg-purple-50 border-purple-200 hover:border-purple-400`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(feature.id)}
        >
            {/* Favorite Star */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(feature.id);
                }}
                className={`absolute top-2 right-2 p-1 rounded transition-all z-10 ${favorite
                    ? 'text-yellow-400'
                    : 'dark:text-gray-500 dark:hover:text-yellow-400 text-gray-400 hover:text-yellow-500'
                    }`}
            >
                <Icon.Star className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
            </button>

            {/* Icon - Purple circular background with white icon */}
            <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-purple-600 flex items-center justify-center">
                <CurrentIcon className="w-7 h-7 text-white" />
            </div>

            {/* Label */}
            <div className={`text-xs font-medium text-center dark:text-white text-gray-900`}>
                {feature.label}
            </div>

            {/* Subtitle */}
            <div className={`text-xs text-center mt-1 dark:text-gray-400 text-gray-600`}>
                {feature.subtitle}
            </div>
        </motion.div>
    )
}

export default ProjectActionGridCard



