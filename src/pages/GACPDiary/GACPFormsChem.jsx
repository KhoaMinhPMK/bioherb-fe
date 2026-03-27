import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import FormField from '../../components/FormField';
import JournalFormDrawer from '../Journal/components/JournalFormDrawer';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useData } from '../../contexts/DataContext';

const today = () => new Date().toISOString().slice(0, 10);
const genId = () => `GACP-${Date.now()}`;

const formPropTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    plotId: PropTypes.string.isRequired,
    editEntry: PropTypes.object,
};

// ══════════════════════════════════════════════════
// ⑥ XỬ LÝ PHÂN HỮU CƠ
// ══════════════════════════════════════════════════
export const OrganicFertilizerForm = ({ isOpen, onClose, plotId, editEntry }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const { addGacpEntry, updateGacpEntry } = useData();
    const init = editEntry?.data || {};
    const [form, setForm] = useState({
        task: init.task || '',
        worker: init.worker || currentUser?.name || '',
    });
    const handleChange = useCallback((n, v) => setForm((p) => ({ ...p, [n]: v })), []);
    const handleSubmit = async () => {
        const entry = {
            id: genId(),
            type: 'organic_fertilizer',
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
            addToast('Đã lưu Phân hữu cơ', 'success');
        }
        onClose();
    };
    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Phân hữu cơ">
            <FormField
                label="Nội dung công việc"
                name="task"
                type="textarea"
                value={form.task}
                onChange={handleChange}
                placeholder="VD: Ủ phân bò + rơm rạ, đảo lần 2"
                required
            />
            <FormField label="Người thực hiện" name="worker" value={form.worker} onChange={handleChange} />
        </JournalFormDrawer>
    );
};
OrganicFertilizerForm.propTypes = formPropTypes;

// ══════════════════════════════════════════════════
// ⑦ NGUỒN GỐC PHÂN BÓN / HÓA CHẤT
// ══════════════════════════════════════════════════
export const ChemicalOriginForm = ({ isOpen, onClose, plotId, editEntry }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const { addGacpEntry, updateGacpEntry } = useData();
    const init = editEntry?.data || {};
    const [form, setForm] = useState({
        chemName: init.chemName || '',
        quantity: init.quantity || '',
        producer: init.producer || '',
        buyer: init.buyer || currentUser?.name || '',
    });
    const handleChange = useCallback((n, v) => setForm((p) => ({ ...p, [n]: v })), []);
    const handleSubmit = async () => {
        const entry = {
            id: genId(),
            type: 'chemical_origin',
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
            addToast('Đã lưu Nguồn gốc PB', 'success');
        }
        onClose();
    };
    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Nguồn gốc phân bón">
            <FormField
                label="Tên phân bón / hóa chất / thuốc BVTV"
                name="chemName"
                value={form.chemName}
                onChange={handleChange}
                required
            />
            <FormField
                label="Lượng (kg)"
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                required
            />
            <FormField
                label="Đơn vị sản xuất / phân phối"
                name="producer"
                value={form.producer}
                onChange={handleChange}
            />
            <FormField label="Người mua" name="buyer" value={form.buyer} onChange={handleChange} />
        </JournalFormDrawer>
    );
};
ChemicalOriginForm.propTypes = formPropTypes;

// ══════════════════════════════════════════════════
// ⑧ SỬ DỤNG PHÂN BÓN / THUỐC BVTV
// ══════════════════════════════════════════════════
export const ChemicalUsageForm = ({ isOpen, onClose, plotId, editEntry }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const { addGacpEntry, updateGacpEntry } = useData();
    const init = editEntry?.data || {};
    const [form, setForm] = useState({
        landLot: init.landLot || '',
        chemName: init.chemName || '',
        dosage: init.dosage || '',
        method: init.method || '',
        worker: init.worker || currentUser?.name || '',
        isolationDays: init.isolationDays || '',
    });
    const handleChange = useCallback((n, v) => setForm((p) => ({ ...p, [n]: v })), []);
    const handleSubmit = async () => {
        const entry = {
            id: genId(),
            type: 'chemical_usage',
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
            addToast('Đã lưu Sử dụng PB', 'success');
        }
        onClose();
    };
    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Sử dụng phân bón">
            <FormField
                label="Lô/thửa"
                name="landLot"
                value={form.landLot}
                onChange={handleChange}
                placeholder="VD: LD-01"
                required
            />
            <FormField
                label="Tên PB/hóa chất/thuốc"
                name="chemName"
                value={form.chemName}
                onChange={handleChange}
                required
            />
            <div className="journal-grid">
                <FormField
                    label="Lượng dùng"
                    name="dosage"
                    value={form.dosage}
                    onChange={handleChange}
                    placeholder="VD: 50kg/1000m²"
                    required
                />
                <FormField
                    label="Cách ly (ngày)"
                    name="isolationDays"
                    type="number"
                    value={form.isolationDays}
                    onChange={handleChange}
                />
            </div>
            <FormField
                label="Phương pháp sử dụng"
                name="method"
                value={form.method}
                onChange={handleChange}
                placeholder="VD: Bón lót rải đều"
            />
            <FormField label="Người thực hiện" name="worker" value={form.worker} onChange={handleChange} />
        </JournalFormDrawer>
    );
};
ChemicalUsageForm.propTypes = formPropTypes;

// ══════════════════════════════════════════════════
// ⑨ TIÊU HỦY HÓA CHẤT HẾT HẠN
// ══════════════════════════════════════════════════
export const ChemicalDisposalForm = ({ isOpen, onClose, plotId, editEntry }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const { addGacpEntry, updateGacpEntry } = useData();
    const init = editEntry?.data || {};
    const [form, setForm] = useState({
        chemName: init.chemName || '',
        quantity: init.quantity || '',
        unit: init.unit || 'gói',
        purchasePlace: init.purchasePlace || '',
        buyer: init.buyer || '',
        storage: init.storage || '',
        disposer: init.disposer || currentUser?.name || '',
        disposalMethod: init.disposalMethod || '',
    });
    const handleChange = useCallback((n, v) => setForm((p) => ({ ...p, [n]: v })), []);
    const handleSubmit = async () => {
        const entry = {
            id: genId(),
            type: 'chemical_disposal',
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
            addToast('Đã lưu Tiêu hủy HC', 'success');
        }
        onClose();
    };
    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Tiêu hủy hóa chất">
            <FormField label="Tên thuốc" name="chemName" value={form.chemName} onChange={handleChange} required />
            <div className="journal-grid">
                <FormField
                    label="Số lượng"
                    name="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                />
                <FormField label="Đơn vị (gói/chai)" name="unit" value={form.unit} onChange={handleChange} />
            </div>
            <FormField label="Nơi mua" name="purchasePlace" value={form.purchasePlace} onChange={handleChange} />
            <FormField label="Người mua" name="buyer" value={form.buyer} onChange={handleChange} />
            <FormField label="Nơi bảo quản" name="storage" value={form.storage} onChange={handleChange} />
            <FormField label="Người tiêu hủy" name="disposer" value={form.disposer} onChange={handleChange} />
            <FormField
                label="Phương pháp tiêu hủy"
                name="disposalMethod"
                type="textarea"
                value={form.disposalMethod}
                onChange={handleChange}
                required
            />
        </JournalFormDrawer>
    );
};
ChemicalDisposalForm.propTypes = formPropTypes;
