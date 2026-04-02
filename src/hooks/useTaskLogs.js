import { useState, useMemo, useCallback } from 'react';
import { useData } from '../contexts/DataContext';

/**
 * Custom hook for task log data with client-side filtering.
 * Data comes from DataContext (API-backed).
 *
 * Usage:
 *   const { data, loading, error, filters, setFilters } = useTaskLogs();
 */
const useTaskLogs = (initialFilters = {}) => {
    const { taskLogs, isLoading: loading } = useData();
    const [error] = useState(null);
    const [filters, setFilters] = useState(initialFilters);
    const [searchTerm, setSearchTerm] = useState('');

    const data = useMemo(() => {
        let result = [...taskLogs];
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (log) =>
                    (log.task || '').toLowerCase().includes(term) ||
                    (log.worker || '').toLowerCase().includes(term) ||
                    (log.plot || '').toLowerCase().includes(term) ||
                    (log.notes || '').toLowerCase().includes(term),
            );
        }
        if (filters.status) {
            result = result.filter((log) => log.status === filters.status);
        }
        if (filters.cycle) {
            result = result.filter((log) => log.cropCycleId === filters.cycle || log.cycle === filters.cycle);
        }
        return result;
    }, [taskLogs, searchTerm, filters]);

    const handleSearch = useCallback((term) => setSearchTerm(term), []);
    const handleFilterChange = useCallback((newFilters) => setFilters((prev) => ({ ...prev, ...newFilters })), []);

    return {
        data,
        loading,
        error,
        filters,
        searchTerm,
        setFilters: handleFilterChange,
        setSearchTerm: handleSearch,
    };
};

export default useTaskLogs;
