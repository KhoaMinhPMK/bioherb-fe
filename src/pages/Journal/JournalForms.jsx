import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import FormField from '../../components/FormField';
import FormSelect from '../../components/FormSelect';
import JournalFormDrawer from './components/JournalFormDrawer';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const SHIFT_OPTIONS = [
    { value: 'morning', label: 'Sáng' },
    { value: 'afternoon', label: 'Trưa' },
    { value: 'evening', label: 'Chiều' },
];

const today = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
};

// ======================================
// I. GIỐNG (Seed)
// ======================================
export const SeedJournalForm = ({ isOpen, onClose, plotId }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [form, setForm] = useState({
        date: today(),
        seedName: '',
        origin: '',
        lotCode: '',
        source: 'buy',
        shift: 'morning',
        note: '',
    });

    const handleChange = useCallback((name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = () => {
        addToast(`Đã lưu nhật ký Giống cho ${plotId}`, 'success');
        onClose();
    };

    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Nhật ký Giống">
            <div className="journal-grid">
                <FormField
                    label="Ngày gieo"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                />
                <FormSelect
                    label="Buổi"
                    name="shift"
                    value={form.shift}
                    onChange={handleChange}
                    options={SHIFT_OPTIONS}
                    mode="radio"
                    required
                />
            </div>
            <FormField
                label="Tên giống"
                name="seedName"
                value={form.seedName}
                onChange={handleChange}
                placeholder="VD: Cúc Hoa Vàng"
                required
            />
            <FormField
                label="Nguồn gốc"
                name="origin"
                value={form.origin}
                onChange={handleChange}
                placeholder="VD: Viện Dược Liệu Trung Ương"
            />
            <FormField
                label="Mã lô giống"
                name="lotCode"
                value={form.lotCode}
                onChange={handleChange}
                placeholder="VD: LOT-2026-001"
            />
            <FormSelect
                label="Nguồn cung"
                name="source"
                value={form.source}
                onChange={handleChange}
                mode="radio"
                options={[
                    { value: 'buy', label: 'Mua' },
                    { value: 'self', label: 'Tự sản xuất' },
                ]}
            />
            <FormField
                label="Người thực hiện"
                name="worker"
                value={currentUser?.name || ''}
                onChange={handleChange}
                disabled
            />
            <FormField
                label="Ghi chú"
                name="note"
                type="textarea"
                value={form.note}
                onChange={handleChange}
                placeholder="Ghi chú thêm..."
            />
        </JournalFormDrawer>
    );
};

// ======================================
// II. PHÂN BÓN (Fertilizer)
// ======================================
export const FertilizerJournalForm = ({ isOpen, onClose, plotId }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [form, setForm] = useState({
        date: today(),
        fertName: '',
        fertType: 'organic',
        quantity: '',
        unit: 'kg',
        method: '',
        shift: 'morning',
        note: '',
    });

    const handleChange = useCallback((name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = () => {
        addToast(`Đã lưu nhật ký Phân bón cho ${plotId}`, 'success');
        onClose();
    };

    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Nhật ký Phân bón">
            <div className="journal-section">
                <span className="journal-section__title">Vật tư</span>
            </div>
            <FormField
                label="Tên phân bón"
                name="fertName"
                value={form.fertName}
                onChange={handleChange}
                placeholder="VD: NPK 16-16-8"
                required
            />
            <FormSelect
                label="Loại"
                name="fertType"
                value={form.fertType}
                onChange={handleChange}
                mode="radio"
                options={[
                    { value: 'organic', label: 'Hữu cơ' },
                    { value: 'inorganic', label: 'Vô cơ' },
                ]}
            />
            <div className="journal-grid">
                <FormField
                    label="Số lượng"
                    name="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder="VD: 50"
                    required
                />
                <FormSelect
                    label="Đơn vị"
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    options={[
                        { value: 'kg', label: 'kg' },
                        { value: 'lit', label: 'Lít' },
                        { value: 'bao', label: 'Bao' },
                    ]}
                />
            </div>

            <div className="journal-section">
                <span className="journal-section__title">Cách bón</span>
            </div>
            <FormSelect
                label="Phương pháp"
                name="method"
                value={form.method}
                onChange={handleChange}
                options={[
                    { value: 'lot', label: 'Bón lót' },
                    { value: 'thuc', label: 'Bón thúc' },
                    { value: 'phun', label: 'Phun qua lá' },
                    { value: 'other', label: 'Khác' },
                ]}
            />

            <div className="journal-section">
                <span className="journal-section__title">Thực hiện</span>
            </div>
            <div className="journal-grid">
                <FormField
                    label="Ngày bón"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                />
                <FormSelect
                    label="Buổi"
                    name="shift"
                    value={form.shift}
                    onChange={handleChange}
                    options={SHIFT_OPTIONS}
                    mode="radio"
                    required
                />
            </div>
            <FormField
                label="Người thực hiện"
                name="worker"
                value={currentUser?.name || ''}
                onChange={handleChange}
                disabled
            />
            <FormField
                label="Ghi chú"
                name="note"
                type="textarea"
                value={form.note}
                onChange={handleChange}
                placeholder="Tình trạng cây sau khi bón..."
            />
        </JournalFormDrawer>
    );
};

// ======================================
// III. SÂU BỆNH (Pest) ⚠️
// ======================================
export const PestJournalForm = ({ isOpen, onClose, plotId }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [form, setForm] = useState({
        date: today(),
        pesticide: '',
        dosage: '',
        phi: '7',
        shift: 'morning',
        note: '',
    });

    const handleChange = useCallback((name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    // Auto-calculate safe harvest date
    const safeHarvestDate = useMemo(() => {
        if (!form.date || !form.phi) return '—';
        const sprayDate = new Date(form.date);
        sprayDate.setDate(sprayDate.getDate() + parseInt(form.phi, 10));
        return sprayDate.toLocaleDateString('vi-VN');
    }, [form.date, form.phi]);

    const handleSubmit = () => {
        addToast(`Đã lưu nhật ký Sâu bệnh cho ${plotId}`, 'success');
        onClose();
    };

    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Nhật ký Sâu bệnh">
            <div className="journal-grid">
                <FormField
                    label="Ngày phun"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                />
                <FormSelect
                    label="Buổi"
                    name="shift"
                    value={form.shift}
                    onChange={handleChange}
                    options={SHIFT_OPTIONS}
                    mode="radio"
                    required
                />
            </div>
            <FormField
                label="Loại thuốc"
                name="pesticide"
                value={form.pesticide}
                onChange={handleChange}
                placeholder="VD: Amistar Top 325 SC"
                required
            />
            <FormField
                label="Liều lượng"
                name="dosage"
                value={form.dosage}
                onChange={handleChange}
                placeholder="VD: 0.5 lít/ha"
                required
            />
            <FormField
                label="PHI (ngày cách ly)"
                name="phi"
                type="number"
                value={form.phi}
                onChange={handleChange}
                hint="Thời gian cách ly trước thu hoạch"
                required
            />
            <FormField label="Ngày được thu hoạch" name="safeDate" autoValue={safeHarvestDate} onChange={() => {}} />
            <FormField
                label="Người thực hiện"
                name="worker"
                value={currentUser?.name || ''}
                onChange={handleChange}
                disabled
            />
            <FormField
                label="Ghi chú"
                name="note"
                type="textarea"
                value={form.note}
                onChange={handleChange}
                placeholder="Tình trạng sâu bệnh, thời tiết khi phun..."
            />
        </JournalFormDrawer>
    );
};

// ======================================
// IV. CANH TÁC (Farming)
// ======================================
export const FarmingJournalForm = ({ isOpen, onClose, plotId }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [form, setForm] = useState({
        date: today(),
        task: '',
        shift: 'morning',
        waterSource: '',
        equipment: '',
        weather: '',
        note: '',
    });

    const handleChange = useCallback((name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = () => {
        addToast(`Đã lưu nhật ký Canh tác cho ${plotId}`, 'success');
        onClose();
    };

    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Nhật ký Canh tác">
            <div className="journal-grid">
                <FormField label="Ngày" name="date" type="date" value={form.date} onChange={handleChange} required />
                <FormSelect
                    label="Buổi"
                    name="shift"
                    value={form.shift}
                    onChange={handleChange}
                    options={SHIFT_OPTIONS}
                    mode="radio"
                    required
                />
            </div>
            <FormField
                label="Công việc cụ thể"
                name="task"
                value={form.task}
                onChange={handleChange}
                placeholder="VD: Cày xới đất, tưới nước..."
                required
            />
            <FormField
                label="Người thực hiện"
                name="worker"
                value={currentUser?.name || ''}
                onChange={handleChange}
                disabled
            />

            <div className="journal-section">
                <span className="journal-section__title">Tuỳ chọn</span>
            </div>
            <FormField
                label="Nguồn nước"
                name="waterSource"
                value={form.waterSource}
                onChange={handleChange}
                placeholder="VD: Giếng, kênh thủy lợi..."
            />
            <FormField
                label="Tình trạng thiết bị"
                name="equipment"
                value={form.equipment}
                onChange={handleChange}
                placeholder="VD: Máy bơm hoạt động tốt"
            />
            <FormSelect
                label="Thời tiết"
                name="weather"
                value={form.weather}
                onChange={handleChange}
                options={[
                    { value: 'sunny', label: '☀️ Nắng' },
                    { value: 'cloudy', label: '⛅ Mây' },
                    { value: 'rainy', label: '🌧️ Mưa' },
                    { value: 'storm', label: '⛈️ Giông' },
                ]}
            />
            <FormField
                label="Ghi chú"
                name="note"
                type="textarea"
                value={form.note}
                onChange={handleChange}
                placeholder="Chi tiết thêm..."
            />
        </JournalFormDrawer>
    );
};

// ======================================
// V. THU HOẠCH (Harvest)
// ======================================
export const HarvestJournalForm = ({ isOpen, onClose, plotId }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [form, setForm] = useState({
        date: today(),
        quantity: '',
        unit: 'kg',
        quality: 'A',
        shift: 'morning',
        note: '',
    });

    const handleChange = useCallback((name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    // Auto-generate lot code
    const lotCode = useMemo(() => {
        if (!form.date) return '';
        return `${plotId}-${form.date.replace(/-/g, '').slice(2)}-001`;
    }, [plotId, form.date]);

    const handleSubmit = () => {
        addToast(`Đã lưu nhật ký Thu hoạch cho ${plotId}`, 'success');
        onClose();
    };

    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Nhật ký Thu hoạch">
            <div className="journal-grid">
                <FormField
                    label="Ngày thu hoạch"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                />
                <FormSelect
                    label="Buổi"
                    name="shift"
                    value={form.shift}
                    onChange={handleChange}
                    options={SHIFT_OPTIONS}
                    mode="radio"
                    required
                />
            </div>
            <div className="journal-grid">
                <FormField
                    label="Sản lượng"
                    name="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder="VD: 500"
                    required
                />
                <FormSelect
                    label="Đơn vị"
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    options={[
                        { value: 'kg', label: 'kg' },
                        { value: 'tan', label: 'Tấn' },
                        { value: 'gio', label: 'Giỏ' },
                    ]}
                />
            </div>
            <FormSelect
                label="Chất lượng"
                name="quality"
                value={form.quality}
                onChange={handleChange}
                mode="radio"
                options={[
                    { value: 'A', label: 'Loại A' },
                    { value: 'B', label: 'Loại B' },
                    { value: 'C', label: 'Loại C' },
                ]}
            />
            <FormField label="Mã lô sản phẩm" name="lotCode" autoValue={lotCode} onChange={() => {}} />
            <FormField
                label="Người thực hiện"
                name="worker"
                value={currentUser?.name || ''}
                onChange={handleChange}
                disabled
            />
            <FormField
                label="Ghi chú"
                name="note"
                type="textarea"
                value={form.note}
                onChange={handleChange}
                placeholder="Tình trạng nông sản khi thu hoạch..."
            />
        </JournalFormDrawer>
    );
};

// ======================================
// VI. SƠ CHẾ (Processing)
// ======================================
export const ProcessingJournalForm = ({ isOpen, onClose, plotId }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [form, setForm] = useState({
        date: today(),
        process: '',
        shift: 'morning',
        note: '',
    });

    const handleChange = useCallback((name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    // Auto lot code
    const batchCode = useMemo(() => {
        if (!form.date) return '';
        return `SC-${plotId}-${form.date.replace(/-/g, '').slice(2)}-001`;
    }, [plotId, form.date]);

    const handleSubmit = () => {
        addToast(`Đã lưu nhật ký Sơ chế cho ${plotId}`, 'success');
        onClose();
    };

    return (
        <JournalFormDrawer isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Nhật ký Sơ chế">
            <div className="journal-grid">
                <FormField
                    label="Ngày sơ chế"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                />
                <FormSelect
                    label="Buổi"
                    name="shift"
                    value={form.shift}
                    onChange={handleChange}
                    options={SHIFT_OPTIONS}
                    mode="radio"
                    required
                />
            </div>
            <FormSelect
                label="Quy trình"
                name="process"
                value={form.process}
                onChange={handleChange}
                options={[
                    { value: 'wash', label: 'Rửa sạch' },
                    { value: 'dry', label: 'Phơi khô' },
                    { value: 'sort', label: 'Phân loại' },
                    { value: 'pack', label: 'Đóng gói' },
                    { value: 'store', label: 'Bảo quản' },
                ]}
                required
            />
            <FormField label="Mã lô thành phẩm" name="batchCode" autoValue={batchCode} onChange={() => {}} />
            <FormField
                label="Người thực hiện"
                name="worker"
                value={currentUser?.name || ''}
                onChange={handleChange}
                disabled
            />
            <FormField
                label="Ghi chú"
                name="note"
                type="textarea"
                value={form.note}
                onChange={handleChange}
                placeholder="Chi tiết quy trình, nhiệt độ, độ ẩm..."
            />
        </JournalFormDrawer>
    );
};

// PropTypes for all forms
const formPropTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    plotId: PropTypes.string.isRequired,
};

SeedJournalForm.propTypes = formPropTypes;
FertilizerJournalForm.propTypes = formPropTypes;
PestJournalForm.propTypes = formPropTypes;
FarmingJournalForm.propTypes = formPropTypes;
HarvestJournalForm.propTypes = formPropTypes;
ProcessingJournalForm.propTypes = formPropTypes;
