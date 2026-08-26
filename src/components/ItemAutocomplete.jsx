import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * ItemAutocomplete - Searchable autocomplete input for food or liquor items.
 *
 * Props:
 *   items        {Array}    - Array of { id, name, ...rest } from FoodData or LiquorData
 *   category     {string}   - 'FOOD' | 'LIQUOR' — used when creating the new bill row
 *   onAddItem    {Function} - (name: string, category: string) => void
 *                             Called when staff selects a suggestion; should add a new
 *                             named row to the bill.
 *   placeholder  {string}   - Optional input placeholder text
 *   accentColor  {string}   - Optional CSS color for the highlight ring/suggestion hover
 */
export default function ItemAutocomplete({
  items = [],
  category,
  onAddItem,
  placeholder = 'Type to search items…',
  accentColor = 'var(--primary)',
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const containerRef = useRef(null);

  // Filter items whose name starts with the typed query (case-insensitive)
  const filterItems = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed) return [];
      const lower = trimmed.toLowerCase();
      return items.filter((item) =>
        item.name.toLowerCase().startsWith(lower)
      );
    },
    [items]
  );

  // Handle text input changes
  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    const filtered = filterItems(val);
    setSuggestions(filtered);
    setActiveIndex(-1);
    setIsOpen(filtered.length > 0);
  };

  // Scroll the active suggestion into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.querySelector(
        `[data-index="${activeIndex}"]`
      );
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  // Close dropdown when clicking outside the component
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Confirm selection of the item at `index` in suggestions array
  const confirmSelection = (index) => {
    const chosen = suggestions[index];
    if (!chosen) return;
    onAddItem(chosen.name, category, chosen.price);
    setQuery('');
    setSuggestions([]);
    setActiveIndex(-1);
    setIsOpen(false);
    // Refocus input so staff can type the next item immediately
    inputRef.current?.focus();
  };

  // Keyboard navigation: ArrowDown, ArrowUp, Enter, Escape
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0) {
          confirmSelection(activeIndex);
        } else if (suggestions.length === 1) {
          // Auto-select if only one match
          confirmSelection(0);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleSuggestionMouseDown = (e, index) => {
    // Use mousedown (fires before blur) to avoid losing focus before click
    e.preventDefault();
    confirmSelection(index);
  };

  return (
    <div
      className="autocomplete-wrapper"
      ref={containerRef}
      style={{ '--autocomplete-accent': accentColor }}
    >
      <div className="autocomplete-input-row">
        <span className="autocomplete-search-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          ref={inputRef}
          type="text"
          className="form-control autocomplete-input"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `ac-item-${category}-${activeIndex}` : undefined
          }
          role="combobox"
        />
        {query && (
          <button
            type="button"
            className="autocomplete-clear-btn"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setIsOpen(false);
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
            tabIndex={-1}
            aria-label="Clear search"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="autocomplete-dropdown"
          role="listbox"
          aria-label={`${category} item suggestions`}
        >
          {suggestions.slice(0, 50).map((item, index) => (
            <li
              key={item.id || item.name || index}
              id={`ac-item-${category}-${index}`}
              data-index={index}
              role="option"
              aria-selected={index === activeIndex}
              className={`autocomplete-option${index === activeIndex ? ' autocomplete-option--active' : ''}`}
              onMouseDown={(e) => handleSuggestionMouseDown(e, index)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span className="autocomplete-option-name">{item.name}</span>
              {item.price !== undefined && item.price !== null && item.price !== '' && (
                <span className="autocomplete-option-meta">₹{item.price}</span>
              )}
              {item.size && (
                <span className="autocomplete-option-meta">{item.size}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
