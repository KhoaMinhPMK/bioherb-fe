import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import FormField from '../../components/FormField';
import FormSelect from '../../components/FormSelect';
import JournalFormDrawer from '../Journal/components/JournalFormDrawer';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useData } from '../../contexts/DataContext';
import { SEVERITY_OPTIONS, RISK_OPTIONS, WEATHER_OPTIONS } from './gacpConstants';

const today = () => new Date().toISOString().slice(0, 10);
const genId = () => `GACP-${Date.now()}`;

const formPropTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    plotId: PropTypes.string.isRequired,
    editEntry: PropTypes.object,
};

// ══════════════════════════════════════════════════
// ⑩ CHĂM SÓC HÀNG NGÀY
// ══════════════════════════════════════════════════
export const DailyCareForm = ({ isOpen, onClose, plotId, editEntry }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const { addGacpEntry, updateGacpEntry } = useData();
    const init = editEntry?.data || {};
    const [form, setForm] = useState({
        task: init.task || '',
        worker: init.worker || currentUser?.name || '',
        weather: init.weather || 'sunny',
    });
    const handleChange = useCallback((n, v) => setForm((p) => ({ ...p, [n]: v })), []);
    const handleSubmit = async () => {
        const entry = {
            id: genId(),
            type: 'daily_care',
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
            addToast('Đã lưu Chăm sóc', 'success');
        }
        onClose();
    };
    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Chăm sóc hàng ngày">
            <FormField
                label="Công việc thực hiện"
                name="task"
                type="textarea"
                value={form.task}
                onChange={handleChange}
                placeholder="VD: Tưới nước, kiểm tra lá"
                required
            />
            <FormSelect
                label="Thời tiết"
                name="weather"
                value={form.weather}
                onChange={handleChange}
                mode="radio"
                options={WEATHER_OPTIONS}
            />
            <FormField label="Người thực hiện" name="worker" value={form.worker} onChange={handleChange} />
        </JournalFormDrawer>
    );
};
DailyCareForm.propTypes = formPropTypes;

// ══════════════════════════════════════════════════
// ⑪ SÂU BỆNH HẠI
// ══════════════════════════════════════════════════
export const PestTrackingForm = ({ isOpen, onClose, plotId, editEntry }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const { addGacpEntry, updateGacpEntry } = useData();
    const init = editEntry?.data || {};
    const [form, setForm] = useState({
        pestName: init.pestName || '',
        severity: init.severity || 'low',
        solution: init.solution || '',
        postResult: init.postResult || '',
        monitor: init.monitor || currentUser?.name || '',
    });
    const handleChange = useCallback((n, v) => setForm((p) => ({ ...p, [n]: v })), []);
    const handleSubmit = async () => {
        const entry = {
            id: genId(),
            type: 'pest_tracking',
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
            addToast('Đã lưu Sâu bệnh', 'success');
        }
        onClose();
    };
    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Sâu bệnh">
            <FormField
                label="Loại sâu/bệnh"
                name="pestName"
                value={form.pestName}
                onChange={handleChange}
                placeholder="VD: Rệp muội"
                required
            />
            <FormSelect
                label="Mức độ"
                name="severity"
                value={form.severity}
                onChange={handleChange}
                mode="radio"
                options={SEVERITY_OPTIONS}
            />
            <FormField
                label="Đề xuất biện pháp xử lý"
                name="solution"
                type="textarea"
                value={form.solution}
                onChange={handleChange}
            />
            <FormField
                label="Theo dõi sau xử lý"
                name="postResult"
                type="textarea"
                value={form.postResult}
                onChange={handleChange}
            />
            <FormField label="Người theo dõi" name="monitor" value={form.monitor} onChange={handleChange} />
        </JournalFormDrawer>
    );
};
PestTrackingForm.propTypes = formPropTypes;

// ══════════════════════════════════════════════════
// ⑫ THU HOẠCH
// ══════════════════════════════════════════════════
export const HarvestTrackingForm = ({ isOpen, onClose, plotId, editEntry }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const { addGacpEntry, updateGacpEntry } = useData();
    const init = editEntry?.data || {};
    const [form, setForm] = useState({
        lotCode: init.lotCode || '',
        freshWeight: init.freshWeight || '',
        morphology: init.morphology || '',
        monitor: init.monitor || currentUser?.name || '',
    });
    const handleChange = useCallback((n, v) => setForm((p) => ({ ...p, [n]: v })), []);
    const handleSubmit = async () => {
        const entry = {
            id: genId(),
            type: 'harvest',
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
            addToast('Đã lưu Thu hoạch', 'success');
        }
        onClose();
    };
    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Thu hoạch">
            <FormField
                label="Ký hiệu lô"
                name="lotCode"
                value={form.lotCode}
                onChange={handleChange}
                placeholder="VD: TH-IM-001"
                required
            />
            <FormField
                label="Khối lượng tươi (kg)"
                name="freshWeight"
                type="number"
                value={form.freshWeight}
                onChange={handleChange}
                required
            />
            <FormField
                label="Mô tả hình thái"
                name="morphology"
                type="textarea"
                value={form.morphology}
                onChange={handleChange}
                placeholder="VD: Thân cao 40-60cm, lá xanh đậm"
            />
            <FormField label="Người theo dõi" name="monitor" value={form.monitor} onChange={handleChange} />
        </JournalFormDrawer>
    );
};
HarvestTrackingForm.propTypes = formPropTypes;

