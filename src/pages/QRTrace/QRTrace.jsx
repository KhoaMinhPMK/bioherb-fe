import React from 'react';
import { useParams } from 'react-router-dom';
import { Layers, MapPin, Sprout, Calendar, Wheat, Shield } from 'lucide-react';
import './QRTrace.scss';
const QRTrace = () => {
    const { lotCode } = useParams();
    const mockData = {
        lotCode: lotCode || 'F01-VT01-2025HT-H01-P01',
        product: 'Gạo ST25',
        weight: '5kg',
        farm: 'Farm Long An',
        farmAddress: 'ấp 2, xã Tân Hòa, huyện Tân Thạnh, Long An',
        plot: 'Ruộng lúa ST25 (VT01)',
        plotArea: '2 ha',
        crop: 'Lúa ST25',
        season: '2025 Hè Thu',
        harvestDate: '25/10/2025',
        packDate: '01/11/2025',
        process: [
            { date: '01/06/2025', step: 'Gieo sạ', detail: 'Hạt giống ST25 chứng nhận' },
            { date: '25/06/2025', step: 'Bón lót', detail: '8 tấn phân hữu cơ' },
            { date: '25/07/2025', step: 'Bón phân', detail: '440kg Lân đỏ' },
            { date: '20/08/2025', step: 'Phun thuốc', detail: '600gr Sieubymsa 75WP - phòng đạo ôn' },
            { date: '25/10/2025', step: 'Thu hoạch', detail: 'Sản lượng: 8.5 tấn' },
            { date: '01/11/2025', step: 'Đóng gói', detail: 'Lô P01 - 2000 bao x 5kg' },
        ],
    };
    return (<div className="qr-trace">
            <div className="qr-trace__container">
                {/* Header */}
                <div className="qr-trace__header">
                    <div className="qr-trace__logo">
                        <Layers size={28}/>
                    </div>
                    <h1 className="qr-trace__title">Truy xuất nguồn gốc</h1>
                    <p className="qr-trace__subtitle">Thông tin sản phẩm minh bạch</p>
                </div>

                {/* Product Info */}
                <div className="qr-trace__product">
                    <h2 className="qr-trace__product-name">{mockData.product} ({mockData.weight})</h2>
                    <code className="qr-trace__lot-code">{mockData.lotCode}</code>
                </div>

                {/* Info Grid */}
                <div className="qr-trace__info-grid">
                    <div className="qr-trace__info-item">
                        <MapPin size={18}/>
                        <div><span className="qr-trace__info-label">Nông trại</span><span className="qr-trace__info-value">{mockData.farm}</span><span className="qr-trace__info-sub">{mockData.farmAddress}</span></div>
                    </div>
                    <div className="qr-trace__info-item">
                        <Sprout size={18}/>
                        <div><span className="qr-trace__info-label">Cây trồng</span><span className="qr-trace__info-value">{mockData.crop}</span></div>
                    </div>
                    <div className="qr-trace__info-item">
                        <Calendar size={18}/>
                        <div><span className="qr-trace__info-label">Mùa vụ</span><span className="qr-trace__info-value">{mockData.season}</span></div>
                    </div>
                    <div className="qr-trace__info-item">
                        <Wheat size={18}/>
                        <div><span className="qr-trace__info-label">Ngày thu hoạch</span><span className="qr-trace__info-value">{mockData.harvestDate}</span></div>
                    </div>
                </div>

                {/* Timeline */}
                <h3 className="qr-trace__section-title">Quy trình sản xuất</h3>
                <div className="qr-trace__timeline">
                    {mockData.process.map((step, i) => (<div key={i} className="qr-trace__timeline-item">
                            <div className="qr-trace__timeline-dot"/>
                            <div className="qr-trace__timeline-content">
                                <span className="qr-trace__timeline-date">{step.date}</span>
                                <span className="qr-trace__timeline-step">{step.step}</span>
                                <span className="qr-trace__timeline-detail">{step.detail}</span>
                            </div>
                        </div>))}
                </div>

                {/* Footer */}
                <div className="qr-trace__footer">
                    <Shield size={16}/>
                    <span>Thông tin được xác nhận bởi hệ thống FarmManager</span>
                </div>
            </div>
        </div>);
};
export default QRTrace;
