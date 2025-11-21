function ViewToggleButton({ view, onViewChange }) {
    return (
        <div className={`inline-flex rounded-3xl border-2  border-gray-200 dark:border-gray-700`}>
            <button
                onClick={() => onViewChange('grid')}
                className={`px-4 py-2 rounded-l-3xl font-semibold transition-all ${view === 'grid'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-600 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white'
                    }`}
            >
                GRID VIEW
            </button>
            <button
                onClick={() => onViewChange('list')}
                className={`px-4 py-2 rounded-r-3xl font-semibold transition-all ${view === 'list'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-600 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white'
                    }`}
            >
                LIST VIEW
            </button>
        </div>
    );
}

export default ViewToggleButton;