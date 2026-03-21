import { useState, useMemo, useCallback } from 'react';
import { taskLogs as mockTaskLogs } from '../data/mockData';
/**
 * Custom hook for task log data.
 * Currently returns mock data — swap with API call when backend is ready.
 *
 * Usage:
 *   const { data, loading, error, filters, setFilters } = useTaskLogs();
 */
const useTaskLogs = (initialFilters = {}) => {
    const [loading] = useState(false);
    const [error] = useState(null);
    const [filters, setFilters] = useState(initialFilters);
    const [searchTerm, setSearchTerm] = useState('');
    const data = useMemo(() => {
        let result = [...mockTaskLogs];
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter((log) => log.task.toLowerCase().includes(term) ||
                log.worker.toLowerCase().includes(term) ||
                log.plot.toLowerCase().includes(term));
        }
        if (filters.status) {
            result = result.filter((log) => log.status === filters.status);
        }
        if (filters.cycle) {
            result = result.filter((log) => log.cycle === filters.cycle);
        }
        return result;
    }, [searchTerm, filters]);
    const handleSearch = useCallback((term) => {
        setSearchTerm(term);
    }, []);
    const handleFilterChange = useCallback((newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    }, []);
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
