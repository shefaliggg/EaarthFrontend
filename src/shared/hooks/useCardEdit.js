import { useState } from 'react';

/**
 * Custom hook to manage card editing state across pages
 * Simplifies the pattern of toggling edit mode for individual cards
 */
export const useCardEdit = () => {
  const [editingCard, setEditingCard] = useState(null);

  const toggleCardEdit = (cardName) => {
    setEditingCard(editingCard === cardName ? null : cardName);
  };

  const isEditing = (cardName) => {
    return editingCard === cardName;
  };

  return {
    editingCard,
    toggleCardEdit,
    isEditing
  };
};
