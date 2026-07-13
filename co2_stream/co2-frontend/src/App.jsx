import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import PfdLayout from './components/pfd-layout2';
import DashboardPage from './pages/DashboardPage';
import TransportPage from './pages/TransportPage';
import './App.css';

function App() {
  const [allData, setAllData] = useState({}); 
  const [histories, setHistories] = useState({}); 
  const [viewMode, setViewMode] = useState('HOME');

  // 웹소켓 데이터를 백그라운드에서 임시 저장할 참조 객체
  const latestDataRef = useRef({});

  useEffect(() => {
    const socket = io('/', { transports: ['websocket'] });

    // 초기 데이터 수신
    socket.on('init_data', (initialData) => {
      latestDataRef.current = initialData; 
      setAllData(initialData); 

      setHistories(prev => {
        const initialHistories = { ...prev };
        Object.keys(initialData).forEach(id => {
          if (initialData[id].is_online) {
            initialHistories[id] = [{ ...initialData[id], time: new Date().toLocaleTimeString() }];
          }
        });
        return initialHistories;
      });
    });

    // 실시간 개별 장비 데이터 수신
    socket.on('realtime_update', (deviceData) => {
      if (!deviceData || !deviceData.device_id) return;
      latestDataRef.current[deviceData.device_id] = deviceData;
    });

    // 1초 주기로 화면 렌더링 상태 업데이트
    const renderInterval = setInterval(() => {
      setAllData({ ...latestDataRef.current });

      setHistories(prev => {
        const newHistories = { ...prev };
        Object.keys(latestDataRef.current).forEach(id => {
          const deviceData = latestDataRef.current[id];
          if (deviceData.is_online) {
            const prevHistory = newHistories[id] || [];
            newHistories[id] = [...prevHistory, { ...deviceData, time: new Date().toLocaleTimeString() }].slice(-20);
          }
        });
        return newHistories;
      });
    }, 1000);

    // 컴포넌트 언마운트 시 소켓 및 타이머 정리
    return () => {
      socket.disconnect();
      clearInterval(renderInterval);
    };
  }, []);

  const deviceIds = Object.keys(allData).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  // 상태별 스타일 지정 함수
  const getStatusStyle = (status, isOnline) => {
    if (!isOnline) return { color: '#e74c3c', text: 'OFFLINE' }; 
    const s = status?.toLowerCase();
    if (s === 'operating' || s === 'normal') return { color: '#38A169', text: 'OPERATING' }; 
    if (s === 'warning') return { color: '#f1c40f', text: 'WARNING' }; 
    return { color: '#e74c3c', text: 'ERROR' }; 
  };

  return (
    <MainLayout viewMode={viewMode} setViewMode={setViewMode} deviceCount={deviceIds.length}>
      {viewMode === 'HOME' && (
        <HomePage deviceCount={deviceIds.length} allData={allData} setViewMode={setViewMode} />
      )}
      {viewMode === 'DASHBOARD' && (
        <DashboardPage deviceIds={deviceIds} allData={allData} histories={histories} getStatusStyle={getStatusStyle} />
      )}
      {viewMode === 'PFD' && (
        <PfdLayout allData={allData} />
      )}
      {viewMode === 'TRANSPORT' && (
        <TransportPage />
      )}
    </MainLayout>
  );
}

export default App;