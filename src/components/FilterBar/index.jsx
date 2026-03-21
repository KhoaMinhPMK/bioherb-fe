import React, { useState, useCallback, useRef } from 'react';
import { Search, X } from 'lucide-react';
import Dropdown from '../Dropdown';
import './FilterBar.scss';
const FilterBar = ({ searchPlaceholder = 'Tìm kiếm...', onSearch, filters = [], onFilterChange, actions, }) => {
    const [searchValue, setSearchValue] = useState('');
    const [activeFilters, setActiveFilters] = useState({});
    const debounceRef = useRef(null);
    const handleSearch = useCallback((value) => {
        setSearchValue(value);
        if (debounceRef.current)
            clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onSearch?.(value);
        }, 300);
    }, [onSearch]);
    const handleFilterChange = useCallback((key, value) => {
        const updated = { ...activeFilters, [key]: value };
        if (!value)
            delete updated[key];
        setActiveFilters(updated);
        onFilterChange?.(updated);
    }, [activeFilters, onFilterChange]);
    const clearSearch = () => {
        setSearchValue('');
        onSearch?.('');
    };
    const hasActiveFilters = Object.keys(activeFilters).length > 0;
    return (<div className="filter-bar">
            <div className="filter-bar__left">
                <div className="filter-bar__search">
                    <Search size={16} className="filter-bar__search-icon" aria-hidden="true"/>
                    <label htmlFor="filter-search" className="sr-only">{searchPlaceholder}</label>
                    <input id="filter-search" type="text" placeholder={searchPlaceholder} value={searchValue} onChange={(e) => handleSearch(e.target.value)} className="filter-bar__search-input"/>
                    {searchValue && (<button className="filter-bar__search-clear" onClick={clearSearch} aria-label="Xoá tìm kiếm">
                            <X size={14}/>
                        </button>)}
                </div>

                {filters.length > 0 && (<div className="filter-bar__filters">
                        {filters.map((filter) => (
                            <Dropdown
                                key={filter.key}
                                className="filter-bar__dropdown"
                                value={activeFilters[filter.key] || ''}
                                onChange={(val) => handleFilterChange(filter.key, val)}
                                options={filter.options}
                                placeholder={filter.label}
                            />
                        ))}
                        {hasActiveFilters && (<button className="filter-bar__clear-all" onClick={() => {
                    setActiveFilters({});
                    onFilterChange?.({});
                }}>
                                <X size={14}/> Xoá bộ lọc
                            </button>)}
                    </div>)}
            </div>

            {actions && (<div className="filter-bar__actions">
                    {actions}
                </div>)}
        </div>);
};
export default FilterBar;
