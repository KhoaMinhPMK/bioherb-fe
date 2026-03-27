import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import FormField from '../../components/FormField';
import FormSelect from '../../components/FormSelect';
import JournalFormDrawer from '../Journal/components/JournalFormDrawer';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useData } from '../../contexts/DataContext';

const today = () => new Date().toISOString().slice(0, 10);
const genId = () => `GACP-${Date.now()}`;

// ─── Form PropTypes (shared) ─────────────────────
const formPropTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    plotId: PropTypes.string.isRequired,
    editEntry: PropTypes.object,
};

// ══════════════════════════════════════════════════
// ① SAN XUẤT HẠT GIỐNG
// ══════════════════════════════════════════════════
export const SeedProductionForm = ({ isOpen, onClose, plotId, editEntry }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const { addGacpEntry, updateGacpEntry } = useData();
    const init = editEntry?.data || {};
    const [form, setForm] = useState({
        lotCode: init.lotCode || '',
        seedName: init.seedName || '',
        quantity: init.quantity || '',
        method: init.method || '',
        sowDate: init.sowDate || today(),
        sproutDate: init.sproutDate || '',
        sproutRate: init.sproutRate || '',
        monitor: init.monitor || currentUser?.name || '',
    });
    const handleChange = useCallback((n, v) => setForm((p) => ({ ...p, [n]: v })), []);
    const handleSubmit = async () => {
        const entry = {
            id: editEntry?.id || genId(),
            type: 'seed_production',
            plotId,
            date: form.sowDate,
            createdBy: currentUser?.id || 'U01',
            createdAt: new Date().toISOString(),
            note: '',
            data: form,
        };
        if (editEntry) {
            await updateGacpEntry(editEntry.id, { data: form });
            addToast('Đã cập nhật', 'success');
        } else {
            await addGacpEntry(entry);
            addToast('Đã lưu nhật ký Hạt giống', 'success');
        }
        onClose();
    };
    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Hạt giống">
            <FormField
                label="Ký hiệu lô"
                name="lotCode"
                value={form.lotCode}
                onChange={handleChange}
                placeholder="VD: LH-001"
                required
            />
            <FormField
                label="Tên giống"
                name="seedName"
                value={form.seedName}
                onChange={handleChange}
                placeholder="VD: Ích Mẫu giống QN"
                required
            />
            <div className="journal-grid">
                <FormField
                    label="Số lượng (kg)"
                    name="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                />
                <FormField
                    label="Ngày gieo"
                    name="sowDate"
                    type="date"
                    value={form.sowDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <FormField
                label="PP xử lý hạt"
                name="method"
                value={form.method}
                onChange={handleChange}
                placeholder="VD: Ngâm nước ấm 6h"
            />
            <div className="journal-grid">
                <FormField
                    label="Ngày mọc"
                    name="sproutDate"
                    type="date"
                    value={form.sproutDate}
                    onChange={handleChange}
                />
                <FormField
                    label="Tỷ lệ mọc (%)"
                    name="sproutRate"
                    type="number"
                    value={form.sproutRate}
                    onChange={handleChange}
                />
            </div>
            <FormField label="Người theo dõi" name="monitor" value={form.monitor} onChange={handleChange} />
        </JournalFormDrawer>
    );
};
SeedProductionForm.propTypes = formPropTypes;

// ══════════════════════════════════════════════════
// ② LỊCH SỬ VÙNG ĐẤT
// ══════════════════════════════════════════════════
export const LandHistoryForm = ({ isOpen, onClose, plotId, editEntry }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const { addGacpEntry, updateGacpEntry } = useData();
    const init = editEntry?.data || {};
    const [form, setForm] = useState({
        landLotCode: init.landLotCode || '',
        cropName: init.cropName || '',
        period: init.period || '',
    });
    const handleChange = useCallback((n, v) => setForm((p) => ({ ...p, [n]: v })), []);
    const handleSubmit = async () => {
        const entry = {
            id: genId(),
            type: 'land_history',
            plotId,
            date: today(),
            createdBy: currentUser?.id || 'U01',
            createdAt: new Date().toISOString(),
            note: '',
            data: form,
        };
        if (editEntry) {
            await updateGacpEntry(editEntry.id, { data: form });
            addToast('Đã cập nhật', 'success');
        } else {
            await addGacpEntry(entry);
            addToast('Đã lưu Lịch sử đất', 'success');
        }
        onClose();
    };
    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Lịch sử đất">
            <FormField
                label="Ký hiệu lô đất"
                name="landLotCode"
                value={form.landLotCode}
                onChange={handleChange}
                placeholder="VD: LD-01"
                required
            />
            <FormField
                label="Cây trồng"
                name="cropName"
                value={form.cropName}
                onChange={handleChange}
                placeholder="VD: Lúa nước"
                required
            />
            <FormField
                label="Thời gian trồng"
                name="period"
                value={form.period}
                onChange={handleChange}
                placeholder="VD: 2024-06 đến 2025-01"
                required
            />
        </JournalFormDrawer>
    );
};
LandHistoryForm.propTypes = formPropTypes;

