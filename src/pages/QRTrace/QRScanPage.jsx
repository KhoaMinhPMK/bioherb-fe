import React, { useState, useCallback } from 'react';
import { Search, QrCode, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import './QRScan.scss';

const QRScanPage = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { harvestBatches } = useData();
    const [code, setCode] = useState('');
    const [scanning, setScanning] = useState(false);

    const handleSearch = useCallback(() => {
        if (!code.trim()) {
            addToast('Nhập mã lô hàng', 'error');
            return;
        }
        const batch = harvestBatches.find((b) => b.lotCode === code.trim());
        if (batch) {
            navigate(`/qr/${code.trim()}`);
        } else {
            addToast('Không tìm thấy lô hàng với mã này', 'error');
        }
    }, [code, harvestBatches, navigate, addToast]);

    const handleScan = useCallback(() => {
        setScanning(true);
        setTimeout(() => {
            setScanning(false);
            if (harvestBatches.length > 0) {
                const randomBatch = harvestBatches[Math.floor(Math.random() * harvestBatches.length)];
                setCode(randomBatch.lotCode);
                addToast(`Đã quét: ${randomBatch.lotCode}`, 'success');
            }
        }, 2000);
    }, [harvestBatches, addToast]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Enter') handleSearch();
        },
        [handleSearch],
    );

    return (
        <div className="page-container">
            <PageHeader title="Tra cứu QR" subtitle="Nhập mã hoặc quét QR để truy xuất nguồn gốc" />

            <div className="qr-scan__container">
                <div className="card qr-scan__card">
                    <div className="qr-scan__icon">
                        <QrCode size={48} />
                    </div>
                    <h2 className="qr-scan__title">Truy xuất nguồn gốc sản phẩm</h2>
                    <p className="qr-scan__desc">
                        Nhập mã lô hàng hoặc quét mã QR trên bao bì để xem thông tin chi tiết
                    </p>

                    <div className="qr-scan__input-group">
                        <input
                            className="qr-scan__input"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập mã lô hàng... VD: F01-VT01-2025HT-H01-P01"
                        />
                        <button className="btn btn--primary qr-scan__search-btn" onClick={handleSearch}>
                            <Search size={16} /> Tra cứu
                        </button>
                    </div>

                    <div className="qr-scan__divider">
                        <span>hoặc</span>
                    </div>

                    <button className="btn btn--outline qr-scan__scan-btn" onClick={handleScan} disabled={scanning}>
                        <Camera size={18} /> {scanning ? 'Đang quét...' : 'Quét mã QR'}
                    </button>

                    {scanning && (
                        <div className="qr-scan__scanning">
                            <div className="qr-scan__scanning-box">
                                <div className="qr-scan__scanning-line" />
                            </div>
                            <p>Đang quét mã QR...</p>
                        </div>
                    )}
                </div>

                {harvestBatches.length > 0 && (
                    <div className="card qr-scan__recent">
                        <div className="card__header">
                            <h3 className="font-semibold">Mã lô có sẵn</h3>
                        </div>
                        <div className="card__body">
                            <div className="qr-scan__codes">
                                {harvestBatches.slice(0, 6).map((b) => (
                                    <button
                                        key={b.id}
                                        className="qr-scan__code-chip"
                                        onClick={() => {
                                            setCode(b.lotCode);
                                            navigate(`/qr/${b.lotCode}`);
                                        }}
                                    >
                                        <QrCode size={12} /> {b.lotCode}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QRScanPage;
