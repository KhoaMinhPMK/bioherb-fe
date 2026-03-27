import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Plus, Trash2, Save } from 'lucide-react';
import { GACP_ENTRY_TYPES, AUTO_FILL_RULES } from '../gacpConstants';
import GACPIconMap from '../gacpIcons';
import { useData } from '../../../contexts/DataContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import './GACPSpreadsheet.scss';

const today = () => new Date().toISOString().slice(0, 10);
const genId = () => `GACP-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

/**
 * GACPSpreadsheet — Excel-like editable table for GACP diary entries.
 *
 * Receives `selectedType` from parent (no internal dropdown).
 * Full-width table: click cell → edit inline.
 *
 * @param {string} selectedType - GACP entry type ID from parent
 */
function GACPSpreadsheet({ selectedType }) {
    const { gacpEntries, plots, addGacpEntry, updateGacpEntry, deleteGacpEntry } = useData();
    const { currentUser } = useAuth();
    const { addToast } = useToast();

    // ─── State ──────────────────────────────────────
    const [selectedPlot, setSelectedPlot] = useState('all');
    const [editingCell, setEditingCell] = useState(null); // { rowId, colKey }
    const [editValue, setEditValue] = useState('');
    const [newRows, setNewRows] = useState([]);
    const inputRef = useRef(null);

    const typeConfig = GACP_ENTRY_TYPES.find((t) => t.id === selectedType);
    const TypeIcon = GACPIconMap[typeConfig?.iconName];

    // ─── Filtered entries for selected type + plot ──
    const rows = useMemo(() => {
        let entries = gacpEntries.filter((e) => e.type === selectedType);
        if (selectedPlot !== 'all') entries = entries.filter((e) => e.plotId === selectedPlot);
        return entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [gacpEntries, selectedType, selectedPlot]);

    // ─── Auto-fill helpers ──────────────────────────
    const getAutoFillValue = useCallback(
        (colKey, autoRule) => {
            if (autoRule === AUTO_FILL_RULES.TODAY) return today();
            if (autoRule === AUTO_FILL_RULES.USER) return currentUser?.name || '';
            if (autoRule === AUTO_FILL_RULES.AUTO_LOT) {
                const prefix = selectedType === 'harvest' ? 'TH' : 'LH';
                const existing = rows.map((r) => r.data[colKey]).filter(Boolean);
                const maxNum = existing.reduce((max, code) => {
                    const num = parseInt(code.replace(/\D/g, ''), 10);
                    return isNaN(num) ? max : Math.max(max, num);
                }, 0);
                return `${prefix}-${String(maxNum + 1).padStart(3, '0')}`;
            }
            if (typeof autoRule === 'string') return autoRule;
            return '';
        },
        [currentUser, rows, selectedType],
    );

    // ─── Create new empty row ───────────────────────
    const addNewRow = useCallback(() => {
        if (!typeConfig) return;
        const data = {};
        typeConfig.columns.forEach((col) => {
            const autoRule = typeConfig.columnAutoFill?.[col];
            data[col] = autoRule ? getAutoFillValue(col, autoRule) : '';
        });
        const newRow = {
            id: genId(),
            type: selectedType,
            plotId: selectedPlot === 'all' ? plots[0]?.id || 'P01' : selectedPlot,
            date: today(),
            createdBy: currentUser?.id || 'U01',
            createdAt: new Date().toISOString(),
            note: '',
            data,
            _isNew: true,
        };
        setNewRows((prev) => [...prev, newRow]);
        setTimeout(() => {
            setEditingCell({ rowId: newRow.id, colKey: typeConfig.columns[0] });
            setEditValue(data[typeConfig.columns[0]] || '');
        }, 50);
    }, [typeConfig, selectedType, selectedPlot, plots, currentUser, getAutoFillValue]);

    // ─── Save / Delete row ──────────────────────────
    const saveRow = useCallback(
        async (row) => {
            if (row._isNew) {
                const { _isNew, ...entry } = row;
                await addGacpEntry(entry);
                setNewRows((prev) => prev.filter((r) => r.id !== row.id));
                addToast('Đã lưu dòng mới', 'success');
            } else {
                await updateGacpEntry(row.id, { data: row.data });
            }
        },
        [addGacpEntry, updateGacpEntry, addToast],
    );

    const handleDeleteRow = useCallback(
        async (row) => {
            if (row._isNew) {
                setNewRows((prev) => prev.filter((r) => r.id !== row.id));
            } else {
                await deleteGacpEntry(row.id);
                addToast('Đã xóa dòng', 'success');
            }
        },
        [deleteGacpEntry, addToast],
    );

    // ─── Cell edit handlers ─────────────────────────
    const startEdit = useCallback((rowId, colKey, currentValue) => {
        setEditingCell({ rowId, colKey });
        setEditValue(currentValue || '');
    }, []);

    const commitEdit = useCallback(
        (rowId, colKey) => {
            const allRows = [...rows, ...newRows];
            const row = allRows.find((r) => r.id === rowId);
            if (row) {
                row.data[colKey] = editValue;
                if (!row._isNew) {
                    saveRow(row);
                } else {
                    setNewRows((prev) =>
                        prev.map((r) => (r.id === rowId ? { ...r, data: { ...r.data, [colKey]: editValue } } : r)),
                    );
                }
            }
            setEditingCell(null);
        },
        [editValue, rows, newRows, saveRow],
    );

    const handleKeyDown = useCallback(
        (e, rowId, colIdx) => {
            if (!typeConfig) return;
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                commitEdit(rowId, typeConfig.columns[colIdx]);
            } else if (e.key === 'Tab') {
                e.preventDefault();
                commitEdit(rowId, typeConfig.columns[colIdx]);
                const nextColIdx = colIdx + 1;
                if (nextColIdx < typeConfig.columns.length) {
                    const allR = [...rows, ...newRows];
                    const row = allR.find((r) => r.id === rowId);
                    if (row) {
                        setTimeout(
                            () =>
                                startEdit(
                                    rowId,
                                    typeConfig.columns[nextColIdx],
                                    row.data[typeConfig.columns[nextColIdx]] || '',
                                ),
                            30,
                        );
                    }
                }
            } else if (e.key === 'Escape') {
                setEditingCell(null);
            }
        },
        [commitEdit, startEdit, typeConfig, rows, newRows],
    );

    // Focus input when editing starts
    useEffect(() => {
        if (editingCell && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingCell]);

    // Reset new rows when type changes
    useEffect(() => {
        setNewRows([]);
        setEditingCell(null);
    }, [selectedType]);

    // Guard
    if (!typeConfig) return null;

    // ─── Render cell ────────────────────────────────
    const renderCell = (row, colKey, colIdx, colType) => {
        const isEditing = editingCell?.rowId === row.id && editingCell?.colKey === colKey;
        const value = row.data[colKey] || '';
        const options = typeConfig.columnOptions?.[colKey];
        const placeholder = typeConfig.columnPlaceholders?.[colKey] || '';

        if (isEditing) {
            if (colType === 'select' && options) {
                return (
                    <select
                        ref={inputRef}
                        className="gacp-ss__cell-select"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => commitEdit(row.id, colKey)}
                        onKeyDown={(e) => handleKeyDown(e, row.id, colIdx)}
                    >
                        <option value="">-- Chọn --</option>
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );
            }
            if (colType === 'date') {
                return (
                    <input
                        ref={inputRef}
                        type="date"
                        className="gacp-ss__cell-input"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => commitEdit(row.id, colKey)}
                        onKeyDown={(e) => handleKeyDown(e, row.id, colIdx)}
                    />
                );
            }
            if (colType === 'number') {
                return (
                    <input
                        ref={inputRef}
                        type="number"
                        className="gacp-ss__cell-input"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => commitEdit(row.id, colKey)}
                        onKeyDown={(e) => handleKeyDown(e, row.id, colIdx)}
                        placeholder={placeholder}
                    />
                );
            }
            if (colType === 'textarea') {
                return (
                    <textarea
                        ref={inputRef}
                        className="gacp-ss__cell-textarea"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => commitEdit(row.id, colKey)}
                        onKeyDown={(e) => handleKeyDown(e, row.id, colIdx)}
                        placeholder={placeholder}
                        rows={2}
                    />
                );
            }
            return (
                <input
                    ref={inputRef}
                    type="text"
                    className="gacp-ss__cell-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => commitEdit(row.id, colKey)}
                    onKeyDown={(e) => handleKeyDown(e, row.id, colIdx)}
                    placeholder={placeholder}
                />
            );
        }

        // Display mode
        const displayValue =
            colType === 'select' && options ? options.find((o) => o.value === value)?.label || value : value;

        return (
            <div
                className={`gacp-ss__cell-display ${!displayValue ? 'gacp-ss__cell-display--empty' : ''}`}
                onClick={() => startEdit(row.id, colKey, value)}
                title={displayValue || placeholder}
            >
                {displayValue || <span className="gacp-ss__placeholder">{placeholder || '...'}</span>}
            </div>
        );
    };

    const allDisplayRows = [...rows, ...newRows];

    return (
        <div className="gacp-ss">
            {/* ── Compact Toolbar ─────────────────── */}
            <div className="gacp-ss__toolbar">
                <span className="gacp-ss__toolbar-title" style={{ color: typeConfig.color }}>
                    {TypeIcon && <TypeIcon size={16} />}
                    <strong>{typeConfig.label}</strong>
                </span>

                {plots.length > 1 && (
                    <select
                        className="gacp-ss__plot-select"
                        value={selectedPlot}
                        onChange={(e) => setSelectedPlot(e.target.value)}
                    >
                        <option value="all">Tất cả VT</option>
                        {plots.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                )}

                <span className="gacp-ss__count">{allDisplayRows.length} dòng</span>

                <div className="gacp-ss__toolbar-right">
                    <button className="btn btn--primary btn--sm" onClick={addNewRow}>
                        <Plus size={14} /> Thêm dòng
                    </button>
                    {newRows.length > 0 && (
                        <button
                            className="btn btn--success btn--sm"
                            onClick={async () => {
                                for (const row of newRows) {
                                    await saveRow(row);
                                }
                                addToast(`Đã lưu ${newRows.length} dòng`, 'success');
                            }}
                        >
                            <Save size={14} /> Lưu tất cả ({newRows.length})
                        </button>
                    )}
                </div>
            </div>

            {/* ── Spreadsheet Table ──────────────── */}
            <div className="gacp-ss__table-wrapper">
                <table className="gacp-ss__table">
                    <thead>
                        <tr>
                            <th className="gacp-ss__th gacp-ss__th--stt">STT</th>
                            <th className="gacp-ss__th gacp-ss__th--date">Ngày</th>
                            {typeConfig.columns.map((col, i) => (
                                <th
                                    key={col}
                                    className="gacp-ss__th"
                                    style={{ minWidth: typeConfig.columnWidths?.[i] || 100 }}
                                >
                                    {typeConfig.columnLabels[i]}
                                </th>
                            ))}
                            <th className="gacp-ss__th gacp-ss__th--note">Ghi chú</th>
                            <th className="gacp-ss__th gacp-ss__th--actions" />
                        </tr>
                    </thead>
                    <tbody>
                        {allDisplayRows.length === 0 && (
                            <tr>
                                <td colSpan={typeConfig.columns.length + 4} className="gacp-ss__empty">
                                    Chưa có dữ liệu. Bấm <strong>+ Thêm dòng</strong> để bắt đầu.
                                </td>
                            </tr>
                        )}
                        {allDisplayRows.map((row, rowIdx) => (
                            <tr key={row.id} className={`gacp-ss__row ${row._isNew ? 'gacp-ss__row--new' : ''}`}>
                                <td className="gacp-ss__td gacp-ss__td--stt">{rowIdx + 1}</td>
                                <td className="gacp-ss__td gacp-ss__td--date">
                                    {editingCell?.rowId === row.id && editingCell?.colKey === '_date' ? (
                                        <input
                                            ref={inputRef}
                                            type="date"
                                            className="gacp-ss__cell-input"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            onBlur={() => {
                                                row.date = editValue;
                                                if (!row._isNew) updateGacpEntry(row.id, { date: editValue });
                                                else
                                                    setNewRows((prev) =>
                                                        prev.map((r) =>
                                                            r.id === row.id ? { ...r, date: editValue } : r,
                                                        ),
                                                    );
                                                setEditingCell(null);
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="gacp-ss__cell-display"
                                            onClick={() => startEdit(row.id, '_date', row.date)}
                                        >
                                            {row.date}
                                        </div>
                                    )}
                                </td>
                                {typeConfig.columns.map((col, colIdx) => (
                                    <td key={col} className="gacp-ss__td">
                                        {renderCell(row, col, colIdx, typeConfig.columnTypes[colIdx])}
                                    </td>
                                ))}
                                <td className="gacp-ss__td gacp-ss__td--note">
                                    {editingCell?.rowId === row.id && editingCell?.colKey === '_note' ? (
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            className="gacp-ss__cell-input"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            onBlur={() => {
                                                row.note = editValue;
                                                if (!row._isNew) updateGacpEntry(row.id, { note: editValue });
                                                else
                                                    setNewRows((prev) =>
                                                        prev.map((r) =>
                                                            r.id === row.id ? { ...r, note: editValue } : r,
                                                        ),
                                                    );
                                                setEditingCell(null);
                                            }}
                                            placeholder="Ghi chú..."
                                        />
                                    ) : (
                                        <div
                                            className="gacp-ss__cell-display gacp-ss__cell-display--note"
                                            onClick={() => startEdit(row.id, '_note', row.note || '')}
                                        >
                                            {row.note || <span className="gacp-ss__placeholder">...</span>}
                                        </div>
                                    )}
                                </td>
                                <td className="gacp-ss__td gacp-ss__td--actions">
                                    {row._isNew && (
                                        <button className="gacp-ss__btn-save" onClick={() => saveRow(row)} title="Lưu">
                                            <Save size={14} />
                                        </button>
                                    )}
                                    <button
                                        className="gacp-ss__btn-del"
                                        onClick={() => handleDeleteRow(row)}
                                        title="Xóa"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

GACPSpreadsheet.propTypes = {
    selectedType: PropTypes.string.isRequired,
};

export default GACPSpreadsheet;
