import { ArrowLeft } from 'lucide-react';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function ProjectActivities() {
    const { pathname } = useLocation();
    const currentPage = pathname.split("/").at(-1)
    console.log("params", currentPage )
    const navigate = useNavigate();
    return (
        <div className={`min-h-screen `}>
            <div>
                {/* Page Header with Back Button */}
                <div className="mb-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className={`text-3xl font-bold mb-2 dark:text-white text-gray-900`}>
                                {currentPage || 'PROJECT'}
                            </h1>
                            <p className={`text-sm text-foreground`}>
                                {''}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate(pathname.split(`/${currentPage}`)[0])}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900`}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="font-bold">BACK</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-6">
                    <p>Content Not Updated yet</p>
                </div>
            </div>
        </div>
    )
}

export default ProjectActivities