/**
 * GACP-WHO Diary — Constants & Entry Type Definitions
 *
 * Config cho 15 loại biểu mẫu nhật ký vùng trồng theo chuẩn GACP-WHO.
 * Mỗi type có: id, iconName (Lucide), label, color, columns, columnLabels,
 * columnTypes (text/date/number/select/textarea), columnOptions (for selects),
 * columnAutoFill (auto-fill rules), columnWidths.
 *
 * @see Quy_Tac_Phat_Trien_SANKIT.md §15, §32
 */

// ─── Severity / Risk levels ───────────────────────────────────
export const SEVERITY_OPTIONS = [
    { value: 'low', label: 'Nhẹ' },
    { value: 'medium', label: 'Trung bình' },
    { value: 'high', label: 'Nặng' },
    { value: 'critical', label: 'Nghiêm trọng' },
];

export const RISK_OPTIONS = [
    { value: 'low', label: 'Thấp' },
    { value: 'medium', label: 'Trung bình' },
    { value: 'high', label: 'Cao' },
];

export const WEATHER_OPTIONS = [
    { value: 'sunny', label: 'Nắng' },
    { value: 'cloudy', label: 'Mây' },
    { value: 'rainy', label: 'Mưa' },
    { value: 'storm', label: 'Giông' },
];

// Column type enum
const T = { TEXT: 'text', DATE: 'date', NUM: 'number', SEL: 'select', AREA: 'textarea' };
// Auto-fill rules
const A = { TODAY: 'today', USER: 'currentUser', AUTO_LOT: 'autoLot' };

