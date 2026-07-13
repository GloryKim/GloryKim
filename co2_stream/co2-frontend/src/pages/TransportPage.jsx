import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, AlertTriangle, CheckCircle, Navigation, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 컴포넌트 등장 애니메이션 설정
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function TransportPage() {
  // =========================================================================
  //  [API 명세 초안] 향후 백엔드에서 받아야 할 이송 데이터 구조 (더미 데이터)
  // =========================================================================
  const [pipelineData, setPipelineData] = useState([]);
  
  // 시뮬레이션: 컴포넌트 마운트 시 더미 데이터 로드
  useEffect(() => {
    const mockTrendData = [
      { time: '10:00', pressure: 15.2, flow: 450, temp: -20 },
      { time: '10:10', pressure: 15.1, flow: 455, temp: -19 },
      { time: '10:20', pressure: 14.8, flow: 440, temp: -21 },
      { time: '10:30', pressure: 15.0, flow: 460, temp: -20 },
      { time: '10:40', pressure: 15.3, flow: 470, temp: -18 },
      { time: '10:50', pressure: 15.5, flow: 480, temp: -19 },
    ];
    setPipelineData(mockTrendData);
  }, []);

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      style={{ display: 'flex', flexDirection: 'column', gap: '25px', padding: '10px' }}
    >
      {/* 1. 페이지 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '10px', borderRadius: '10px' }}>
            <Truck size={28} color="#3b82f6" />
          </div>
          <div>
            <h2 style={{ color: '#f8fafc', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>CO2 이송 관리 모니터링</h2>
            <p style={{ color: '#94a3b8', margin: '5px 0 0 0', fontSize: '13px' }}>액화 탄소 배관망 및 차량 운송 상태 실시간 감시 (Prototype)</p>
          </div>
        </div>
        <button style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <Settings size={16} /> 설정
        </button>
      </div>

      {/* 2. 핵심 지표 (KPI) 카드 영역 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <motion.div variants={itemVariants} style={{ background: '#1e293b', padding: '25px', borderRadius: '15px', border: '1px solid #334155', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.05 }}><Navigation size={100} color="#3b82f6" /></div>
          <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>주배관 (PL-01) 압력</div>
          <div style={{ fontSize: '32px', color: '#3b82f6', fontWeight: 'bold' }}>15.5 <span style={{fontSize: '14px', color: '#64748b'}}>bar</span></div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '10px' }}>▲ 0.2 bar (전시간 대비)</div>
        </motion.div>

        <motion.div variants={itemVariants} style={{ background: '#1e293b', padding: '25px', borderRadius: '15px', border: '1px solid #334155' }}>
          <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>실시간 이송 유량</div>
          <div style={{ fontSize: '32px', color: '#10b981', fontWeight: 'bold' }}>480 <span style={{fontSize: '14px', color: '#64748b'}}>kg/h</span></div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '10px' }}>▲ 10 kg/h (전시간 대비)</div>
        </motion.div>

        <motion.div variants={itemVariants} style={{ background: '#1e293b', padding: '25px', borderRadius: '15px', border: '1px solid #334155' }}>
          <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>액화 CO2 온도</div>
          <div style={{ fontSize: '32px', color: '#f8fafc', fontWeight: 'bold' }}>-19.0 <span style={{fontSize: '14px', color: '#64748b'}}>°C</span></div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>안정 범위 (-18 ~ -22°C)</div>
        </motion.div>

        <motion.div variants={itemVariants} style={{ background: '#0f172a', padding: '25px', borderRadius: '15px', border: '1px solid #10b981', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '10px' }}>전체 네트워크 상태</div>
          <div style={{ fontSize: '20px', color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={24} /> 정상 가동 중
          </div>
        </motion.div>
      </div>

      {/* 3. 시계열 트렌드 차트 및 알림 로그 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* 배관 압력 및 유량 차트 */}
        <motion.div variants={itemVariants} style={{ background: '#1e293b', padding: '25px', borderRadius: '15px', border: '1px solid #334155', height: '400px' }}>
          <h3 style={{ color: '#f8fafc', margin: '0 0 25px 0', fontSize: '16px' }}>배관망 압력 및 유량 통합 트렌드</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={pipelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 12}} />
              {/* 왼쪽 Y축: 압력 */}
              <YAxis yAxisId="left" stroke="#3b82f6" domain={[14, 16]} tick={{fontSize: 12}} />
              {/* 오른쪽 Y축: 유량 */}
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" domain={[400, 500]} tick={{fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} 
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Line yAxisId="left" type="monotone" dataKey="pressure" name="압력 (Bar)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#1e293b', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line yAxisId="right" type="monotone" dataKey="flow" name="유량 (kg/h)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#1e293b', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 설비 이상 알림 로그 */}
        <motion.div variants={itemVariants} style={{ background: '#1e293b', padding: '25px', borderRadius: '15px', border: '1px solid #334155', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: '#f8fafc', margin: '0 0 20px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#f59e0b" /> 시스템 이벤트 로그
          </h3>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '5px' }}>
            
            <div style={{ background: '#0f172a', padding: '15px', borderRadius: '10px', borderLeft: '3px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>SYSTEM</span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>10:52:14</span>
              </div>
              <div style={{ fontSize: '13px', color: '#cbd5e1' }}>A지점 밸브 개방 및 액화 탄소 이송 개시</div>
            </div>

            <div style={{ background: '#0f172a', padding: '15px', borderRadius: '10px', borderLeft: '3px solid #f59e0b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold' }}>WARNING</span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>10:35:22</span>
              </div>
              <div style={{ fontSize: '13px', color: '#cbd5e1' }}>PL-01 구간 압력 일시적 강하 감지 (14.8 Bar)</div>
            </div>

            <div style={{ background: '#0f172a', padding: '15px', borderRadius: '10px', borderLeft: '3px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>SYSTEM</span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>10:00:00</span>
              </div>
              <div style={{ fontSize: '13px', color: '#cbd5e1' }}>이송 펌프 P-101 정상 기동 확인</div>
            </div>

          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}