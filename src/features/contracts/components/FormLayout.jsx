import React from 'react';

export default function FormLayout({ title, children, onSubmit, onCancel, isSubmitting }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          {children}

          {/* Form Actions */}
          <div className="bg-white p-6 rounded-lg shadow sticky bottom-0">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? 'Saving...' : 'Save Contract'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}