// ─── 15 Entry Types ───────────────────────────────────────────
export const GACP_ENTRY_TYPES = [
    {
        id: 'seed_production',
        iconName: 'Sprout',
        label: 'Hạt giống',
        color: '#4CAF50',
        group: 'land',
        columns: ['lotCode', 'seedName', 'quantity', 'method', 'sowDate', 'sproutDate', 'sproutRate', 'monitor'],
        columnLabels: [
            'Ký hiệu lô',
            'Tên giống',
            'SL (kg)',
            'PP xử lý',
            'Ngày gieo',
            'Ngày mọc',
            'TL mọc (%)',
            'Người TD',
        ],
        columnTypes: [T.TEXT, T.TEXT, T.NUM, T.TEXT, T.DATE, T.DATE, T.NUM, T.TEXT],
        columnWidths: [100, 140, 80, 120, 110, 110, 80, 100],
        columnAutoFill: { lotCode: A.AUTO_LOT, sowDate: A.TODAY, monitor: A.USER },
        columnPlaceholders: { lotCode: 'LH-001', seedName: 'Ích Mẫu giống QN', method: 'Ngâm nước ấm 6h' },
        pdfTitle: 'BIỂU THEO DÕI SẢN XUẤT HẠT GIỐNG THEO GACP – WHO',
    },
    {
        id: 'land_history',
        iconName: 'Mountain',
        label: 'Lịch sử đất',
        color: '#8D6E63',
        group: 'land',
        columns: ['landLotCode', 'cropName', 'period'],
        columnLabels: ['Ký hiệu lô', 'Cây trồng', 'Thời gian trồng'],
        columnTypes: [T.TEXT, T.TEXT, T.TEXT],
        columnWidths: [120, 160, 200],
        columnAutoFill: {},
        columnPlaceholders: { landLotCode: 'LD-01', cropName: 'Lúa nước', period: '2024-06 đến 2025-01' },
        pdfTitle: 'BIỂU THEO DÕI LỊCH SỬ VÙNG ĐẤT TRỒNG THEO GACP - WHO',
    },
    {
        id: 'soil_condition',
        iconName: 'Layers',
        label: 'Tình trạng đất',
        color: '#A1887F',
        group: 'land',
        columns: ['sampleDate', 'condition', 'solution', 'monitor'],
        columnLabels: ['Ngày lấy mẫu', 'Tình trạng đất', 'Hướng giải quyết', 'Người TD'],
        columnTypes: [T.DATE, T.AREA, T.AREA, T.TEXT],
        columnWidths: [110, 200, 200, 100],
        columnAutoFill: { sampleDate: A.TODAY, monitor: A.USER },
        columnPlaceholders: { condition: 'Đất thịt pha cát, pH 6.2', solution: 'Bổ sung phân hữu cơ' },
        pdfTitle: 'BIỂU THEO DÕI TÌNH TRẠNG ĐẤT TRỒNG THEO GACP - WHO',
    },
    {
        id: 'water_pollution',
        iconName: 'Droplets',
        label: 'Ô nhiễm nước',
        color: '#42A5F5',
        group: 'water',
        columns: ['pollutionSource', 'riskLevel', 'monitor', 'solution'],
        columnLabels: ['Nguồn ô nhiễm', 'Nguy cơ', 'Người TD', 'Hướng xử lý'],
        columnTypes: [T.AREA, T.SEL, T.TEXT, T.AREA],
        columnWidths: [200, 100, 100, 200],
        columnOptions: { riskLevel: RISK_OPTIONS },
        columnAutoFill: { monitor: A.USER },
        columnPlaceholders: {},
        pdfTitle: 'BIỂU ĐÁNH GIÁ NGUY CƠ Ô NHIỄM NGUỒN NƯỚC TƯỚI THEO GACP - WHO',
    },
    {
        id: 'water_treatment',
        iconName: 'Filter',
        label: 'Xử lý nước',
        color: '#29B6F6',
        group: 'water',
        columns: ['waterSource', 'treatmentMethod', 'worker'],
        columnLabels: ['Nguồn nước', 'PP xử lý', 'Người xử lý'],
        columnTypes: [T.TEXT, T.AREA, T.TEXT],
        columnWidths: [160, 240, 120],
        columnAutoFill: { worker: A.USER },
        columnPlaceholders: { waterSource: 'Giếng khoan 25m' },
        pdfTitle: 'BIỂU THEO DÕI PHƯƠNG PHÁP XỬ LÝ NƯỚC TƯỚI KHI BỊ Ô NHIỄM THEO GACP - WHO',
    },
    {
        id: 'organic_fertilizer',
        iconName: 'Recycle',
        label: 'Phân hữu cơ',
        color: '#66BB6A',
        group: 'chem',
        columns: ['task', 'worker'],
        columnLabels: ['Nội dung công việc', 'Người TH'],
        columnTypes: [T.AREA, T.TEXT],
        columnWidths: [350, 120],
        columnAutoFill: { worker: A.USER },
        columnPlaceholders: { task: 'Ủ phân bò + rơm rạ, đảo lần 2' },
        pdfTitle: 'BIỂU THEO DÕI XỬ LÝ PHÂN HỮU CƠ THEO GACP – WHO',
    },
    {
        id: 'chemical_origin',
        iconName: 'FlaskConical',
        label: 'Nguồn gốc PB',
        color: '#FFA726',
        group: 'chem',
        columns: ['chemName', 'quantity', 'producer', 'buyer'],
        columnLabels: ['Tên PB/HC/thuốc BVTV', 'SL (kg)', 'ĐV sản xuất', 'Người mua'],
        columnTypes: [T.TEXT, T.NUM, T.TEXT, T.TEXT],
        columnWidths: [200, 80, 160, 120],
        columnAutoFill: { buyer: A.USER },
        columnPlaceholders: {},
        pdfTitle: 'BIỂU THEO DÕI NGUỒN GỐC PHÂN BÓN, HÓA CHẤT VÀ THUỐC BVTV THEO GACP – WHO',
    },
    {
        id: 'chemical_usage',
        iconName: 'Pill',
        label: 'Sử dụng PB',
        color: '#EF5350',
        group: 'chem',
        columns: ['landLot', 'chemName', 'dosage', 'method', 'worker', 'isolationDays'],
        columnLabels: ['Lô/thửa', 'Tên PB/HC/thuốc', 'Lượng dùng', 'PP sử dụng', 'Người TH', 'Cách ly (ngày)'],
        columnTypes: [T.TEXT, T.TEXT, T.TEXT, T.TEXT, T.TEXT, T.NUM],
        columnWidths: [80, 160, 100, 120, 100, 90],
        columnAutoFill: { worker: A.USER },
        columnPlaceholders: { landLot: 'LD-01', dosage: '50kg/1000m²', method: 'Bón lót rải đều' },
        pdfTitle: 'BIỂU THEO DÕI SỬ DỤNG PHÂN BÓN, HÓA CHẤT VÀ THUỐC BVTV THEO GACP – WHO',
    },
    {
        id: 'chemical_disposal',
        iconName: 'Trash2',
        label: 'Tiêu hủy HC',
        color: '#78909C',
        group: 'chem',
        columns: ['chemName', 'quantity', 'unit', 'purchasePlace', 'buyer', 'storage', 'disposer', 'disposalMethod'],
        columnLabels: [
            'Tên thuốc',
            'SL',
            'Đơn vị',
            'Nơi mua',
            'Người mua',
            'Bảo quản',
            'Người tiêu hủy',
            'PP tiêu hủy',
        ],
        columnTypes: [T.TEXT, T.NUM, T.TEXT, T.TEXT, T.TEXT, T.TEXT, T.TEXT, T.AREA],
        columnWidths: [140, 60, 60, 120, 100, 100, 120, 160],
        columnAutoFill: { disposer: A.USER },
        columnPlaceholders: { unit: 'gói' },
        pdfTitle: 'BIỂU THEO DÕI TIÊU HỦY HÓA CHẤT - THUỐC BVTV HẾT HẠN SỬ DỤNG THEO GACP – WHO',
    },
    {
        id: 'daily_care',
        iconName: 'ClipboardList',
        label: 'Chăm sóc',
        color: '#26A69A',
        group: 'ops',
        columns: ['task', 'worker', 'weather'],
        columnLabels: ['Công việc thực hiện', 'Người TH', 'Thời tiết'],
        columnTypes: [T.AREA, T.TEXT, T.SEL],
        columnWidths: [280, 120, 100],
        columnOptions: { weather: WEATHER_OPTIONS },
        columnAutoFill: { worker: A.USER, weather: 'sunny' },
        columnPlaceholders: { task: 'Tưới nước, kiểm tra lá' },
        pdfTitle: 'BIỂU THEO DÕI NUÔI TRỒNG, CHĂM SÓC THEO GACP – WHO',
    },
    {
        id: 'pest_tracking',
        iconName: 'Bug',
        label: 'Sâu bệnh',
        color: '#EC407A',
        group: 'ops',
        columns: ['pestName', 'severity', 'solution', 'postResult', 'monitor'],
        columnLabels: ['Sâu/bệnh', 'Mức độ', 'Biện pháp xử lý', 'Sau xử lý', 'Người TD'],
        columnTypes: [T.TEXT, T.SEL, T.AREA, T.AREA, T.TEXT],
        columnWidths: [120, 100, 180, 180, 100],
        columnOptions: { severity: SEVERITY_OPTIONS },
        columnAutoFill: { monitor: A.USER },
        columnPlaceholders: { pestName: 'Rệp muội' },
        pdfTitle: 'BIỂU THEO DÕI TÌNH HÌNH SÂU, BỆNH HẠI THEO GACP – WHO',
    },
    {
        id: 'harvest',
        iconName: 'Wheat',
        label: 'Thu hoạch',
        color: '#FFB300',
        group: 'harvest',
        columns: ['lotCode', 'freshWeight', 'morphology', 'monitor'],
        columnLabels: ['Ký hiệu lô', 'KL tươi (kg)', 'Mô tả hình thái', 'Người TD'],
        columnTypes: [T.TEXT, T.NUM, T.AREA, T.TEXT],
        columnWidths: [120, 100, 220, 100],
        columnAutoFill: { lotCode: A.AUTO_LOT, monitor: A.USER },
        columnPlaceholders: { lotCode: 'TH-IM-001', morphology: 'Thân cao 40-60cm, lá xanh đậm' },
        pdfTitle: 'BIỂU THEO DÕI THU HOẠCH DƯỢC LIỆU THEO GACP – WHO',
    },
    {
        id: 'waste_management',
        iconName: 'FolderArchive',
        label: 'Chất thải',
        color: '#8D6E63',
        group: 'harvest',
        columns: ['wasteType', 'wasteWeight', 'treatmentMethod', 'monitor'],
        columnLabels: ['Loại rác thải', 'Lượng (kg)', 'PP xử lý', 'Người TD'],
        columnTypes: [T.TEXT, T.NUM, T.TEXT, T.TEXT],
        columnWidths: [160, 100, 200, 100],
        columnAutoFill: { monitor: A.USER },
        columnPlaceholders: { treatmentMethod: 'Ủ compost tại chỗ' },
        pdfTitle: 'BIỂU THEO DÕI QUẢN LÝ CHẤT THẢI RẮN HỮU CƠ THEO GACP - WHO',
    },
    {
        id: 'equipment_usage',
        iconName: 'Wrench',
        label: 'Thiết bị',
        color: '#546E7A',
        group: 'equipment',
        columns: ['toolName', 'duration', 'toolCondition', 'worker', 'inspector'],
        columnLabels: ['Dụng cụ', 'Thời gian TH', 'Tình trạng DC', 'Người TH', 'Người KT'],
        columnTypes: [T.TEXT, T.TEXT, T.TEXT, T.TEXT, T.TEXT],
        columnWidths: [140, 120, 140, 100, 100],
        columnAutoFill: { worker: A.USER },
        columnPlaceholders: { toolName: 'Máy xới đất', duration: '4 giờ' },
        pdfTitle: 'BIỂU THEO DÕI SỬ DỤNG THIẾT BỊ TRỒNG DƯỢC LIỆU THEO GACP – WHO',
    },
    {
        id: 'incident',
        iconName: 'AlertTriangle',
        label: 'Sự cố',
        color: '#F44336',
        group: 'equipment',
        columns: ['incident', 'cause', 'riskLevel', 'monitor'],
        columnLabels: ['Sự cố', 'Nguyên nhân', 'Đánh giá rủi ro', 'Người TD'],
        columnTypes: [T.AREA, T.AREA, T.SEL, T.TEXT],
        columnWidths: [200, 200, 100, 100],
        columnOptions: { riskLevel: RISK_OPTIONS },
        columnAutoFill: { monitor: A.USER },
        columnPlaceholders: { incident: 'Mô tả sự cố' },
        pdfTitle: 'BIỂU THEO DÕI SỰ CỐ, RỦI RO TRONG QUÁ TRÌNH SẢN XUẤT',
    },
];

