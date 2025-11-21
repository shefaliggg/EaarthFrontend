import React from 'react';
import { Field } from '../common/UnifiedFields';
import { Heart } from 'lucide-react';

export default function HealthDetails({ profile, setProfile, isEditing, isDarkMode }) {
  return (
    <div className={`rounded-xl border p-6 shadow-md ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="space-y-6">
        <h4 className={`font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Heart className="w-5 h-5" /> HEALTH & DIETARY
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field 
            label="DIETARY REQUIREMENTS" 
            value={profile.dietaryRequirements} 
            onChange={(e) => setProfile({ ...profile, dietaryRequirements: e.target.value.toUpperCase() })} 
            type="textarea" 
            placeholder="E.G. VEGETARIAN, VEGAN, HALAL, KOSHER" 
            isEditing={isEditing} 
            isDarkMode={isDarkMode} 
          />
          
          <Field 
            label="ALLERGIES" 
            value={profile.allergies} 
            onChange={(e) => setProfile({ ...profile, allergies: e.target.value.toUpperCase() })} 
            type="textarea" 
            placeholder="E.G. PEANUTS, SHELLFISH, DAIRY" 
            isEditing={isEditing} 
            isDarkMode={isDarkMode} 
          />
        </div>
      </div>
    </div>
  );
}