import { motion } from 'framer-motion'
import * as Icon from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { convertTitleToUrl } from '../../../shared/config/utils';

function ProjectActionListCard({ feature }) {
    const navigate = useNavigate();
    const CurrentIcon = Icon[feature.icon] || Icon.HelpCircle;

    return (
        <motion.div
            key={feature.id}
            className={`relative rounded-xl p-6 border transition-all cursor-pointer dark:hover:border-gray-300 bg-background hover:border-gray-200`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(convertTitleToUrl(feature.label))}
        >
            <button
                className="w-full flex items-center gap-4 text-left"
            >
                <div className="w-12 h-12 rounded-xl bg-[#9333ea] flex items-center justify-center flex-shrink-0">
                    <CurrentIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                    <h3 className={`font-medium text-gray-900 dark:text-white`}>
                        {feature.label}
                    </h3>
                    <p className={`text-sm text-gray-600 dark:text-gray-400`}>
                        {feature.subtitle}
                    </p>
                </div>
                <Icon.ChevronRight className={`w-5 h-5 shrink-0 text-gray-600 dark:text-gray-400`} />
            </button>
        </motion.div>
    )
}

export default ProjectActionListCard







