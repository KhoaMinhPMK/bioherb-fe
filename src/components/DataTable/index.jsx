import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import useIsMobile from '../../hooks/useIsMobile';
import './DataTable.scss';

function DataTable({
    columns = [],
    data = [],
    pageSize = 10,
    onRowClick,
    emptyMessage = 'Không có dữ liệu',
    emptyIcon: EmptyIcon = Inbox,
    loading = false,
    stickyHeader = false,
}) {
    const isMobile = useIsMobile(768);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [currentPage, setCurrentPage] = useState(1);

    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key !== key) return { key, direction: 'asc' };
            if (prev.direction === 'asc') return { key, direction: 'desc' };
            return { key: null, direction: null };
        });
        setCurrentPage(1);
    };

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return data;
        return [...data].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
            }
            const strA = String(aVal).toLowerCase();
            const strB = String(bVal).toLowerCase();
            if (strA < strB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (strA > strB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, currentPage, pageSize]);
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, sortedData.length);

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) {
            return <ChevronsUpDown size={14} className="data-table__sort-icon data-table__sort-icon--inactive" />;
        }
        return sortConfig.direction === 'asc'
            ? <ChevronUp size={14} className="data-table__sort-icon" />
            : <ChevronDown size={14} className="data-table__sort-icon" />;
    };

    // --- Pagination Component ---
    const Pagination = () => {
        if (sortedData.length <= pageSize) return null;
        return (
            <div className="data-table__pagination">
                <span className="data-table__pagination-info">
                    {startItem}–{endItem} / {sortedData.length}
                </span>
                <div className="data-table__pagination-controls">
                    <button
                        className="data-table__pagination-btn"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        aria-label="Trang trước"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {isMobile ? (
                        /* Mobile: simplified pagination */
                        <span className="data-table__pagination-page">
                            {currentPage} / {totalPages}
                        </span>
                    ) : (
                        /* Desktop: full pagination */
                        Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                            .map((page, i, arr) => (
                                <React.Fragment key={page}>
                                    {i > 0 && arr[i - 1] !== page - 1 && (
                                        <span className="data-table__pagination-ellipsis">…</span>
                                    )}
                                    <button
                                        className={`data-table__pagination-btn ${page === currentPage ? 'data-table__pagination-btn--active' : ''}`}
                                        onClick={() => setCurrentPage(page)}
                                        aria-label={`Trang ${page}`}
                                        aria-current={page === currentPage ? 'page' : undefined}
                                    >
                                        {page}
                                    </button>
                                </React.Fragment>
                            ))
                    )}

                    <button
                        className="data-table__pagination-btn"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        aria-label="Trang sau"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        );
    };

    // --- Loading State ---
    if (loading) {
        return (
            <div className="data-table__wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((col) => (<th key={col.key}>{col.label}</th>))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="data-table__skeleton-row">
                                {columns.map((col) => (
                                    <td key={col.key}><div className="data-table__skeleton" /></td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    // --- Empty State ---
    if (!data || data.length === 0) {
        return (
            <div className="data-table__empty">
                <EmptyIcon size={40} className="data-table__empty-icon" />
                <p className="data-table__empty-text">{emptyMessage}</p>
            </div>
        );
    }

    // =============================================
    // MOBILE VIEW: Card Layout
    // =============================================
    if (isMobile) {
        return (
            <div className="data-table__container">
                <div className="data-table__cards">
                    {paginatedData.map((row, rowIndex) => (
                        <div
                            key={row.id || rowIndex}
                            className={`data-table__card ${onRowClick ? 'data-table__card--clickable' : ''}`}
                            onClick={onRowClick ? () => onRowClick(row) : undefined}
                        >
                            {columns.map((col) => {
                                // Skip columns explicitly hidden on mobile
                                if (col.hideOnMobile) return null;

                                const value = col.render ? col.render(row[col.key], row) : row[col.key];
                                if (value == null || value === '') return null;

                                return (
                                    <div key={col.key} className="data-table__card-field">
                                        <span className="data-table__card-label">{col.label}</span>
                                        <span className="data-table__card-value">{value}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
                <Pagination />
            </div>
        );
    }

    // =============================================
    // DESKTOP VIEW: Standard Table
    // =============================================
    return (
        <div className="data-table__container">
            <div className="data-table__wrapper">
                <table className={`data-table ${stickyHeader ? 'data-table--sticky' : ''}`}>
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={col.sortable ? 'data-table__th--sortable' : ''}
                                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                                    aria-sort={
                                        sortConfig.key === col.key
                                            ? sortConfig.direction === 'asc' ? 'ascending' : 'descending'
                                            : undefined
                                    }
                                    style={col.width ? { width: col.width } : undefined}
                                >
                                    <span className="data-table__th-content">
                                        {col.label}
                                        {col.sortable && <SortIcon columnKey={col.key} />}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                className={onRowClick ? 'data-table__row--clickable' : ''}
                                onClick={onRowClick ? () => onRowClick(row) : undefined}
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className={col.className || ''}>
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination />
        </div>
    );
}

export default DataTable;
