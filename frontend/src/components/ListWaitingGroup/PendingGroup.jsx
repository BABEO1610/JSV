import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import './PendingGroup.css';

const PendingGroups = () => {
  const [groups, setGroups] = useState([]);

  // 1. Lấy dữ liệu khi mở trang (Giữ nguyên)
  useEffect(() => {
    axios.get('http://localhost:3001/api/pending-activities')
      .then(response => {
        setGroups(response.data);
      })
      .catch(error => console.error("Lỗi:", error));
  }, []); 

  // 2. HÀM MỚI: Xử lý khi bấm nút "Hủy chờ"
  const handleCancel = (id) => {
    // Hỏi lại cho chắc chắn (Tùy chọn)
    if (!window.confirm("Bạn có chắc muốn hủy duyệt hoạt động này?")) return;

    // Gọi API xóa
    axios.delete(`http://localhost:3001/api/pending-activities/${id}`)
      .then(() => {
        // Nếu Backend báo thành công -> Xóa nhóm đó khỏi giao diện React
        setGroups(groups.filter(group => group.id !== id));
      })
      .catch(error => console.error("Lỗi khi xóa:", error));
  };

  return (
    <div className="pending_container">
      <h4 className="pending_title">Danh sách các nhóm đang chờ duyệt</h4>
      
      {groups.length === 0 ? (
        <p style={{ fontSize: '13px', color: '#777', textAlign: 'center' }}>
          Không có hoạt động nào đang chờ duyệt.
        </p>
      ) : (
        groups.map(group => (
          <div key={group.id} className="pending_item">
            <div className="pending_avatar" />
            <div className="pending_name_wrapper">
              <span className="pending_name_text">{group.name}</span>
            </div>
            {/* 3. Gắn hàm handleCancel vào sự kiện onClick */}
            <button 
              className="pending_btn_cancel" 
              onClick={() => handleCancel(group.id)}
            >
              Hủy chờ
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default PendingGroups;