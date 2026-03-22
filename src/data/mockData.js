/**
 * Centralized mock data for all pages.
 * Data model: Sankit Admin → HTX (Cooperative) → Farm → Plot → CropCycle → Journals
 *
 * Replace with API calls when integrating backend.
 *
 * Usage:
 *   import { cooperatives, farms, plots, users } from '../../data/mockData';
 */

// =============================================
// USERS & ROLES
// =============================================
// Roles: admin | htx_manager | farm_manager | worker | approver
export const users = [
    { id: 'U01', name: 'Admin Hệ Thống', email: 'admin@sankit.vn', role: 'admin', htxId: null, farmId: null, status: 'active', lastLogin: '22/03/2026 08:00' },
    { id: 'U02', name: 'Nguyễn Thị Bình', email: 'binh@sankit.vn', role: 'htx_manager', htxId: 'HTX01', farmId: null, status: 'active', lastLogin: '21/03/2026 10:30' },
    { id: 'U03', name: 'Lê Văn Hùng', email: 'hung@sankit.vn', role: 'farm_manager', htxId: 'HTX01', farmId: 'F01', status: 'active', lastLogin: '22/03/2026 07:00' },
    { id: 'U04', name: 'Nguyễn An', email: 'an@sankit.vn', role: 'worker', htxId: 'HTX01', farmId: 'F01', status: 'active', lastLogin: '22/03/2026 06:30' },
    { id: 'U05', name: 'Trần Văn Tài', email: 'tai@sankit.vn', role: 'worker', htxId: 'HTX01', farmId: 'F01', status: 'active', lastLogin: '21/03/2026 15:00' },
    { id: 'U06', name: 'Lê Thị Cúc', email: 'cuc@sankit.vn', role: 'approver', htxId: 'HTX01', farmId: 'F01', status: 'active', lastLogin: '22/03/2026 09:00' },
    { id: 'U07', name: 'Nguyễn Văn Phương', email: 'phuong@sankit.vn', role: 'worker', htxId: 'HTX01', farmId: 'F03', status: 'active', lastLogin: '20/03/2026 08:00' },
    { id: 'U08', name: 'Trần Thị Mai', email: 'mai@sankit.vn', role: 'farm_manager', htxId: 'HTX01', farmId: 'F03', status: 'active', lastLogin: '22/03/2026 07:30' },
];

export const roleLabels = {
    admin: 'Admin hệ thống',
    htx_manager: 'Quản lý HTX',
    farm_manager: 'Quản lý Farm',
    worker: 'Nhân công',
    approver: 'Duyệt viên',
};

// =============================================
// HTX (COOPERATIVES)
// =============================================
export const cooperatives = [
    { id: 'HTX01', name: 'HTX Nông nghiệp Tân Thạnh', province: 'Long An', farmIds: ['F01', 'F03'], status: 'active' },
    { id: 'HTX02', name: 'HTX Rau sạch Đồng Tháp', province: 'Đồng Tháp', farmIds: ['F02'], status: 'active' },
];

// =============================================
// FARMS
// =============================================
export const farms = [
    { id: 'F01', name: 'Farm Long An', htxId: 'HTX01', address: 'ấp 2, xã Tân Hòa, huyện Tân Thạnh, Long An', plotCount: 5, activeCycles: 3, managerId: 'U03', status: 'active' },
    { id: 'F02', name: 'Farm Đồng Tháp', htxId: 'HTX02', address: 'ấp 3, xã Mỹ Long, huyện Cao Lãnh, Đồng Tháp', plotCount: 3, activeCycles: 2, managerId: null, status: 'active' },
    { id: 'F03', name: 'Farm Tiền Giang', htxId: 'HTX01', address: 'xã Tân Phú, huyện Cai Lậy, Tiền Giang', plotCount: 3, activeCycles: 1, managerId: 'U08', status: 'active' },
];

