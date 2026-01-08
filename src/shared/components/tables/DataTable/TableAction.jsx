import React, { useState, useEffect, useRef } from 'react';
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react';

export default function TableActions({
  onView,
  onEdit,
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = true
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 pr-5">
      {showView && onView && (
        <button
          onClick={onView}
          className="p-2 rounded-md transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
          aria-label="View details"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
      
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-md transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
          aria-label="More actions"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-popover shadow-lg z-50 animate-fadeIn">
            <div className="py-1">
              {showView && onView && (
                <button
                  onClick={() => {
                    onView();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-popover-foreground transition-colors hover:bg-muted"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              )}
              
              {showEdit && onEdit && (
                <button
                  onClick={() => {
                    onEdit();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-popover-foreground transition-colors hover:bg-muted"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              )}
              
              {showDelete && onDelete && (
                <>
                  {(showView || showEdit) && (
                    <div className="my-1 border-t border-border" />
                  )}
                  <button
                    onClick={() => {
                      onDelete();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}