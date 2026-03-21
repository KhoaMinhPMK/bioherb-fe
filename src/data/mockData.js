/**
 * Centralized mock data for all pages.
 * Replace with API calls when integrating backend.
 *
 * Usage:
 *   import { workers, equipment } from '../../data/mockData';
 */
// --- Resource Page ---
export const workers = [
    { id: 'NC01', name: 'Nguyễn An', role: 'Nhân viên', salary: '300.000', phone: '0901234567', status: 'active' },
    { id: 'NC02', name: 'Trần Văn Tài', role: 'Kỹ thuật', salary: '350.000', phone: '0912345678', status: 'active' },
    { id: 'NC03', name: 'Nguyễn Văn Phương', role: 'Nhân viên', salary: '300.000', phone: '0923456789', status: 'active' },
    { id: 'NC04', name: 'Lê Thị Cúc', role: 'Quản lý', salary: '500.000', phone: '0934567890', status: 'active' },
];
export const equipment = [
    { id: 'TB01', name: 'Máy cày', type: 'Máy nông nghiệp', fuelCost: '150.000', status: 'active' },
    { id: 'TB02', name: 'Máy gặt lúa', type: 'Máy nông nghiệp', fuelCost: '200.000', status: 'active' },
    { id: 'TB03', name: 'Máy bơm nước', type: 'Thiết bị tưới', fuelCost: '50.000', status: 'pending' },
];
// --- Pest Incident Page ---
export const pestIncidents = [
    { id: 1, date: '18/03/2026', cycle: '2026-DX', plot: 'Ruộng lúa ST25', type: 'Đạo ôn', severity: 'Trung bình', area: '0.3 ha', treatment: 'Phun Sieubymsa 75WP', status: 'resolved' },
    { id: 2, date: '10/03/2026', cycle: '2026-XH', plot: 'Ruộng cà chua', type: 'Bọ phấn trắng', severity: 'Nhẹ', area: '0.1 ha', treatment: 'Phun thuốc trừ sâu', status: 'resolved' },
    { id: 3, date: '05/03/2026', cycle: '2026-DX-2', plot: 'Ruộng lúa nếp', type: 'Chuột', severity: 'Nặng', area: '1 ha', treatment: 'Đặt bẫy + thuốc chuột', status: 'monitoring' },
];
// --- Input Item Page ---
export const inputItems = [
    { id: 'VT001', name: 'Lân đỏ', type: 'Phân bón', unit: 'kg', price: '15.000', supplier: 'Cty DAP1', stock: 500 },
    { id: 'VT002', name: 'Sieubymsa 75WP', type: 'Nông dược', unit: 'gr', price: '12.000', supplier: 'Cty Bayer', stock: 2000 },
    { id: 'VT003', name: 'Hạt giống Lúa ST25', type: 'Nguyên liệu', unit: 'bao', price: '120.000', supplier: 'Trung tâm giống', stock: 10 },
    { id: 'VT004', name: 'Phân hữu cơ', type: 'Phân bón', unit: 'tấn', price: '1.800.000', supplier: 'Cty Hữu Cơ Xanh', stock: 20 },
    { id: 'VT005', name: 'Vôi nông nghiệp', type: 'Nguyên liệu', unit: 'kg', price: '3.000', supplier: 'Cty Vôi Miền Nam', stock: 800 },
    { id: 'VT006', name: 'Bao đựng lúa PP', type: 'Nguyên liệu', unit: 'bao', price: '5.000', supplier: 'Cty Bao Bì ABC', stock: 1500 },
];
// --- Task Log Page ---
export const taskLogs = [
    { id: 1, date: '21/03/2026', task: 'Bón phân', cycle: '2026-DX', plot: 'Ruộng lúa ST25', worker: 'Nguyễn An', status: 'approved', hours: 8 },
    { id: 2, date: '20/03/2026', task: 'Phun thuốc', cycle: '2026-DX', plot: 'Ruộng lúa ST25', worker: 'Trần Văn Tài', status: 'pending', hours: 6 },
    { id: 3, date: '19/03/2026', task: 'Tưới nước', cycle: '2026-XH', plot: 'Ruộng cà chua', worker: 'Nguyễn Văn Phương', status: 'approved', hours: 4 },
    { id: 4, date: '18/03/2026', task: 'Gieo sạ', cycle: '2026-DX', plot: 'Ruộng lúa ST25', worker: 'Lê Thị Cúc', status: 'approved', hours: 8 },
    { id: 5, date: '17/03/2026', task: 'Bón lót', cycle: '2026-DX', plot: 'Ruộng lúa ST25', worker: 'Nguyễn An', status: 'draft', hours: 5 },
    { id: 6, date: '16/03/2026', task: 'Cày xới đất', cycle: '2026-DX', plot: 'Ruộng lúa ST25', worker: 'Trần Văn Tài', status: 'approved', hours: 8 },
];
// --- Report Page ---
export const costByCategory = [
    { name: 'Phân bón', value: 22000 },
    { name: 'Nông dược', value: 14400 },
    { name: 'Nhân công', value: 18600 },
    { name: 'Thiết bị', value: 5200 },
    { name: 'Nguyên liệu', value: 3500 },
];
export const costSummary = [
    { id: 1, cycle: '2025-DX', supply: '18.500.000 ₫', labor: '12.000.000 ₫', equipment: '3.200.000 ₫', total: '33.700.000 ₫', yield: '9.2 tấn', costPerTon: '3.663.000 ₫' },
    { id: 2, cycle: '2025-HT', supply: '15.200.000 ₫', labor: '11.500.000 ₫', equipment: '2.800.000 ₫', total: '29.500.000 ₫', yield: '8.5 tấn', costPerTon: '3.470.000 ₫' },
    { id: 3, cycle: '2026-DX', supply: '15.200.000 ₫', labor: '8.400.000 ₫', equipment: '1.800.000 ₫', total: '25.400.000 ₫', yield: '—', costPerTon: '—' },
];
export const yieldData = [
    { name: '2025-DX', planned: 10, actual: 9.2 },
    { name: '2025-HT', planned: 10, actual: 8.5 },
    { name: '2026-DX', planned: 10, actual: 0 },
];
