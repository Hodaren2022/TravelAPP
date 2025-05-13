import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const PageName = styled.span`
  flex: 1;
`;

const ToggleButton = styled.button`
  background-color: ${props => props.$active ? '#1abc9c' : '#95a5a6'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.7 : 1};
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  margin-right: 0.5rem;
`;

// 定義可用頁面列表
const availablePages = [
  { id: 'tripManagement', name: '行程管理', path: '/', default: true },
  { id: 'dailyItinerary', name: '每日行程', path: '/daily', default: true },
  { id: 'hotelInfo', name: '旅館資訊', path: '/hotel', default: true },
  { id: 'travelTips', name: '旅遊須知', path: '/tips', default: true },
  { id: 'packingList', name: '物品清單', path: '/packing', default: true },
  { id: 'travelNotes', name: '旅遊筆記', path: '/notes', default: true },
  { id: 'expenseTracker', name: '消費追蹤', path: '/expenses', default: true },
  { id: 'dataManagement', name: '數據管理', path: '/data', default: true },
  { id: 'notes', name: '記事本', path: '/notebook', default: true },
  { id: 'settings', name: '設定', path: '/settings', default: true }
];

const Settings = () => {
  // 從localStorage獲取頁面顯示設定
  const [pageSettings, setPageSettings] = useState(() => {
    const savedSettings = localStorage.getItem('pageSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    } else {
      // 如果沒有保存的設定，使用默認值
      const defaultSettings = {};
      availablePages.forEach(page => {
        defaultSettings[page.id] = page.default;
      });
      return defaultSettings;
    }
  });
  
  // 創建一個臨時設定狀態，用於編輯
  const [tempSettings, setTempSettings] = useState({...pageSettings});

  // 當pageSettings變更時更新臨時設定
  useEffect(() => {
    setTempSettings({...pageSettings});
  }, [pageSettings]);

  // 處理頁面顯示設定變更
  const handlePageToggle = (pageId) => {
    // 行程管理頁面不能被隱藏，因為它是主頁
    if (pageId === 'tripManagement') return;
    // 設定頁面不能被隱藏，否則無法再次訪問設定
    if (pageId === 'settings') return;
    
    setTempSettings(prev => ({
      ...prev,
      [pageId]: !prev[pageId]
    }));
  };
  
  // 保存設定到localStorage
  const saveSettings = () => {
    localStorage.setItem('pageSettings', JSON.stringify(tempSettings));
    setPageSettings(tempSettings);
    
    // 觸發storage事件，讓App.jsx能夠接收到變更
    window.dispatchEvent(new Event('storage'));
    
    // 提示用戶刷新頁面以查看更新後的頁面
    alert('設定已保存！請刷新頁面以查看更新後的導航欄。');
  };

  // 重置所有設定為默認值
  const resetToDefaults = () => {
    const defaultSettings = {};
    availablePages.forEach(page => {
      defaultSettings[page.id] = page.default;
    });
    setTempSettings(defaultSettings);
  };

  return (
    <Container>
      <h2>應用設定</h2>
      
      <Card>
        <h3>頁面顯示設定</h3>
        <p>選擇要在導航欄中顯示的頁面：</p>
        
        {availablePages.map(page => (
          <SettingItem key={page.id}>
            <PageName>
              {page.name}
              {(page.id === 'tripManagement' || page.id === 'settings') && 
                <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '0.5rem' }}>
                  (必須顯示)
                </span>
              }
            </PageName>
            <ToggleButton
              $active={tempSettings[page.id]}
              $disabled={page.id === 'tripManagement' || page.id === 'settings'}
              onClick={() => handlePageToggle(page.id)}
            >
              {tempSettings[page.id] ? '顯示' : '隱藏'}
            </ToggleButton>
          </SettingItem>
        ))}
        
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button onClick={saveSettings}>保存應用</Button>
          <Button onClick={resetToDefaults}>重置為默認設定</Button>
        </div>
      </Card>
    </Container>
  );
};

export default Settings;