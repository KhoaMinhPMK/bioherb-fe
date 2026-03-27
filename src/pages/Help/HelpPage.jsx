import React from 'react';
import { HelpCircle, BookOpen, MessageCircle, Phone, Mail, ExternalLink } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import './HelpPage.scss';

const faqs = [
    {
        q: 'Làm sao để tạo mùa vụ mới?',
        a: 'Vào mục "Mùa vụ" trên sidebar, nhấn nút "Tạo mùa vụ", điền thông tin vùng trồng, cây trồng và thời gian.',
    },
    {
        q: 'Làm sao để ghi nhật ký sản xuất?',
        a: 'Vào mục "Nhật ký" trên sidebar, nhấn "Ghi nhật ký", chọn mùa vụ, công việc, thêm vật tư sử dụng và lưu lại.',
    },
    {
        q: 'Ai có quyền duyệt nhật ký?',
        a: 'Chỉ Admin và Chủ Farm (Farm Manager) mới có quyền duyệt hoặc từ chối nhật ký sản xuất.',
    },
    {
        q: 'Mã QR truy xuất nguồn gốc hoạt động như thế nào?',
        a: 'Mỗi lô hàng được gán một mã QR duy nhất. Quét QR sẽ hiển thị toàn bộ quy trình sản xuất từ gieo sạ đến đóng gói.',
    },
    {
        q: 'Tôi quên mật khẩu, làm sao?',
        a: 'Liên hệ Admin hệ thống để được reset mật khẩu, hoặc vào "Hồ sơ → Đổi mật khẩu" nếu bạn vẫn đăng nhập được.',
    },
    {
        q: 'Vật tư tồn kho hiển thị ở đâu?',
        a: 'Vào mục "Kho vật tư" để xem tồn kho, lịch sử nhập/xuất kho. Hoặc xem nhanh tại "Vật tư" trong sidebar.',
    },
    {
        q: 'Báo cáo có thể xuất file không?',
        a: 'Có. Vào trang "Báo cáo", nhấn nút "Xuất PDF" hoặc "Xuất Excel" để tải báo cáo.',
    },
    {
        q: 'Hệ thống hỗ trợ mấy loại vai trò?',
        a: '5 vai trò: Admin, Quản lý HTX, Chủ Farm, Duyệt viên, và Nhân viên. Mỗi vai trò có quyền truy cập khác nhau.',
    },
];

const HelpPage = () => {
    return (
        <div className="page-container">
            <PageHeader title="Hướng dẫn sử dụng" subtitle="Câu hỏi thường gặp và hỗ trợ" />

            <div className="help-page__grid">
                <div className="help-page__main">
                    <div className="card">
                        <div className="card__header">
                            <h3 className="font-semibold">
                                <HelpCircle size={16} /> Câu hỏi thường gặp
                            </h3>
                        </div>
                        <div className="card__body">
                            {faqs.map((faq) => (
                                <details key={faq.q} className="help-page__faq">
                                    <summary className="help-page__faq-q">{faq.q}</summary>
                                    <p className="help-page__faq-a">{faq.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="help-page__sidebar">
                    <div className="card">
                        <div className="card__header">
                            <h3 className="font-semibold">Liên hệ hỗ trợ</h3>
                        </div>
                        <div className="card__body help-page__contact">
                            <div className="help-page__contact-item">
                                <Phone size={16} />
                                <div>
                                    <span className="help-page__contact-label">Hotline</span>
                                    <span className="help-page__contact-value">1900 xxxx</span>
                                </div>
                            </div>
                            <div className="help-page__contact-item">
                                <Mail size={16} />
                                <div>
                                    <span className="help-page__contact-label">Email</span>
                                    <span className="help-page__contact-value">support@bioherb.vn</span>
                                </div>
                            </div>
                            <div className="help-page__contact-item">
                                <MessageCircle size={16} />
                                <div>
                                    <span className="help-page__contact-label">Zalo OA</span>
                                    <span className="help-page__contact-value">BioHerb Support</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card__header">
                            <h3 className="font-semibold">Tài liệu</h3>
                        </div>
                        <div className="card__body help-page__docs">
                            <button className="help-page__doc-link" type="button" onClick={(e) => e.preventDefault()}>
                                <BookOpen size={14} /> Hướng dẫn Admin
                            </button>
                            <button className="help-page__doc-link" type="button" onClick={(e) => e.preventDefault()}>
                                <BookOpen size={14} /> Hướng dẫn Farm Manager
                            </button>
                            <button className="help-page__doc-link" type="button" onClick={(e) => e.preventDefault()}>
                                <BookOpen size={14} /> Hướng dẫn Nhân viên
                            </button>
                            <button className="help-page__doc-link" type="button" onClick={(e) => e.preventDefault()}>
                                <ExternalLink size={14} /> Video hướng dẫn
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;
