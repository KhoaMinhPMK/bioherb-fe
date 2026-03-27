/**
 * GACP-WHO Diary — Mock Data
 *
 * Mock entries cho 15 loại biểu mẫu nhật ký vùng trồng GACP-WHO.
 * Shape giống response backend tương lai để dễ swap.
 *
 * @see gacpConstants.js for type definitions
 * @see Quy_Tac_Phat_Trien_SANKIT.md §15, §39
 */

export const gacpCoverData = {
    companyName: 'CÔNG TY TNHH SANKIT',
    zoneName: 'Vùng trồng dược liệu Ích Mẫu',
    address: 'Xã Phú Lâm, Huyện Tiên Phước, Tỉnh Quảng Nam',
    issueDate: '2026-01-15',
    lotCode: 'VT-IM-2026-001',
    herbName: 'Ích Mẫu',
};

export const gacpEntries = [
    // ① Hạt giống
    {
        id: 'GACP-001',
        type: 'seed_production',
        plotId: 'P01',
        date: '2026-03-20',
        createdBy: 'U01',
        createdAt: '2026-03-20T07:30:00',
        note: 'Gieo đợt 1',
        data: {
            lotCode: 'LH-001',
            seedName: 'Ích Mẫu giống Quảng Nam',
            quantity: '5',
            method: 'Ngâm nước ấm 6h',
            sowDate: '2026-03-20',
            sproutDate: '2026-03-27',
            sproutRate: '85',
            monitor: 'Nguyễn Văn A',
        },
    },
    {
        id: 'GACP-002',
        type: 'seed_production',
        plotId: 'P01',
        date: '2026-03-22',
        createdBy: 'U01',
        createdAt: '2026-03-22T08:00:00',
        note: 'Gieo đợt 2 bổ sung',
        data: {
            lotCode: 'LH-002',
            seedName: 'Ích Mẫu giống Quảng Nam',
            quantity: '3',
            method: 'Ngâm nước ấm 6h',
            sowDate: '2026-03-22',
            sproutDate: '',
            sproutRate: '',
            monitor: 'Trần Văn B',
        },
    },
    // ② Lịch sử đất
    {
        id: 'GACP-003',
        type: 'land_history',
        plotId: 'P01',
        date: '2026-01-10',
        createdBy: 'U01',
        createdAt: '2026-01-10T09:00:00',
        note: '',
        data: { landLotCode: 'LD-01', cropName: 'Lúa nước', period: '2024-06 đến 2025-01' },
    },
    {
        id: 'GACP-004',
        type: 'land_history',
        plotId: 'P01',
        date: '2026-01-10',
        createdBy: 'U01',
        createdAt: '2026-01-10T09:05:00',
        note: 'Đất nghỉ 6 tháng trước khi trồng dược liệu',
        data: { landLotCode: 'LD-01', cropName: 'Để đất nghỉ', period: '2025-02 đến 2025-08' },
    },
    // ③ Tình trạng đất
    {
        id: 'GACP-005',
        type: 'soil_condition',
        plotId: 'P01',
        date: '2026-02-15',
        createdBy: 'U01',
        createdAt: '2026-02-15T10:00:00',
        note: 'Lấy mẫu đợt 1 gửi phân tích',
        data: {
            sampleDate: '2026-02-15',
            condition: 'Đất thịt pha cát, pH 6.2, không phát hiện kim loại nặng',
            solution: 'Bổ sung phân hữu cơ vi sinh',
            monitor: 'Nguyễn Văn A',
        },
    },
    // ④ Nguy cơ ô nhiễm nước
    {
        id: 'GACP-006',
        type: 'water_pollution',
        plotId: 'P01',
        date: '2026-02-20',
        createdBy: 'U02',
        createdAt: '2026-02-20T14:00:00',
        note: '',
        data: {
            pollutionSource: 'Nước thải sinh hoạt từ khu dân cư gần đó',
            riskLevel: 'low',
            monitor: 'Trần Văn B',
            solution: 'Xây mương thoát nước riêng, không dùng nước kênh gần khu dân cư',
        },
    },
    // ⑤ Xử lý nước
    {
        id: 'GACP-007',
        type: 'water_treatment',
        plotId: 'P01',
        date: '2026-03-01',
        createdBy: 'U01',
        createdAt: '2026-03-01T08:00:00',
        note: 'Xử lý nước giếng khoan',
        data: {
            waterSource: 'Giếng khoan sâu 25m',
            treatmentMethod: 'Lắng lọc qua bể cát + than hoạt tính',
            worker: 'Nguyễn Văn A',
        },
    },
    // ⑥ Phân hữu cơ
    {
        id: 'GACP-008',
        type: 'organic_fertilizer',
        plotId: 'P01',
        date: '2026-02-25',
        createdBy: 'U01',
        createdAt: '2026-02-25T07:00:00',
        note: '',
        data: { task: 'Ủ phân bò + rơm rạ theo phương pháp EM, đảo lần 2', worker: 'Nguyễn Văn A' },
    },
    // ⑦ Nguồn gốc phân bón
    {
        id: 'GACP-009',
        type: 'chemical_origin',
        plotId: 'P01',
        date: '2026-03-05',
        createdBy: 'U01',
        createdAt: '2026-03-05T09:30:00',
        note: 'Mua đợt 1 cho vụ xuân',
        data: {
            chemName: 'Phân hữu cơ vi sinh Sông Gianh',
            quantity: '200',
            producer: 'Cty CP Sông Gianh',
            buyer: 'Nguyễn Văn A',
        },
    },
    // ⑧ Sử dụng phân bón
    {
        id: 'GACP-010',
        type: 'chemical_usage',
        plotId: 'P01',
        date: '2026-03-18',
        createdBy: 'U01',
        createdAt: '2026-03-18T06:30:00',
        note: 'Bón lót trước khi trồng',
        data: {
            landLot: 'LD-01',
            chemName: 'Phân hữu cơ vi sinh Sông Gianh',
            dosage: '50kg/1000m²',
            method: 'Bón lót rải đều, xới nhẹ',
            worker: 'Nguyễn Văn A',
            isolationDays: '0',
        },
    },
    // ⑨ Tiêu hủy hóa chất — chưa có
    // ⑩ Chăm sóc hàng ngày
    {
        id: 'GACP-011',
        type: 'daily_care',
        plotId: 'P01',
        date: '2026-03-21',
        createdBy: 'U01',
        createdAt: '2026-03-21T06:00:00',
        note: 'Thời tiết nắng nhẹ, gió đông nam',
        data: {
            task: 'Tưới nước buổi sáng (20 lít/hàng), kiểm tra độ ẩm đất',
            worker: 'Nguyễn Văn A',
            weather: 'sunny',
        },
    },
    {
        id: 'GACP-012',
        type: 'daily_care',
        plotId: 'P01',
        date: '2026-03-22',
        createdBy: 'U02',
        createdAt: '2026-03-22T06:30:00',
        note: 'Mưa nhỏ buổi chiều, không cần tưới',
        data: { task: 'Nhổ cỏ dại quanh gốc, kiểm tra lá vàng', worker: 'Trần Văn B', weather: 'rainy' },
    },
    {
        id: 'GACP-013',
        type: 'daily_care',
        plotId: 'P01',
        date: '2026-03-23',
        createdBy: 'U01',
        createdAt: '2026-03-23T07:00:00',
        note: '',
        data: { task: 'Tưới nước, phun dung dịch EM pha loãng tỷ lệ 1:500', worker: 'Nguyễn Văn A', weather: 'cloudy' },
    },
    // ⑪ Sâu bệnh
    {
        id: 'GACP-014',
        type: 'pest_tracking',
        plotId: 'P01',
        date: '2026-03-22',
        createdBy: 'U02',
        createdAt: '2026-03-22T10:00:00',
        note: 'Phát hiện khi nhổ cỏ',
        data: {
            pestName: 'Rệp muội (Aphids)',
            severity: 'low',
            solution: 'Phun dung dịch tỏi + ớt pha loãng',
            postResult: 'Giảm 80% sau 3 ngày',
            monitor: 'Trần Văn B',
        },
    },
    // ⑫ Thu hoạch
    {
        id: 'GACP-015',
        type: 'harvest',
        plotId: 'P01',
        date: '2026-03-23',
        createdBy: 'U01',
        createdAt: '2026-03-23T08:00:00',
        note: 'Thu hoạch đợt thử lần 1',
        data: {
            lotCode: 'TH-IM-001',
            freshWeight: '120',
            morphology: 'Thân cây cao 40-60cm, lá xanh đậm, hoa tím nhạt, rễ khỏe',
            monitor: 'Nguyễn Văn A',
        },
    },
    // ⑬ Chất thải
    {
        id: 'GACP-016',
        type: 'waste_management',
        plotId: 'P01',
        date: '2026-03-23',
        createdBy: 'U01',
        createdAt: '2026-03-23T15:00:00',
        note: '',
        data: {
            wasteType: 'Thân lá dược liệu sau thu hoạch',
            wasteWeight: '30',
            treatmentMethod: 'Ủ compost tại chỗ',
            monitor: 'Nguyễn Văn A',
        },
    },
    // ⑭ Thiết bị
    {
        id: 'GACP-017',
        type: 'equipment_usage',
        plotId: 'P01',
        date: '2026-03-19',
        createdBy: 'U01',
        createdAt: '2026-03-19T07:00:00',
        note: '',
        data: {
            toolName: 'Máy xới đất mini Kubota',
            duration: '4 giờ',
            toolCondition: 'Hoạt động tốt, đã vệ sinh sau sử dụng',
            worker: 'Nguyễn Văn A',
            inspector: 'Trần Văn B',
        },
    },
    // ⑮ Sự cố
    {
        id: 'GACP-018',
        type: 'incident',
        plotId: 'P01',
        date: '2026-03-21',
        createdBy: 'U02',
        createdAt: '2026-03-21T16:00:00',
        note: 'Đã khắc phục trong ngày',
        data: {
            incident: 'Ống dẫn nước tưới bị vỡ đoạn giữa luống 3',
            cause: 'Ống cũ bị giòn do nắng',
            riskLevel: 'low',
            monitor: 'Trần Văn B',
        },
    },
];