// ══════════════════════════════════════════════════
// ③ TÌNH TRẠNG ĐẤT
// ══════════════════════════════════════════════════
export const SoilConditionForm = ({ isOpen, onClose, plotId, editEntry }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const { addGacpEntry, updateGacpEntry } = useData();
    const init = editEntry?.data || {};
    const [form, setForm] = useState({
        sampleDate: init.sampleDate || today(),
        condition: init.condition || '',
        solution: init.solution || '',
        monitor: init.monitor || currentUser?.name || '',
    });
    const handleChange = useCallback((n, v) => setForm((p) => ({ ...p, [n]: v })), []);
    const handleSubmit = async () => {
        const entry = {
            id: genId(),
            type: 'soil_condition',
            plotId,
            date: form.sampleDate,
            createdBy: currentUser?.id || 'U01',
            createdAt: new Date().toISOString(),
            note: '',
            data: form,
        };
        if (editEntry) {
            await updateGacpEntry(editEntry.id, { data: form });
            addToast('Đã cập nhật', 'success');
        } else {
            await addGacpEntry(entry);
            addToast('Đã lưu Tình trạng đất', 'success');
        }
        onClose();
    };
    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Tình trạng đất">
            <FormField
                label="Ngày lấy mẫu"
                name="sampleDate"
                type="date"
                value={form.sampleDate}
                onChange={handleChange}
                required
            />
            <FormField
                label="Tình trạng đất"
                name="condition"
                type="textarea"
                value={form.condition}
                onChange={handleChange}
                placeholder="VD: Đất thịt pha cát, pH 6.2"
                required
            />
            <FormField
                label="Hướng giải quyết"
                name="solution"
                type="textarea"
                value={form.solution}
                onChange={handleChange}
                placeholder="VD: Bổ sung phân hữu cơ"
            />
            <FormField label="Người theo dõi" name="monitor" value={form.monitor} onChange={handleChange} />
        </JournalFormDrawer>
    );
};
SoilConditionForm.propTypes = formPropTypes;

// ══════════════════════════════════════════════════
// ④ NGUY CƠ Ô NHIỄM NƯỚC
// ══════════════════════════════════════════════════
export const WaterPollutionForm = ({ isOpen, onClose, plotId, editEntry }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const { addGacpEntry, updateGacpEntry } = useData();
    const init = editEntry?.data || {};
    const [form, setForm] = useState({
        pollutionSource: init.pollutionSource || '',
        riskLevel: init.riskLevel || 'low',
        monitor: init.monitor || currentUser?.name || '',
        solution: init.solution || '',
    });
    const handleChange = useCallback((n, v) => setForm((p) => ({ ...p, [n]: v })), []);
    const handleSubmit = async () => {
        const entry = {
            id: genId(),
            type: 'water_pollution',
            plotId,
            date: today(),
            createdBy: currentUser?.id || 'U01',
            createdAt: new Date().toISOString(),
            note: '',
            data: form,
        };
        if (editEntry) {
            await updateGacpEntry(editEntry.id, { data: form });
            addToast('Đã cập nhật', 'success');
        } else {
            await addGacpEntry(entry);
            addToast('Đã lưu Đánh giá nước', 'success');
        }
        onClose();
    };
    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Ô nhiễm nước">
            <FormField
                label="Nguồn gây ô nhiễm"
                name="pollutionSource"
                type="textarea"
                value={form.pollutionSource}
                onChange={handleChange}
                required
            />
            <FormSelect
                label="Nguy cơ ô nhiễm"
                name="riskLevel"
                value={form.riskLevel}
                onChange={handleChange}
                mode="radio"
                options={[
                    { value: 'low', label: 'Thấp' },
                    { value: 'medium', label: 'Trung bình' },
                    { value: 'high', label: 'Cao' },
                ]}
            />
            <FormField
                label="Hướng xử lý"
                name="solution"
                type="textarea"
                value={form.solution}
                onChange={handleChange}
            />
            <FormField label="Người theo dõi" name="monitor" value={form.monitor} onChange={handleChange} />
        </JournalFormDrawer>
    );
};
WaterPollutionForm.propTypes = formPropTypes;

// ══════════════════════════════════════════════════
// ⑤ XỬ LÝ NƯỚC TƯỚI
// ══════════════════════════════════════════════════
export const WaterTreatmentForm = ({ isOpen, onClose, plotId, editEntry }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const { addGacpEntry, updateGacpEntry } = useData();
    const init = editEntry?.data || {};
    const [form, setForm] = useState({
        waterSource: init.waterSource || '',
        treatmentMethod: init.treatmentMethod || '',
        worker: init.worker || currentUser?.name || '',
    });
    const handleChange = useCallback((n, v) => setForm((p) => ({ ...p, [n]: v })), []);
    const handleSubmit = async () => {
        const entry = {
            id: genId(),
            type: 'water_treatment',
            plotId,
            date: today(),
            createdBy: currentUser?.id || 'U01',
            createdAt: new Date().toISOString(),
            note: '',
            data: form,
        };
        if (editEntry) {
            await updateGacpEntry(editEntry.id, { data: form });
            addToast('Đã cập nhật', 'success');
        } else {
            await addGacpEntry(entry);
            addToast('Đã lưu Xử lý nước', 'success');
        }
        onClose();
    };
    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Xử lý nước">
            <FormField
                label="Nguồn nước"
                name="waterSource"
                value={form.waterSource}
                onChange={handleChange}
                placeholder="VD: Giếng khoan 25m"
                required
            />
            <FormField
                label="Phương pháp xử lý"
                name="treatmentMethod"
                type="textarea"
                value={form.treatmentMethod}
                onChange={handleChange}
                required
            />
            <FormField label="Người xử lý" name="worker" value={form.worker} onChange={handleChange} />
        </JournalFormDrawer>
    );
};
WaterTreatmentForm.propTypes = formPropTypes;
