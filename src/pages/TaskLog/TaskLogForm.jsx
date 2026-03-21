import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Dropdown from '../../components/Dropdown';
import { useToast } from '../../contexts/ToastContext';
import './TaskLog.scss';
const TaskLogForm = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();

    const handleSave = () => {
        addToast('Đã lưu nhật ký thành công', 'success');
        navigate('/task-logs');
    };

    return (<div className="page-container">
            <PageHeader title="Ghi nhật ký sản xuất" subtitle="Nhập chi tiết công việc thực tế" actions={<>
                        <button className="btn-icon" onClick={() => navigate('/task-logs')} aria-label="Quay lại">
                            <ArrowLeft size={20}/>
                        </button>
                        <button className="btn btn--primary" onClick={handleSave}><Save size={16}/> Lưu nhật ký</button>
                    </>}/>

            <div className="card">
                <div className="card__body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label" htmlFor="cycle">Mùa vụ *</label>
                            <Dropdown options={[ { value: '1', label: '2026-DX - Lúa ST25' }, { value: '2', label: '2026-XH - Cà chua' } ]} placeholder="Chọn mùa vụ..."/>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="date">Ngày làm việc *</label>
                            <input id="date" type="date" className="form-input"/>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="task">Công việc *</label>
                            <Dropdown options={[ { value: 'cyd', label: 'Cày xới đất' }, { value: 'bl', label: 'Bón lót' }, { value: 'gs', label: 'Gieo sạ' }, { value: 'bp', label: 'Bón phân' }, { value: 'pt', label: 'Phun thuốc' }, { value: 'th', label: 'Thu hoạch' } ]} placeholder="Chọn công việc..."/>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="startTime">Thời gian bắt đầu</label>
                            <input id="startTime" type="time" className="form-input"/>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="endTime">Thời gian kết thúc</label>
                            <input id="endTime" type="time" className="form-input"/>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="breakHours">Nghỉ (giờ)</label>
                            <input id="breakHours" type="number" className="form-input" placeholder="0"/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card task-log-form__section">
                <div className="card__header"><h3 className="font-semibold">Vật tư sử dụng</h3></div>
                <div className="card__body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label" htmlFor="supplyType">Loại vật tư</label>
                            <Dropdown options={[ { value: 'pb', label: 'Phân bón' }, { value: 'nd', label: 'Nông dược' }, { value: 'nvl', label: 'Nguyên vật liệu' } ]} placeholder="Chọn loại..."/>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="supplyName">Tên vật tư</label>
                            <Dropdown options={[]} placeholder="Chọn vật tư..."/>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="supplyQty">Số lượng</label>
                            <input id="supplyQty" type="number" className="form-input" placeholder="0"/>
                        </div>
                    </div>
                    <button className="btn btn--outline task-log-form__add-btn" onClick={() => addToast('Vui lòng chọn loại và tên vật tư trước khi thêm', 'error')}>+ Thêm vật tư</button>
                </div>
            </div>

            <div className="card task-log-form__section">
                <div className="card__header"><h3 className="font-semibold">Nhân công</h3></div>
                <div className="card__body">
                    <div className="task-log-form__workers">
                        {['Nguyễn An', 'Trần Văn Tài', 'Nguyễn Văn Phương', 'Lê Thị Cúc'].map(w => (<label key={w} className="task-log-form__worker-chip">
                                <input type="checkbox" className="task-log-form__worker-checkbox"/> {w}
                            </label>))}
                    </div>
                </div>
            </div>

            <div className="card task-log-form__section">
                <div className="card__header"><h3 className="font-semibold">Thiết bị & Ghi chú</h3></div>
                <div className="card__body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label" htmlFor="equipment">Thiết bị</label>
                            <Dropdown options={[ { value: 'none', label: 'Không sử dụng' }, { value: 'mc', label: 'Máy cày' }, { value: 'mgl', label: 'Máy gặt lúa' } ]} placeholder="Chọn thiết bị..."/>
                        </div>
                        <div className="form-group task-log-form__notes">
                            <label className="form-label" htmlFor="notes">Ghi chú</label>
                            <textarea id="notes" className="form-textarea" rows={3} placeholder="Ghi chú thêm..."/>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
};
export default TaskLogForm;
