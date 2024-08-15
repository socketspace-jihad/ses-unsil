// TabBar.js
import React from 'react';

const TabBar = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <div>
            <div className="flex space-x-2 mb-4">
                {Object.keys(categories).map((categoryId) => (
                    <button
                        key={categoryId}
                        onClick={() => onSelectCategory(categoryId)}
                        className={`px-4 py-2 rounded ${selectedCategory === categoryId ? 'bg-teal-500 text-white' : 'bg-gray-200 text-black'}`}
                    >
                        Category {categoryId}
                    </button>
                ))}
            </div>
            {/* Displaying limits under TabBar */}
            {selectedCategory && categories[selectedCategory] && (
                <div className="p-2 border border-gray-300 rounded bg-gray-50">
                    <p><strong>Batas Bawah Nilai TPA:</strong> {categories[selectedCategory].tpa_score_lower_limit}</p>
                    <p><strong>Batas Atas Nilai TPA:</strong> {categories[selectedCategory].tpa_score_upper_limit}</p>
                </div>
            )}
        </div>
    );
};

export default TabBar;
