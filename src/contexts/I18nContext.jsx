import React, { createContext, useContext, useState, useCallback } from 'react';

const translations = {
    vi: {
        // Common
        'common.search': 'Tìm kiếm...',
        'common.add': 'Thêm',
        'common.save': 'Lưu',
        'common.cancel': 'Huỷ',
        'common.delete': 'Xoá',
        'common.edit': 'Sửa',
        'common.status': 'Trạng thái',
        'common.date': 'Ngày',
        'common.actions': 'Thao tác',
        'common.approved': 'Đã duyệt',
        'common.pending': 'Chờ duyệt',
        'common.draft': 'Nháp',
        'common.rejected': 'Từ chối',
        'common.loading': 'Đang tải...',

        // Sidebar
        'sidebar.overview': 'TỔNG QUAN',
        'sidebar.dashboard': 'Dashboard',
        'sidebar.farm_mgmt': 'QUẢN LÝ FARM',
        'sidebar.farm': 'Farm',
        'sidebar.plots': 'Vùng trồng',
        'sidebar.cycles': 'Mùa vụ',
        'sidebar.operations': 'HOẠT ĐỘNG',
        'sidebar.plans': 'Kế hoạch',
        'sidebar.journal': 'Nhật ký',
        'sidebar.catalog': 'DANH MỤC',
        'sidebar.inputs': 'Vật tư',
        'sidebar.workers': 'Nhân công & Thiết bị',
        'sidebar.production': 'SẢN XUẤT',
        'sidebar.pests': 'Sâu bệnh',
        'sidebar.harvests': 'Thu hoạch',
        'sidebar.system': 'HỆ THỐNG',
        'sidebar.reports': 'Báo cáo',
        'sidebar.qr': 'Truy xuất QR',
        'sidebar.admin': 'Quản trị',
        'sidebar.admin_dashboard': 'Dashboard Admin',

        // Dashboard KPIs
        'dashboard.title': 'Tổng quan hoạt động',
        'dashboard.total_plots': 'Tổng vùng trồng',
        'dashboard.active_plots': '% VT hoạt động',
        'dashboard.valid_attendance': '% Ngày công hợp lệ',
        'dashboard.pending_approvals': 'Chờ duyệt',

        // Admin Dashboard
        'admin_dashboard.title': 'Dashboard Giám Sát Hệ Thống',
        'admin_dashboard.subtitle': 'Tổng quan toàn bộ hợp tác xã — cấp Sankit Admin',
        'admin_dashboard.htx_active': 'HTX hoạt động',
        'admin_dashboard.farms_active': 'Farm đang sản xuất',
        'admin_dashboard.plots_warning': 'VT cảnh báo',
        'admin_dashboard.journal_completion': '% hoàn thành nhật ký',
        'admin_dashboard.pending_data': 'Dữ liệu chờ duyệt',

        // Attendance
        'attendance.title': 'Chấm công',
        'attendance.full': 'Đủ công',
        'attendance.partial': 'Thiếu công',
        'attendance.exception': 'Rời sớm',
        'attendance.morning': 'Sáng',
        'attendance.afternoon': 'Trưa',
        'attendance.evening': 'Chiều',

        // Plan
        'plan.title': 'Kế hoạch sản xuất',
        'plan.subtitle': 'Timeline công việc theo buổi — đối chiếu thực hiện',
        'plan.planned': 'Theo KH',
        'plan.unplanned': 'Phát sinh',
        'plan.deviation_minor': 'Lệch nhẹ',
        'plan.deviation_major': 'Trễ nghiêm trọng',
    },
    en: {
        // Common
        'common.search': 'Search...',
        'common.add': 'Add',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.status': 'Status',
        'common.date': 'Date',
        'common.actions': 'Actions',
        'common.approved': 'Approved',
        'common.pending': 'Pending',
        'common.draft': 'Draft',
        'common.rejected': 'Rejected',
        'common.loading': 'Loading...',

        // Sidebar
        'sidebar.overview': 'OVERVIEW',
        'sidebar.dashboard': 'Dashboard',
        'sidebar.farm_mgmt': 'FARM MANAGEMENT',
        'sidebar.farm': 'Farm',
        'sidebar.plots': 'Plots',
        'sidebar.cycles': 'Crop Cycles',
        'sidebar.operations': 'OPERATIONS',
        'sidebar.plans': 'Plans',
        'sidebar.journal': 'Journal',
        'sidebar.catalog': 'CATALOG',
        'sidebar.inputs': 'Inputs',
        'sidebar.workers': 'Workers & Equipment',
        'sidebar.production': 'PRODUCTION',
        'sidebar.pests': 'Pest Control',
        'sidebar.harvests': 'Harvest',
        'sidebar.system': 'SYSTEM',
        'sidebar.reports': 'Reports',
        'sidebar.qr': 'QR Traceability',
        'sidebar.admin': 'Admin',
        'sidebar.admin_dashboard': 'Admin Dashboard',

        // Dashboard KPIs
        'dashboard.title': 'Operations Overview',
        'dashboard.total_plots': 'Total Plots',
        'dashboard.active_plots': '% Active Plots',
        'dashboard.valid_attendance': '% Valid Attendance',
        'dashboard.pending_approvals': 'Pending Approvals',

        // Admin Dashboard
        'admin_dashboard.title': 'System Monitoring Dashboard',
        'admin_dashboard.subtitle': 'Full cooperative overview — Sankit Admin level',
        'admin_dashboard.htx_active': 'Active Cooperatives',
        'admin_dashboard.farms_active': 'Active Farms',
        'admin_dashboard.plots_warning': 'Plots with Alerts',
        'admin_dashboard.journal_completion': '% Journal Completion',
        'admin_dashboard.pending_data': 'Pending Data',

        // Attendance
        'attendance.title': 'Attendance',
        'attendance.full': 'Full day',
        'attendance.partial': 'Partial',
        'attendance.exception': 'Early leave',
        'attendance.morning': 'Morning',
        'attendance.afternoon': 'Afternoon',
        'attendance.evening': 'Evening',

        // Plan
        'plan.title': 'Production Plan',
        'plan.subtitle': 'Shift-based timeline — plan vs actual comparison',
        'plan.planned': 'As Planned',
        'plan.unplanned': 'Unplanned',
        'plan.deviation_minor': 'Minor Deviation',
        'plan.deviation_major': 'Major Delay',
    },
};

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
    const [locale, setLocale] = useState('vi');

    const t = useCallback(
        (key) => {
            return translations[locale]?.[key] || translations.vi[key] || key;
        },
        [locale]
    );

    const toggleLocale = useCallback(() => {
        setLocale((prev) => (prev === 'vi' ? 'en' : 'vi'));
    }, []);

    return (
        <I18nContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = () => {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error('useI18n must be inside I18nProvider');
    return ctx;
};

export default I18nContext;
