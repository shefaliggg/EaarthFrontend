import { Grid3x3, List } from "lucide-react";

function ViewToggleButton({ view, onViewChange }) {
    return (
        <div className={`flex gap-2`}>
            <button
                onClick={() => onViewChange('grid')}
                className={`p-3 rounded-md font-semibold transition-all ${view === 'grid'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white'
                    }`}
            >
                <Grid3x3 className="w-6 h-6" />
            </button>
            <button
                onClick={() => onViewChange('list')}
                className={`p-3 rounded-md font-semibold transition-all ${view === 'list'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white'
                    }`}
            >
                <List className="w-6 h-6" />
            </button>
        </div>
    );
}

export default ViewToggleButton;