// =============================================
// PLOTS (VÙNG TRỒNG) — Hạt nhân hệ thống
// =============================================
export const plots = [
    { id: 'VT01', name: 'Ruộng lúa ST25', farmId: 'F01', area: '2 ha', crop: 'Lúa ST25', activeCycle: '2026-DX', coords: '10.4567, 106.3456', status: 'active' },
    { id: 'VT02', name: 'Ruộng cà chua', farmId: 'F01', area: '1 ha', crop: 'Cà chua', activeCycle: '2026-XH', coords: '10.4570, 106.3460', status: 'active' },
    { id: 'VT03', name: 'Ruộng lúa nếp', farmId: 'F01', area: '1.5 ha', crop: 'Lúa nếp', activeCycle: '2026-DX-2', coords: '10.4575, 106.3465', status: 'active' },
    { id: 'VT04', name: 'Ruộng rau muống', farmId: 'F01', area: '0.5 ha', crop: 'Rau muống', activeCycle: null, coords: null, status: 'idle' },
    { id: 'VT05', name: 'Ruộng bắp', farmId: 'F01', area: '2 ha', crop: 'Bắp lai', activeCycle: '2026-DX-3', coords: '10.4580, 106.3470', status: 'active' },
    { id: 'VT06', name: 'Ruộng dưa hấu', farmId: 'F03', area: '1 ha', crop: 'Dưa hấu', activeCycle: '2026-XH-2', coords: null, status: 'active' },
    { id: 'VT07', name: 'Ruộng ớt', farmId: 'F03', area: '0.8 ha', crop: 'Ớt chỉ thiên', activeCycle: null, coords: null, status: 'idle' },
    { id: 'VT08', name: 'Ruộng bưởi', farmId: 'F03', area: '3 ha', crop: 'Bưởi da xanh', activeCycle: '2026-DX-4', coords: null, status: 'active' },
];

// =============================================
// CROP CYCLES (MÙA VỤ)
// =============================================
export const cropCycles = [
    { id: '2026-DX', plotId: 'VT01', crop: 'Lúa ST25', start: '01/01/2026', end: '25/05/2026', progress: 55, status: 'active' },
    { id: '2026-XH', plotId: 'VT02', crop: 'Cà chua', start: '15/02/2026', end: '15/06/2026', progress: 30, status: 'active' },
    { id: '2026-DX-2', plotId: 'VT03', crop: 'Lúa nếp', start: '01/01/2026', end: '30/05/2026', progress: 50, status: 'active' },
    { id: '2026-DX-3', plotId: 'VT05', crop: 'Bắp lai', start: '01/02/2026', end: '01/06/2026', progress: 40, status: 'active' },
    { id: '2026-XH-2', plotId: 'VT06', crop: 'Dưa hấu', start: '01/03/2026', end: '01/06/2026', progress: 20, status: 'active' },
    { id: '2026-DX-4', plotId: 'VT08', crop: 'Bưởi da xanh', start: '01/01/2026', end: '31/12/2026', progress: 25, status: 'active' },
    { id: '2025-HT', plotId: 'VT01', crop: 'Lúa ST25', start: '01/06/2025', end: '25/10/2025', progress: 100, status: 'closed' },
    { id: '2025-DX', plotId: 'VT01', crop: 'Lúa ST25', start: '01/01/2025', end: '25/05/2025', progress: 100, status: 'closed' },
];

// =============================================
// TASK PLANS (KẾ HOẠCH) — Theo buổi
// =============================================
export const taskPlans = [
    { id: 'KH01', date: '22/03/2026', shift: 'morning', task: 'Tưới nước', plotId: 'VT01', cycleId: '2026-DX', assigneeId: 'U04' },
    { id: 'KH02', date: '22/03/2026', shift: 'afternoon', task: 'Bón phân đợt 2', plotId: 'VT02', cycleId: '2026-XH', assigneeId: 'U05' },
    { id: 'KH03', date: '23/03/2026', shift: 'morning', task: 'Kiểm tra sâu bệnh', plotId: 'VT03', cycleId: '2026-DX-2', assigneeId: 'U06' },
    { id: 'KH04', date: '23/03/2026', shift: 'afternoon', task: 'Phun thuốc phòng', plotId: 'VT02', cycleId: '2026-XH', assigneeId: 'U04' },
    { id: 'KH05', date: '24/03/2026', shift: 'morning', task: 'Bón phân đợt 2', plotId: 'VT01', cycleId: '2026-DX', assigneeId: 'U05' },
    { id: 'KH06', date: '26/03/2026', shift: 'morning', task: 'Kiểm tra sinh trưởng', plotId: 'VT01', cycleId: '2026-DX', assigneeId: 'U06' },
    { id: 'KH07', date: '28/03/2026', shift: 'morning', task: 'Tưới nước định kỳ', plotId: 'VT02', cycleId: '2026-XH', assigneeId: 'U04' },
];

