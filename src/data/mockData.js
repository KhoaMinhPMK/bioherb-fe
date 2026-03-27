/**
 * Centralized mock data for all pages.
 * Data model: Sankit Admin -> HTX (Cooperative) -> Farm -> Plot -> CropCycle -> Journals
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
    {
        id: 'U01',
        name: 'Admin Hệ Thống',
        email: 'admin@sankit.vn',
        role: 'admin',
        htxId: null,
        farmId: null,
        status: 'active',
        lastLogin: '22/03/2026 08:00',
    },
    {
        id: 'U02',
        name: 'Nguyễn Thị Bình',
        email: 'binh@sankit.vn',
        role: 'htx_manager',
        htxId: 'HTX01',
        farmId: null,
        status: 'active',
        lastLogin: '21/03/2026 10:30',
    },
    {
        id: 'U03',
        name: 'Giàng A Páo',
        email: 'pao@sankit.vn',
        role: 'farm_manager',
        htxId: 'HTX01',
        farmId: 'F01',
        status: 'active',
        lastLogin: '22/03/2026 07:00',
    },
    {
        id: 'U04',
        name: 'Vàng Thị Mỷ',
        email: 'my@sankit.vn',
        role: 'worker',
        htxId: 'HTX01',
        farmId: 'F01',
        status: 'active',
        lastLogin: '22/03/2026 06:30',
    },
    {
        id: 'U05',
        name: 'Trần Văn Tài',
        email: 'tai@sankit.vn',
        role: 'worker',
        htxId: 'HTX01',
        farmId: 'F01',
        status: 'active',
        lastLogin: '21/03/2026 15:00',
    },
    {
        id: 'U06',
        name: 'Lê Thị Cúc',
        email: 'cuc@sankit.vn',
        role: 'approver',
        htxId: 'HTX01',
        farmId: 'F01',
        status: 'active',
        lastLogin: '22/03/2026 09:00',
    },
    {
        id: 'U07',
        name: 'Nguyễn Văn Phương',
        email: 'phuong@sankit.vn',
        role: 'worker',
        htxId: 'HTX02',
        farmId: 'F02',
        status: 'active',
        lastLogin: '20/03/2026 08:00',
    },
    {
        id: 'U08',
        name: 'Trần Văn Thi',
        email: 'thi@sankit.vn',
        role: 'farm_manager',
        htxId: 'HTX02',
        farmId: 'F02',
        status: 'active',
        lastLogin: '22/03/2026 07:30',
    },
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
    {
        id: 'HTX01',
        name: 'HTX Dược Liệu Sapa',
        province: 'Lào Cai',
        farmIds: ['F01'],
        status: 'active',
        director: 'Giàng A Páo',
        address: 'Tả Phìn, Sapa, Lào Cai',
        phone: '0912111222',
        email: 'sapa@htxbio.vn',
        memberCount: 45,
    },
    {
        id: 'HTX02',
        name: 'HTX Cúc Hoa Vàng',
        province: 'Hưng Yên',
        farmIds: ['F02', 'F03'],
        status: 'active',
        director: 'Trần Văn Minh',
        address: 'Nghĩa Trai, Văn Lâm, Hưng Yên',
        phone: '0988222333',
        email: 'cuchoavang@htxbio.vn',
        memberCount: 30,
    },
    {
        id: 'HTX03',
        name: 'HTX Sâm Ngọc Linh Tu Mơ Rông',
        province: 'Kon Tum',
        farmIds: ['F04'],
        status: 'active',
        director: 'A Đốt',
        address: 'Măng Ri, Tu Mơ Rông',
        phone: '0977444555',
        email: 'samngoclinh@htxbio.vn',
        memberCount: 120,
    },
];

// =============================================
// FARMS
// =============================================
export const farms = [
    {
        id: 'F01',
        name: 'Farm Atiso Sapa',
        htxId: 'HTX01',
        address: 'Tả Phìn, Sapa, Lào Cai',
        plotCount: 3,
        activeCycles: 2,
        managerId: 'U03',
        status: 'active',
    },
    {
        id: 'F02',
        name: 'Trang trại Cúc Hoa Vàng',
        htxId: 'HTX02',
        address: 'Nghĩa Trai, Văn Lâm, Hưng Yên',
        plotCount: 2,
        activeCycles: 2,
        managerId: 'U08',
        status: 'active',
    },
    {
        id: 'F03',
        name: 'Vườn Bạc Hà Nghĩa Trai',
        htxId: 'HTX02',
        address: 'Văn Lâm, Hưng Yên',
        plotCount: 1,
        activeCycles: 1,
        managerId: null,
        status: 'active',
    },
    {
        id: 'F04',
        name: 'Vườn Sâm Dưới Tán',
        htxId: 'HTX03',
        address: 'Măng Ri, Kon Tum',
        plotCount: 2,
        activeCycles: 2,
        managerId: null,
        status: 'active',
    },
];

// =============================================
// PLOTS (VÙNG TRỒNG)
// =============================================
export const plots = [
    {
        id: 'VT01',
        name: 'Đồi Atiso 1',
        farmId: 'F01',
        area: '1.5 ha',
        crop: 'Atiso',
        activeCycle: '2026-ATISO',
        coords: '22.3891, 103.8290',
        status: 'active',
    },
    {
        id: 'VT02',
        name: 'Vườn Tam Thất Bắc',
        farmId: 'F01',
        area: '1.0 ha',
        crop: 'Tam Thất',
        activeCycle: '2026-TT',
        coords: '22.3895, 103.8295',
        status: 'active',
    },
    {
        id: 'VT03',
        name: 'Dốc Xuyên Tâm Liên',
        farmId: 'F01',
        area: '2.0 ha',
        crop: 'Xuyên Tâm Liên',
        activeCycle: null,
        coords: '22.3899, 103.8310',
        status: 'idle',
    },
    {
        id: 'VT04',
        name: 'Mẫu Cúc Hoa Vàng',
        farmId: 'F02',
        area: '1.5 ha',
        crop: 'Cúc Hoa Vàng',
        activeCycle: '2026-CUC',
        coords: '20.9416, 106.0175',
        status: 'active',
    },
    {
        id: 'VT05',
        name: 'Mẫu Cúc Trắng',
        farmId: 'F02',
        area: '1.0 ha',
        crop: 'Cúc Hoa Trắng',
        activeCycle: '2026-CUCTR',
        coords: '20.9420, 106.0180',
        status: 'active',
    },
    {
        id: 'VT06',
        name: 'Đồng Bạc Hà',
        farmId: 'F03',
        area: '1.0 ha',
        crop: 'Bạc Hà',
        activeCycle: '2026-BACHA',
        coords: null,
        status: 'active',
    },
    {
        id: 'VT07',
        name: 'Rừng Dưới Tán',
        farmId: 'F04',
        area: '5.0 ha',
        crop: 'Sâm Ngọc Linh',
        activeCycle: '2026-SAM',
        coords: null,
        status: 'active',
    },
    {
        id: 'VT08',
        name: 'Vườn Đảng Sâm',
        farmId: 'F04',
        area: '2.0 ha',
        crop: 'Đảng Sâm',
        activeCycle: '2026-DANGSAM',
        coords: null,
        status: 'active',
    },
];

// =============================================
// CROP CYCLES (MÙA VỤ)
// =============================================
export const cropCycles = [
    {
        id: '2026-ATISO',
        plotId: 'VT01',
        crop: 'Atiso',
        start: '01/01/2026',
        end: '15/09/2026',
        progress: 35,
        status: 'active',
    },
    {
        id: '2026-TT',
        plotId: 'VT02',
        crop: 'Tam Thất',
        start: '15/02/2026',
        end: '10/10/2026',
        progress: 20,
        status: 'active',
    },
    {
        id: '2026-CUC',
        plotId: 'VT04',
        crop: 'Cúc Hoa Vàng',
        start: '01/03/2026',
        end: '15/11/2026',
        progress: 15,
        status: 'active',
    },
    {
        id: '2026-CUCTR',
        plotId: 'VT05',
        crop: 'Cúc Hoa Trắng',
        start: '10/03/2026',
        end: '10/11/2026',
        progress: 10,
        status: 'active',
    },
    {
        id: '2026-BACHA',
        plotId: 'VT06',
        crop: 'Bạc Hà',
        start: '01/02/2026',
        end: '30/06/2026',
        progress: 40,
        status: 'active',
    },
    {
        id: '2026-SAM',
        plotId: 'VT07',
        crop: 'Sâm Ngọc Linh',
        start: '01/01/2026',
        end: '31/12/2030',
        progress: 5,
        status: 'active',
    },
    {
        id: '2026-DANGSAM',
        plotId: 'VT08',
        crop: 'Đảng Sâm',
        start: '15/01/2026',
        end: '15/12/2026',
        progress: 25,
        status: 'active',
    },
    {
        id: '2025-ATISO',
        plotId: 'VT01',
        crop: 'Atiso',
        start: '01/01/2025',
        end: '15/09/2025',
        progress: 100,
        status: 'closed',
    },
];

// =============================================
// TASK PLANS (KẾ HOẠCH) — Theo buổi
// =============================================
export const taskPlans = [
    {
        id: 'KH01',
        date: '22/03/2026',
        shift: 'morning',
        task: 'Tưới phun sương',
        plotId: 'VT01',
        cycleId: '2026-ATISO',
        assigneeId: 'U04',
    },
    {
        id: 'KH02',
        date: '22/03/2026',
        shift: 'afternoon',
        task: 'Bón phân hữu cơ',
        plotId: 'VT04',
        cycleId: '2026-CUC',
        assigneeId: 'U07',
    },
    {
        id: 'KH03',
        date: '23/03/2026',
        shift: 'morning',
        task: 'Làm cỏ thủ công',
        plotId: 'VT02',
        cycleId: '2026-TT',
        assigneeId: 'U05',
    },
    {
        id: 'KH04',
        date: '23/03/2026',
        shift: 'afternoon',
        task: 'Phun sinh học',
        plotId: 'VT04',
        cycleId: '2026-CUC',
        assigneeId: 'U07',
    },
    {
        id: 'KH05',
        date: '24/03/2026',
        shift: 'morning',
        task: 'Bón phân lót',
        plotId: 'VT01',
        cycleId: '2026-ATISO',
        assigneeId: 'U04',
    },
    {
        id: 'KH06',
        date: '26/03/2026',
        shift: 'morning',
        task: 'Kiểm tra sinh trưởng',
        plotId: 'VT07',
        cycleId: '2026-SAM',
        assigneeId: 'U06',
    },
    {
        id: 'KH07',
        date: '28/03/2026',
        shift: 'morning',
        task: 'Cắt tỉa',
        plotId: 'VT01',
        cycleId: '2026-ATISO',
        assigneeId: 'U04',
    },
    // ── Thêm kế hoạch cuối tháng 3 ──
    {
        id: 'KH08',
        date: '25/03/2026',
        shift: 'morning',
        task: 'Tưới nước + EM',
        plotId: 'VT01',
        cycleId: '2026-ATISO',
        assigneeId: 'U04',
    },
    {
        id: 'KH09',
        date: '25/03/2026',
        shift: 'afternoon',
        task: 'Xới đất tơi',
        plotId: 'VT04',
        cycleId: '2026-CUC',
        assigneeId: 'U07',
    },
    {
        id: 'KH10',
        date: '27/03/2026',
        shift: 'morning',
        task: 'Kiểm tra cây con',
        plotId: 'VT02',
        cycleId: '2026-TT',
        assigneeId: 'U05',
    },
    {
        id: 'KH11',
        date: '29/03/2026',
        shift: 'morning',
        task: 'Phun dịch tỏi ớt',
        plotId: 'VT01',
        cycleId: '2026-ATISO',
        assigneeId: 'U04',
    },
    {
        id: 'KH12',
        date: '30/03/2026',
        shift: 'morning',
        task: 'Bón phân đợt 2',
        plotId: 'VT04',
        cycleId: '2026-CUC',
        assigneeId: 'U07',
    },
    {
        id: 'KH13',
        date: '31/03/2026',
        shift: 'morning',
        task: 'Đánh giá tháng',
        plotId: 'VT01',
        cycleId: '2026-ATISO',
        assigneeId: 'U06',
    },
];

// =============================================
// TASK LOGS (NHẬT KÝ CANH TÁC)
// =============================================
export const taskLogs = [
    {
        id: 1,
        date: '21/03/2026',
        task: 'Bón phân',
        type: 'farming',
        cycleId: '2026-ATISO',
        plotId: 'VT01',
        workerId: 'U04',
        workerName: 'Vàng Thị Mỷ',
        shift: 'morning',
        planId: 'KH05',
        material: '200kg Phân trùn quế',
        status: 'approved',
    },
    {
        id: 2,
        date: '20/03/2026',
        task: 'Phun thuốc',
        type: 'pest',
        cycleId: '2026-ATISO',
        plotId: 'VT01',
        workerId: 'U05',
        workerName: 'Trần Văn Tài',
        shift: 'morning',
        planId: null,
        material: 'Chế phẩm EM1',
        status: 'pending',
    },
    {
        id: 3,
        date: '19/03/2026',
        task: 'Làm cỏ',
        type: 'farming',
        cycleId: '2026-CUC',
        plotId: 'VT04',
        workerId: 'U07',
        workerName: 'Nguyễn Văn Phương',
        shift: 'afternoon',
        planId: 'KH01',
        material: null,
        status: 'approved',
    },
    {
        id: 4,
        date: '18/03/2026',
        task: 'Gieo hạt',
        type: 'seed',
        cycleId: '2026-ATISO',
        plotId: 'VT01',
        workerId: 'U06',
        workerName: 'Lê Thị Cúc',
        shift: 'morning',
        planId: null,
        material: 'Hạt giống Atiso chuẩn',
        status: 'approved',
    },
    {
        id: 5,
        date: '17/03/2026',
        task: 'Bổ sung mùn',
        type: 'fertilizer',
        cycleId: '2026-SAM',
        plotId: 'VT07',
        workerId: 'U08',
        workerName: 'Trần Văn Thi',
        shift: 'morning',
        planId: null,
        material: 'Lá cây ủ mục',
        status: 'draft',
    },
    {
        id: 6,
        date: '16/03/2026',
        task: 'Xới đất',
        type: 'farming',
        cycleId: '2026-ATISO',
        plotId: 'VT01',
        workerId: 'U05',
        workerName: 'Trần Văn Tài',
        shift: 'morning',
        planId: null,
        material: null,
        status: 'approved',
    },
    // ── Thêm nhật ký cuối tháng 3 ──
    {
        id: 7,
        date: '22/03/2026',
        task: 'Tưới phun sương',
        type: 'farming',
        cycleId: '2026-ATISO',
        plotId: 'VT01',
        workerId: 'U04',
        workerName: 'Vàng Thị Mỷ',
        shift: 'morning',
        planId: 'KH01',
        material: null,
        status: 'approved',
    },
    {
        id: 8,
        date: '23/03/2026',
        task: 'Làm cỏ thủ công',
        type: 'farming',
        cycleId: '2026-TT',
        plotId: 'VT02',
        workerId: 'U05',
        workerName: 'Trần Văn Tài',
        shift: 'morning',
        planId: 'KH03',
        material: null,
        status: 'approved',
    },
    {
        id: 9,
        date: '24/03/2026',
        task: 'Bón phân lót',
        type: 'farming',
        cycleId: '2026-ATISO',
        plotId: 'VT01',
        workerId: 'U04',
        workerName: 'Vàng Thị Mỷ',
        shift: 'morning',
        planId: 'KH05',
        material: '150kg Phân hữu cơ',
        status: 'pending',
    },
    {
        id: 10,
        date: '25/03/2026',
        task: 'Tưới nước + EM',
        type: 'farming',
        cycleId: '2026-ATISO',
        plotId: 'VT01',
        workerId: 'U04',
        workerName: 'Vàng Thị Mỷ',
        shift: 'morning',
        planId: 'KH08',
        material: 'EM1 pha 1:500',
        status: 'approved',
    },
    {
        id: 11,
        date: '15/03/2026',
        task: 'Chuẩn bị đất',
        type: 'farming',
        cycleId: '2026-CUC',
        plotId: 'VT04',
        workerId: 'U07',
        workerName: 'Nguyễn Văn Phương',
        shift: 'morning',
        planId: null,
        material: null,
        status: 'approved',
    },
];

// =============================================
// ATTENDANCE (CHẤM CÔNG)
// =============================================
export const attendance = [
    {
        id: 'ATT01',
        date: '22/03/2026',
        userId: 'U04',
        userName: 'Vàng Thị Mỷ',
        farmId: 'F01',
        shifts: { morning: true, afternoon: true, evening: false },
        status: 'full',
        exception: null,
    },
    {
        id: 'ATT02',
        date: '22/03/2026',
        userId: 'U05',
        userName: 'Trần Văn Tài',
        farmId: 'F01',
        shifts: { morning: true, afternoon: false, evening: false },
        status: 'exception',
        exception: { type: 'early_leave', reason: 'Nghỉ mệt', approved: null },
    },
    {
        id: 'ATT03',
        date: '22/03/2026',
        userId: 'U06',
        userName: 'Lê Thị Cúc',
        farmId: 'F01',
        shifts: { morning: true, afternoon: true, evening: true },
        status: 'full',
        exception: null,
    },
    {
        id: 'ATT04',
        date: '21/03/2026',
        userId: 'U04',
        userName: 'Vàng Thị Mỷ',
        farmId: 'F01',
        shifts: { morning: true, afternoon: true, evening: false },
        status: 'full',
        exception: null,
    },
    {
        id: 'ATT05',
        date: '21/03/2026',
        userId: 'U05',
        userName: 'Trần Văn Tài',
        farmId: 'F01',
        shifts: { morning: true, afternoon: true, evening: false },
        status: 'full',
        exception: null,
    },
    {
        id: 'ATT06',
        date: '21/03/2026',
        userId: 'U06',
        userName: 'Lê Thị Cúc',
        farmId: 'F01',
        shifts: { morning: true, afternoon: true, evening: false },
        status: 'full',
        exception: null,
    },
    {
        id: 'ATT07',
        date: '20/03/2026',
        userId: 'U04',
        userName: 'Vàng Thị Mỷ',
        farmId: 'F01',
        shifts: { morning: true, afternoon: true, evening: false },
        status: 'full',
        exception: null,
    },
    {
        id: 'ATT08',
        date: '20/03/2026',
        userId: 'U05',
        userName: 'Trần Văn Tài',
        farmId: 'F01',
        shifts: { morning: true, afternoon: true, evening: false },
        status: 'full',
        exception: null,
    },
    {
        id: 'ATT09',
        date: '20/03/2026',
        userId: 'U06',
        userName: 'Lê Thị Cúc',
        farmId: 'F01',
        shifts: { morning: false, afternoon: true, evening: true },
        status: 'exception',
        exception: { type: 'early_leave', reason: 'Về sớm xử lý tồn kho', approved: true },
    },
    {
        id: 'ATT10',
        date: '19/03/2026',
        userId: 'U04',
        userName: 'Vàng Thị Mỷ',
        farmId: 'F01',
        shifts: { morning: true, afternoon: true, evening: false },
        status: 'full',
        exception: null,
    },
    {
        id: 'ATT11',
        date: '19/03/2026',
        userId: 'U05',
        userName: 'Trần Văn Tài',
        farmId: 'F01',
        shifts: { morning: true, afternoon: true, evening: false },
        status: 'full',
        exception: null,
    },
    {
        id: 'ATT12',
        date: '19/03/2026',
        userId: 'U06',
        userName: 'Lê Thị Cúc',
        farmId: 'F01',
        shifts: { morning: true, afternoon: true, evening: false },
        status: 'full',
        exception: null,
    },
];

export const getAttendanceByFarm = (farmId) => attendance.filter((a) => a.farmId === farmId);

// =============================================
// PEST INCIDENTS (SÂU BỆNH)
// =============================================
export const pestIncidents = [
    {
        id: 1,
        date: '18/03/2026',
        cycleId: '2026-ATISO',
        plotId: 'VT01',
        plotName: 'Đồi Atiso 1',
        type: 'Rệp sáp',
        severity: 'medium',
        area: '0.3 ha',
        treatment: 'Phun Dầu Neem',
        phi: 3,
        harvestSafe: '21/03/2026',
        status: 'resolved',
    },
    {
        id: 2,
        date: '10/03/2026',
        cycleId: '2026-SAM',
        plotId: 'VT07',
        plotName: 'Rừng Dưới Tán',
        type: 'Nấm Cổ rễ',
        severity: 'low',
        area: '0.1 ha',
        treatment: 'Phun Trichoderma',
        phi: 7,
        harvestSafe: '17/03/2026',
        status: 'resolved',
    },
    {
        id: 3,
        date: '05/03/2026',
        cycleId: '2026-CUC',
        plotId: 'VT04',
        plotName: 'Mẫu Cúc Hoa Vàng',
        type: 'Sâu cuốn lá',
        severity: 'high',
        area: '1.2 ha',
        treatment: 'Sử dụng thiên địch',
        phi: 0,
        harvestSafe: null,
        status: 'monitoring',
    },
];

// =============================================
// INPUT ITEMS (VẬT TƯ)
// =============================================
export const inputItems = [
    {
        id: 'VT001',
        name: 'Phân vi sinh trùn quế',
        type: 'Phân bón',
        unit: 'kg',
        supplier: 'Cty Phân Bón Vi Sinh',
        stock: 500,
    },
    { id: 'VT002', name: 'Chế phẩm EM1', type: 'Nông dược', unit: 'lít', supplier: 'Viện Nông Nghiệp', stock: 200 },
    {
        id: 'VT003',
        name: 'Hạt giống Atiso',
        type: 'Nguyên liệu',
        unit: 'gói',
        supplier: 'Trung tâm giống Sapa',
        stock: 10,
    },
    { id: 'VT004', name: 'Phân chuồng ủ hoai mục', type: 'Phân bón', unit: 'tấn', supplier: 'Tự sản xuất', stock: 20 },
    { id: 'VT005', name: 'Dịch tỏi ớt', type: 'Nguyên liệu', unit: 'lít', supplier: 'Cty Hữu Cơ ĐX', stock: 80 },
    {
        id: 'VT006',
        name: 'Bao lót lưới bảo quản M1',
        type: 'Nguyên liệu',
        unit: 'bao',
        supplier: 'Cty Bao Bì ABC',
        stock: 1500,
    },
];

// =============================================
// WORKERS (NHÂN CÔNG)
// =============================================
export const workers = [
    {
        id: 'NC01',
        name: 'Vàng Thị Mỷ',
        userId: 'U04',
        role: 'Nhân viên',
        phone: '0901234567',
        farmId: 'F01',
        status: 'active',
    },
    {
        id: 'NC02',
        name: 'Trần Văn Tài',
        userId: 'U05',
        role: 'Kỹ thuật',
        phone: '0912345678',
        farmId: 'F01',
        status: 'active',
    },
    {
        id: 'NC03',
        name: 'Nguyễn Văn Phương',
        userId: 'U07',
        role: 'Nhân viên',
        phone: '0923456789',
        farmId: 'F02',
        status: 'active',
    },
    {
        id: 'NC04',
        name: 'Lê Thị Cúc',
        userId: 'U06',
        role: 'Quản lý',
        phone: '0934567890',
        farmId: 'F01',
        status: 'active',
    },
];

// =============================================
// EQUIPMENT (THIẾT BỊ)
// =============================================
export const equipment = [
    { id: 'TB01', name: 'Máy sấy lạnh dược liệu', type: 'Xưởng sấy', farmId: 'F01', status: 'active' },
    { id: 'TB02', name: 'Hệ thống tưới phun sương', type: 'Máy nông nghiệp', farmId: 'F01', status: 'active' },
    { id: 'TB03', name: 'Máy thái thảo dược tự động', type: 'Sơ chế', farmId: 'F01', status: 'pending' },
];

// =============================================
// HARVEST BATCHES (LÔ THU HOẠCH)
// =============================================
export const harvestBatches = [
    {
        id: 'TH01',
        date: '25/10/2025',
        cycleId: '2025-ATISO',
        plotId: 'VT01',
        plotName: 'Đồi Atiso 1',
        quantity: '8.5 tấn',
        quality: 'Chất lượng cao',
        lotCode: 'VT01-251025-B01',
        isolationOk: true,
        status: 'completed',
    },
    {
        id: 'TH02',
        date: '25/05/2025',
        cycleId: '2025-ATISO',
        plotId: 'VT01',
        plotName: 'Đồi Atiso 1',
        quantity: '9.2 tấn',
        quality: 'Đạt',
        lotCode: 'VT01-250525-B01',
        isolationOk: true,
        status: 'completed',
    },
];

// =============================================
// REPORT DATA
// =============================================
export const yieldData = [
    { name: '2025-C1', planned: 10, actual: 9.2 },
    { name: '2025-C2', planned: 10, actual: 8.5 },
    { name: '2026-C1', planned: 10, actual: 0 },
];

export const notifications = [
    {
        id: 'N01',
        title: 'Cảnh báo dịch hại',
        message: 'Phát hiện rệp sáp tại khu vực Atiso VT01.',
        time: '12:00 23/03/2026',
        read: false,
        type: 'warning',
    },
    {
        id: 'N02',
        title: 'Hoàn tất bảo trì',
        message: 'Hệ thống sấy lạnh đã bảo trì xong.',
        time: '08:30 23/03/2026',
        read: true,
        type: 'success',
    },
];

export const activityLog = [
    {
        id: 'A01',
        user: 'Admin Hệ Thống',
        action: 'Đăng nhập',
        details: 'Đăng nhập vào hệ thống',
        time: '08:00 23/03/2026',
    },
    {
        id: 'A02',
        user: 'Trần Văn Tài',
        action: 'Khai báo vật tư',
        details: 'Nhập xuất phân trùn quế',
        time: '07:00 22/03/2026',
    },
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
