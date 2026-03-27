import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layers, MapPin, Sprout, Calendar, Wheat, Shield, AlertTriangle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import './QRTrace.scss';

const QRTrace = () => {
    const { lotCode } = useParams();
    const { harvestBatches, plots, farms, cropCycles, taskLogs } = useData();

    const batch = useMemo(() => {
        if (!lotCode) return harvestBatches[0] || null;
        return harvestBatches.find((b) => b.lotCode === lotCode) || null;
    }, [lotCode, harvestBatches]);

    const plot = useMemo(() => (batch ? plots.find((p) => p.id === batch.plotId) : null), [batch, plots]);
    const farm = useMemo(() => (plot ? farms.find((f) => f.id === plot.farmId) : null), [plot, farms]);
    const cycle = useMemo(() => (batch ? cropCycles.find((c) => c.id === batch.cycleId) : null), [batch, cropCycles]);
    const relatedLogs = useMemo(() => {
        if (!batch) return [];
        return taskLogs
            .filter((l) => l.plotId === batch.plotId || l.cycleId === batch.cycleId)
            .sort((a, b) => (a.date > b.date ? 1 : -1));
    }, [batch, taskLogs]);

    if (!batch) {
        return (
            <div className="qr-trace">
                <div className="qr-trace__container">
                    <div className="qr-trace__header">
                        <AlertTriangle size={40} />
                        <h1 className="qr-trace__title">Không tìm thấy</h1>
                        <p className="qr-trace__subtitle">
                            Mã lô hàng <code>{lotCode}</code> không tồn tại trong hệ thống.
                        </p>
                    </div>
                    <div className="qr-trace__footer">
                        <Link to="/" className="btn btn--primary">
                            Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="qr-trace">
            <div className="qr-trace__container">
                {/* Header */}
                <div className="qr-trace__header">
                    <div className="qr-trace__logo">
                        <Layers size={28} />
                    </div>
                    <h1 className="qr-trace__title">Truy xuất nguồn gốc</h1>
                    <p className="qr-trace__subtitle">Thông tin sản phẩm minh bạch</p>
                </div>

                {/* Product Info */}
                <div className="qr-trace__product">
                    <h2 className="qr-trace__product-name">
                        {cycle?.crop || 'Sản phẩm'} — {batch.quantityKg ? `${batch.quantityKg} kg` : ''}
                    </h2>
                    <code className="qr-trace__lot-code">{batch.lotCode}</code>
                </div>

                {/* Info Grid */}
                <div className="qr-trace__info-grid">
                    <div className="qr-trace__info-item">
                        <MapPin size={18} />
                        <div>
                            <span className="qr-trace__info-label">Nông trại</span>
                            <span className="qr-trace__info-value">{farm?.name || '—'}</span>
                            <span className="qr-trace__info-sub">{farm?.address || ''}</span>
                        </div>
                    </div>
                    <div className="qr-trace__info-item">
                        <Sprout size={18} />
                        <div>
                            <span className="qr-trace__info-label">Vùng trồng</span>
                            <span className="qr-trace__info-value">{plot?.name || '—'}</span>
                            <span className="qr-trace__info-sub">{plot?.area ? `${plot.area} ha` : ''}</span>
                        </div>
                    </div>
                    <div className="qr-trace__info-item">
                        <Calendar size={18} />
                        <div>
                            <span className="qr-trace__info-label">Mùa vụ</span>
                            <span className="qr-trace__info-value">{cycle?.id || '—'}</span>
                        </div>
                    </div>
                    <div className="qr-trace__info-item">
                        <Wheat size={18} />
                        <div>
                            <span className="qr-trace__info-label">Ngày thu hoạch</span>
                            <span className="qr-trace__info-value">{batch.harvestDate || '—'}</span>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <h3 className="qr-trace__section-title">Nhật ký sản xuất ({relatedLogs.length} bản ghi)</h3>
                <div className="qr-trace__timeline">
                    {relatedLogs.length === 0 && <p className="qr-trace__empty">Chưa có nhật ký liên kết</p>}
                    {relatedLogs.map((log) => (
                        <div key={log.id} className="qr-trace__timeline-item">
                            <div className="qr-trace__timeline-dot" />
                            <div className="qr-trace__timeline-content">
                                <span className="qr-trace__timeline-date">{log.date}</span>
                                <span className="qr-trace__timeline-step">{log.task}</span>
                                <span className="qr-trace__timeline-detail">
                                    {log.workerName} {log.material ? `— ${log.material}` : ''}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="qr-trace__footer">
                    <Shield size={16} />
                    <span>Thông tin được xác nhận bởi hệ thống BioHerb</span>
                </div>
            </div>
        </div>
    );
};

export default QRTrace;