// =============================================
// TASK LOGS (NHẬT KÝ CANH TÁC) — Theo buổi, liên kết KH
// =============================================
export const taskLogs = [
    { id: 1, date: '21/03/2026', task: 'Bón phân', type: 'farming', cycleId: '2026-DX', plotId: 'VT01', workerId: 'U04', workerName: 'Nguyễn An', shift: 'morning', planId: 'KH05', material: '440kg Lân đỏ', status: 'approved' },
    { id: 2, date: '20/03/2026', task: 'Phun thuốc', type: 'pest', cycleId: '2026-DX', plotId: 'VT01', workerId: 'U05', workerName: 'Trần Văn Tài', shift: 'morning', planId: null, material: 'Sieubymsa 75WP', status: 'pending' },
    { id: 3, date: '19/03/2026', task: 'Tưới nước', type: 'farming', cycleId: '2026-XH', plotId: 'VT02', workerId: 'U07', workerName: 'Nguyễn Văn Phương', shift: 'afternoon', planId: 'KH01', material: null, status: 'approved' },
    { id: 4, date: '18/03/2026', task: 'Gieo sạ', type: 'seed', cycleId: '2026-DX', plotId: 'VT01', workerId: 'U06', workerName: 'Lê Thị Cúc', shift: 'morning', planId: null, material: 'Hạt giống ST25 lô G2026-01', status: 'approved' },
    { id: 5, date: '17/03/2026', task: 'Bón lót', type: 'fertilizer', cycleId: '2026-DX', plotId: 'VT01', workerId: 'U04', workerName: 'Nguyễn An', shift: 'morning', planId: null, material: '200kg phân hữu cơ', status: 'draft' },
    { id: 6, date: '16/03/2026', task: 'Cày xới đất', type: 'farming', cycleId: '2026-DX', plotId: 'VT01', workerId: 'U05', workerName: 'Trần Văn Tài', shift: 'morning', planId: null, material: null, status: 'approved' },
];

// =============================================
// ATTENDANCE (CHẤM CÔNG) — Theo buổi
// =============================================
export const attendance = [
    { id: 'CC01', date: '21/03/2026', workerId: 'U04', workerName: 'Nguyễn An', morning: true, afternoon: true, evening: false, status: 'full', exception: null },
    { id: 'CC02', date: '21/03/2026', workerId: 'U05', workerName: 'Trần Văn Tài', morning: true, afternoon: false, evening: false, status: 'early_leave', exception: { reason: 'Con ốm phải đưa đi bệnh viện', approved: true, approvedBy: 'U06' } },
    { id: 'CC03', date: '21/03/2026', workerId: 'U07', workerName: 'Nguyễn Văn Phương', morning: true, afternoon: true, evening: false, status: 'full', exception: null },
    { id: 'CC04', date: '20/03/2026', workerId: 'U04', workerName: 'Nguyễn An', morning: true, afternoon: true, evening: false, status: 'full', exception: null },
    { id: 'CC05', date: '20/03/2026', workerId: 'U05', workerName: 'Trần Văn Tài', morning: true, afternoon: true, evening: false, status: 'full', exception: null },
];

// =============================================
// PEST INCIDENTS (SÂU BỆNH)
// =============================================
export const pestIncidents = [
    { id: 1, date: '18/03/2026', cycleId: '2026-DX', plotId: 'VT01', plotName: 'Ruộng lúa ST25', type: 'Đạo ôn', severity: 'medium', area: '0.3 ha', treatment: 'Phun Sieubymsa 75WP', phi: 14, harvestSafe: '01/04/2026', status: 'resolved' },
    { id: 2, date: '10/03/2026', cycleId: '2026-XH', plotId: 'VT02', plotName: 'Ruộng cà chua', type: 'Bọ phấn trắng', severity: 'low', area: '0.1 ha', treatment: 'Phun thuốc trừ sâu', phi: 7, harvestSafe: '17/03/2026', status: 'resolved' },
    { id: 3, date: '05/03/2026', cycleId: '2026-DX-2', plotId: 'VT03', plotName: 'Ruộng lúa nếp', type: 'Chuột', severity: 'high', area: '1 ha', treatment: 'Đặt bẫy + thuốc chuột', phi: 0, harvestSafe: null, status: 'monitoring' },
];