// ─── Quick lookup map ─────────────────────────────────────────
export const GACP_TYPE_MAP = Object.fromEntries(GACP_ENTRY_TYPES.map((t) => [t.id, t]));

// ─── Icon map: name → Lucide component (lazy resolve) ────────
export { default as GACPIconMap } from './gacpIcons';

// ─── Default cover metadata ───────────────────────────────────
export const GACP_COVER_DEFAULT = {
    companyName: '',
    zoneName: 'Vùng trồng dược liệu',
    address: '',
    issueDate: new Date().toISOString().slice(0, 10),
    lotCode: '',
    herbName: 'Ích Mẫu',
};

// ─── Auto-fill rule constants (re-exported for spreadsheet) ───
export const AUTO_FILL_RULES = A;

// ─── Phase grouping for vertical tab layout ───────────────────
export const GACP_PHASES = [
    {
        id: 'prepare',
        label: 'Chuẩn bị',
        iconName: 'Shovel',
        groups: ['land', 'water'],
    },
    {
        id: 'cultivate',
        label: 'Chăm sóc',
        iconName: 'Leaf',
        groups: ['chem', 'ops'],
    },
    {
        id: 'harvest',
        label: 'Thu hoạch',
        iconName: 'Wheat',
        groups: ['harvest'],
    },
    {
        id: 'manage',
        label: 'Quản lý',
        iconName: 'Settings',
        groups: ['equipment'],
    },
];
