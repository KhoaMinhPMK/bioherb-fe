import React, { useState, useMemo } from 'react';
import {
    LayoutDashboard,
    Calendar,
    Handshake,
    Building2,
    MapPin,
    Sprout,
    CalendarDays,
    BookOpen,
    Package,
    Warehouse,
    Bug,
    Wheat,
    Boxes,
    QrCode,
    BarChart3,
    Users,
    RotateCcw,
    Search,
    ToggleRight,
    ShieldCheck,
    Beaker,
    XCircle,
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import FilterBar from '../../components/FilterBar';
import { useFeatureFlags } from '../../contexts/FeatureFlagContext';
import { useToast } from '../../contexts/ToastContext';
import './FeatureFlags.scss';

const iconMap = {
    LayoutDashboard,
    Calendar,
    Handshake,
    Building2,
    MapPin,
    Sprout,
    CalendarDays,
    BookOpen,
    Package,
    Warehouse,
    Bug,
    Wheat,
    Boxes,
    QrCode,
    BarChart3,
    Users,
};

const roleLabels = {
    admin: 'Admin',
    htx_manager: 'QL HTX',
    farm_manager: 'Chủ Farm',
    approver: 'Duyệt viên',
    worker: 'Nhân viên',
};

const statusConfig = {
    enabled: { label: 'Bật', icon: ToggleRight, className: 'feature-flags__status--enabled' },
    beta: { label: 'Beta', icon: Beaker, className: 'feature-flags__status--beta' },
    disabled: { label: 'Tắt', icon: XCircle, className: 'feature-flags__status--disabled' },
};

const filterConfigs = [
    {
        key: 'group',
        label: 'Nhóm',
        options: [
            { value: 'Tổng quan', label: 'Tổng quan' },
            { value: 'Quản lý Farm', label: 'Quản lý Farm' },
            { value: 'Hoạt động', label: 'Hoạt động' },
            { value: 'Danh mục', label: 'Danh mục' },
            { value: 'Sản xuất', label: 'Sản xuất' },
            { value: 'Hệ thống', label: 'Hệ thống' },
        ],
    },
    {
        key: 'status',
        label: 'Trạng thái',
        options: [
            { value: 'enabled', label: 'Đang bật' },
            { value: 'beta', label: 'Beta' },
            { value: 'disabled', label: 'Đã tắt' },
        ],
    },
];

const FeatureFlags = () => {
    const { flags, cycleStatus, toggleFlagRole, resetFlags } = useFeatureFlags();
    const { addToast } = useToast();
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({});

    const filtered = useMemo(() => {
        let list = flags;
        if (search) {
            const s = search.toLowerCase();
            list = list.filter(
                (f) =>
                    f.label.toLowerCase().includes(s) ||
                    f.description.toLowerCase().includes(s) ||
                    f.key.toLowerCase().includes(s),
            );
        }
        if (filters.group) list = list.filter((f) => f.group === filters.group);
        if (filters.status) list = list.filter((f) => f.status === filters.status);
        return list;
    }, [flags, search, filters]);

    const grouped = useMemo(() => {
        const map = {};
        filtered.forEach((f) => {
            if (!map[f.group]) map[f.group] = [];
            map[f.group].push(f);
        });
        return map;
    }, [filtered]);

    const summary = useMemo(() => {
        const counts = { enabled: 0, beta: 0, disabled: 0 };
        flags.forEach((f) => {
            counts[f.status] = (counts[f.status] || 0) + 1;
        });
        return counts;
    }, [flags]);

    const handleReset = () => {
        resetFlags();
        addToast('Đã khôi phục tất cả về mặc định', 'success');
    };

    return (
        <div className="feature-flags">
            <PageHeader
                title="Quản lý tính năng"
                subtitle="Bật/tắt các module hiển thị cho từng vai trò người dùng"
                actions={
                    <button className="feature-flags__reset-btn" onClick={handleReset}>
                        <RotateCcw size={16} />
                        Khôi phục mặc định
                    </button>
                }
            />

            <div className="feature-flags__summary">
                <div className="feature-flags__summary-card feature-flags__summary-card--enabled">
                    <ToggleRight size={20} />
                    <span className="feature-flags__summary-count">{summary.enabled}</span>
                    <span className="feature-flags__summary-label">Đang bật</span>
                </div>
                <div className="feature-flags__summary-card feature-flags__summary-card--beta">
                    <Beaker size={20} />
                    <span className="feature-flags__summary-count">{summary.beta}</span>
                    <span className="feature-flags__summary-label">Beta</span>
                </div>
                <div className="feature-flags__summary-card feature-flags__summary-card--disabled">
                    <XCircle size={20} />
                    <span className="feature-flags__summary-count">{summary.disabled}</span>
                    <span className="feature-flags__summary-label">Đã tắt</span>
                </div>
            </div>

            <FilterBar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Tìm tính năng..."
                filters={filterConfigs}
                filterValues={filters}
                onFilterChange={setFilters}
            />

            <div className="feature-flags__groups">
                {Object.entries(grouped).map(([groupName, groupFlags]) => (
                    <div key={groupName} className="feature-flags__group">
                        <h3 className="feature-flags__group-title">{groupName}</h3>
                        <div className="feature-flags__cards">
                            {groupFlags.map((flag) => {
                                const Icon = iconMap[flag.icon] || LayoutDashboard;
                                const statusCfg = statusConfig[flag.status];
                                const StatusIcon = statusCfg.icon;

                                return (
                                    <div
                                        key={flag.key}
                                        className={`feature-flags__card ${flag.status === 'disabled' ? 'feature-flags__card--disabled' : ''}`}
                                    >
                                        <div className="feature-flags__card-header">
                                            <div className="feature-flags__card-info">
                                                <Icon size={20} className="feature-flags__card-icon" />
                                                <div>
                                                    <h4 className="feature-flags__card-title">
                                                        {flag.label}
                                                        {flag.protected && (
                                                            <ShieldCheck
                                                                size={14}
                                                                className="feature-flags__protected-icon"
                                                                title="Tính năng hệ thống, không thể tắt"
                                                            />
                                                        )}
                                                    </h4>
                                                    <p className="feature-flags__card-desc">{flag.description}</p>
                                                </div>
                                            </div>
                                            <button
                                                className={`feature-flags__status-btn ${statusCfg.className}`}
                                                onClick={() => cycleStatus(flag.key)}
                                                disabled={flag.protected}
                                                title={
                                                    flag.protected
                                                        ? 'Tính năng hệ thống, không thể tắt'
                                                        : `Chuyển trạng thái (hiện: ${statusCfg.label})`
                                                }
                                            >
                                                <StatusIcon size={16} />
                                                {statusCfg.label}
                                            </button>
                                        </div>

                                        <div className="feature-flags__roles">
                                            <span className="feature-flags__roles-label">Vai trò:</span>
                                            <div className="feature-flags__roles-grid">
                                                {Object.entries(roleLabels).map(([roleKey, roleLabel]) => (
                                                    <label
                                                        key={roleKey}
                                                        className={`feature-flags__role-check ${flag.status === 'disabled' ? 'feature-flags__role-check--disabled' : ''}`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={!!flag.roles[roleKey]}
                                                            onChange={() => toggleFlagRole(flag.key, roleKey)}
                                                            disabled={flag.status === 'disabled'}
                                                        />
                                                        <span className="feature-flags__role-label">{roleLabel}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="feature-flags__card-footer">Cập nhật: {flag.updatedAt}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {Object.keys(grouped).length === 0 && (
                    <div className="feature-flags__empty">
                        <Search size={40} />
                        <p>Không tìm thấy tính năng phù hợp</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeatureFlags;