// =============================================
// INPUT ITEMS (VẬT TƯ)
// =============================================
export const inputItems = [
    { id: 'VT001', name: 'Lân đỏ', type: 'Phân bón', unit: 'kg', supplier: 'Cty DAP1', stock: 500 },
    { id: 'VT002', name: 'Sieubymsa 75WP', type: 'Nông dược', unit: 'gr', supplier: 'Cty Bayer', stock: 2000 },
    { id: 'VT003', name: 'Hạt giống Lúa ST25', type: 'Nguyên liệu', unit: 'bao', supplier: 'Trung tâm giống', stock: 10 },
    { id: 'VT004', name: 'Phân hữu cơ', type: 'Phân bón', unit: 'tấn', supplier: 'Cty Hữu Cơ Xanh', stock: 20 },
    { id: 'VT005', name: 'Vôi nông nghiệp', type: 'Nguyên liệu', unit: 'kg', supplier: 'Cty Vôi Miền Nam', stock: 800 },
    { id: 'VT006', name: 'Bao đựng lúa PP', type: 'Nguyên liệu', unit: 'bao', supplier: 'Cty Bao Bì ABC', stock: 1500 },
];

// =============================================
// WORKERS (NHÂN CÔNG) — Giữ lại, bỏ cột lương
// =============================================
export const workers = [
    { id: 'NC01', name: 'Nguyễn An', userId: 'U04', role: 'Nhân viên', phone: '0901234567', farmId: 'F01', status: 'active' },
    { id: 'NC02', name: 'Trần Văn Tài', userId: 'U05', role: 'Kỹ thuật', phone: '0912345678', farmId: 'F01', status: 'active' },
    { id: 'NC03', name: 'Nguyễn Văn Phương', userId: 'U07', role: 'Nhân viên', phone: '0923456789', farmId: 'F03', status: 'active' },
    { id: 'NC04', name: 'Lê Thị Cúc', userId: 'U06', role: 'Quản lý', phone: '0934567890', farmId: 'F01', status: 'active' },
];

// =============================================
// EQUIPMENT (THIẾT BỊ)
// =============================================
export const equipment = [
    { id: 'TB01', name: 'Máy cày', type: 'Máy nông nghiệp', farmId: 'F01', status: 'active' },
    { id: 'TB02', name: 'Máy gặt lúa', type: 'Máy nông nghiệp', farmId: 'F01', status: 'active' },
    { id: 'TB03', name: 'Máy bơm nước', type: 'Thiết bị tưới', farmId: 'F01', status: 'pending' },
];

// =============================================
// HARVEST BATCHES (LÔ THU HOẠCH)
// =============================================
export const harvestBatches = [
    { id: 'TH01', date: '25/10/2025', cycleId: '2025-HT', plotId: 'VT01', plotName: 'Ruộng lúa ST25', quantity: '8.5 tấn', quality: 'Đạt', lotCode: 'VT01-251025-B01', isolationOk: true, status: 'completed' },
    { id: 'TH02', date: '25/05/2025', cycleId: '2025-DX', plotId: 'VT01', plotName: 'Ruộng lúa ST25', quantity: '9.2 tấn', quality: 'Đạt', lotCode: 'VT01-250525-B01', isolationOk: true, status: 'completed' },
];

// =============================================
// REPORT DATA — Bỏ cột tiền, giữ sản lượng
// =============================================
export const yieldData = [
    { name: '2025-DX', planned: 10, actual: 9.2 },
    { name: '2025-HT', planned: 10, actual: 8.5 },
    { name: '2026-DX', planned: 10, actual: 0 },
];

// =============================================
// HELPERS
// =============================================
export const getPlotsByFarm = (farmId) => plots.filter((p) => p.farmId === farmId);
export const getFarmsByHtx = (htxId) => farms.filter((f) => f.htxId === htxId);
export const getUsersByFarm = (farmId) => users.filter((u) => u.farmId === farmId);
export const getLogsByPlot = (plotId) => taskLogs.filter((l) => l.plotId === plotId);
export const getAttendanceByDate = (date) => attendance.filter((a) => a.date === date);
export const getCyclesByPlot = (plotId) => cropCycles.filter((c) => c.plotId === plotId);
export const getPestByPlot = (plotId) => pestIncidents.filter((p) => p.plotId === plotId);