// ══════════════════════════════════════════════════
// ⑬ QUẢN LÝ CHẤT THẢI
// ══════════════════════════════════════════════════
export const WasteManagementForm = ({ isOpen, onClose, plotId, editEntry }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const { addGacpEntry, updateGacpEntry } = useData();
    const init = editEntry?.data || {};
    const [form, setForm] = useState({
        wasteType: init.wasteType || '',
        wasteWeight: init.wasteWeight || '',
        treatmentMethod: init.treatmentMethod || '',
        monitor: init.monitor || currentUser?.name || '',
    });
    const handleChange = useCallback((n, v) => setForm((p) => ({ ...p, [n]: v })), []);
    const handleSubmit = async () => {
        const entry = {
            id: genId(),
            type: 'waste_management',
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
            addToast('Đã lưu Chất thải', 'success');
        }
        onClose();
    };
    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Quản lý chất thải">
            <FormField label="Loại rác thải" name="wasteType" value={form.wasteType} onChange={handleChange} required />
            <FormField
                label="Lượng rác thải (kg)"
                name="wasteWeight"
                type="number"
                value={form.wasteWeight}
                onChange={handleChange}
                required
            />
            <FormField
                label="Phương pháp xử lý"
                name="treatmentMethod"
                value={form.treatmentMethod}
                onChange={handleChange}
                placeholder="VD: Ủ compost tại chỗ"
                required
            />
            <FormField label="Người theo dõi" name="monitor" value={form.monitor} onChange={handleChange} />
        </JournalFormDrawer>
    );
};
WasteManagementForm.propTypes = formPropTypes;

// ══════════════════════════════════════════════════
// ⑭ SỬ DỤNG THIẾT BỊ
// ══════════════════════════════════════════════════
export const EquipmentUsageForm = ({ isOpen, onClose, plotId, editEntry }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const { addGacpEntry, updateGacpEntry } = useData();
    const init = editEntry?.data || {};
    const [form, setForm] = useState({
        toolName: init.toolName || '',
        duration: init.duration || '',
        toolCondition: init.toolCondition || '',
        worker: init.worker || currentUser?.name || '',
        inspector: init.inspector || '',
    });
    const handleChange = useCallback((n, v) => setForm((p) => ({ ...p, [n]: v })), []);
    const handleSubmit = async () => {
        const entry = {
            id: genId(),
            type: 'equipment_usage',
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
            addToast('Đã lưu Thiết bị', 'success');
        }
        onClose();
    };
    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Sử dụng thiết bị">
            <FormField
                label="Dụng cụ"
                name="toolName"
                value={form.toolName}
                onChange={handleChange}
                placeholder="VD: Máy xới đất"
                required
            />
            <FormField
                label="Thời gian thực hiện"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="VD: 4 giờ"
            />
            <FormField
                label="Tình trạng dụng cụ sau sử dụng"
                name="toolCondition"
                value={form.toolCondition}
                onChange={handleChange}
            />
            <FormField label="Người thực hiện" name="worker" value={form.worker} onChange={handleChange} />
            <FormField label="Người kiểm tra" name="inspector" value={form.inspector} onChange={handleChange} />
        </JournalFormDrawer>
    );
};
EquipmentUsageForm.propTypes = formPropTypes;

// ══════════════════════════════════════════════════
// ⑮ SỰ CỐ / RỦI RO
// ══════════════════════════════════════════════════
export const IncidentTrackingForm = ({ isOpen, onClose, plotId, editEntry }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const { addGacpEntry, updateGacpEntry } = useData();
    const init = editEntry?.data || {};
    const [form, setForm] = useState({
        incident: init.incident || '',
        cause: init.cause || '',
        riskLevel: init.riskLevel || 'low',
        monitor: init.monitor || currentUser?.name || '',
    });
    const handleChange = useCallback((n, v) => setForm((p) => ({ ...p, [n]: v })), []);
    const handleSubmit = async () => {
        const entry = {
            id: genId(),
            type: 'incident',
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
            addToast('Đã lưu Sự cố', 'success');
        }
        onClose();
    };
    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Sự cố / Rủi ro">
            <FormField
                label="Sự cố"
                name="incident"
                type="textarea"
                value={form.incident}
                onChange={handleChange}
                placeholder="Mô tả sự cố"
                required
            />
            <FormField
                label="Nguyên nhân sơ bộ"
                name="cause"
                type="textarea"
                value={form.cause}
                onChange={handleChange}
            />
            <FormSelect
                label="Đánh giá rủi ro"
                name="riskLevel"
                value={form.riskLevel}
                onChange={handleChange}
                mode="radio"
                options={RISK_OPTIONS}
            />
            <FormField label="Người theo dõi" name="monitor" value={form.monitor} onChange={handleChange} />
        </JournalFormDrawer>
    );
};
IncidentTrackingForm.propTypes = formPropTypes;
