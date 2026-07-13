import React from 'react';
import { motion, AnimatePresence } from 'react';
import { X, FileText, AlertTriangle, Cpu, CheckCircle } from 'lucide-react';

export default function DetailDrawer({ isOpen, onClose, deviceId, deviceData }) {
  if (!deviceData) return null;

  const calcEff = deviceData.input_ppm > 0 
    ? ((deviceData.input_ppm - deviceData.output_ppm) / deviceData.input_ppm * 100) 
    : 0;

  // 가상의 에러 로그 리스트 생성 (시뮬레이션용)
  const fakeLogs = [
    { time: '10:39:12', level: 'NORMAL', msg: '흡수탑 순환 펌프 정상 기동 및 압력 동기화 완료' },
    { time: '10:35:45', level: 'WARNING', msg: `출력 CO2 농도 상승 경보 (기준치 초과: ${deviceData.output_ppm?.toLocaleString()} ppm)` },
    { time: '10:12:03', level: 'NORMAL', msg: '열교환기 H/X 온도 보정 완료 (안정화 상태)' },
    { time: '09:45:11', level: 'ERROR', msg: '유입 유량 일시 저하 감지 (Blower 가동 가속 조치 완료)' }
  ];

  // PDF 보고서 다운로드 시뮬레이션 이벤트
  const handlePdfDownload = () => {
    const btn = document.getElementById('pdf-download-btn');
    if (btn) {
      btn.innerHTML = '⚡ 보고서 생성 중...';
      setTimeout(() => {
        btn.innerHTML = '⏳ PDF 디지털 서명 날인 중...';
        setTimeout(() => {
          btn.innerHTML = '📥 다운로드 완료 (ABS-Report.pdf)';
          // 가상의 성공 로그
          setTimeout(() => {
            btn.innerHTML = '📄 탄소배출 평가 보고서 (PDF) 다운로드';
          }, 2000);
        }, 1200);
      }, 1000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 백드롭 흐림 효과 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1999
            }}
          />

          {/* 우측 슬라이드 인 패널 */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            style={{
              position: 'fixed', right: 0, top: 0, width: '460px', height: '100vh',
              background: '#1e293b', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
              zIndex: 2000, display: 'flex', flexDirection: 'column',
              borderLeft: '1px solid #334155', color: '#f8fafc'
            }}
          >
            {/* 드로어 헤더 */}
            <div style={{ padding: '25px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Device Analysis</span>
                <h3 style={{ margin: '5px 0 0 0', fontSize: '20px', fontWeight: 'bold' }}>{deviceId} 상세 리포트</h3>
              </div>
              <button 
                onClick={onClose} 
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '5px', borderRadius: '5px', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.target.style.background = '#334155'}
                onMouseLeave={(e) => e.target.style.background = 'none'}
              >
                <X size={20} />
              </button>
            </div>

            {/* 드로어 컨텐츠 */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '25px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
              
              {/* 장비 스펙 개요 */}
              <section style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={16} /> 장비 물리 제원
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '13px' }}>
                  <div>설비 타입 : <strong style={{color: '#cbd5e1'}}>습식 CO2 포집탑</strong></div>
                  <div>반응 흡수제 : <strong style={{color: '#cbd5e1'}}>아민계 수용액 (MEA)</strong></div>
                  <div>유입 유량 범위 : <strong style={{color: '#cbd5e1'}}>2,000 ~ 3,000 m³/h</strong></div>
                  <div>가동 시간 : <strong style={{color: '#cbd5e1'}}>{deviceData.runtime} s</strong></div>
                </div>
              </section>

              {/* 실시간 효율 지표 상세 */}
              <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>탄소 저감 효율 요약</h4>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1, background: '#0f172a', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>유입 농도</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '5px' }}>{deviceData.input_ppm?.toLocaleString()} <small style={{fontSize: '10px'}}>ppm</small></div>
                  </div>
                  <div style={{ flex: 1, background: '#0f172a', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>배출 농도</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '5px', color: '#38bdf8' }}>{deviceData.output_ppm?.toLocaleString()} <small style={{fontSize: '10px'}}>ppm</small></div>
                  </div>
                  <div style={{ flex: 1, background: '#0f172a', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>포집 효율</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '5px', color: '#34d399' }}>{calcEff.toFixed(1)}%</div>
                  </div>
                </div>
              </section>

              {/* 실시간 에러 및 장치 로그 */}
              <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>실시간 시스템 이벤트 로그</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                  {fakeLogs.map((log, index) => (
                    <div key={index} style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', borderLeft: `4px solid ${log.level === 'ERROR' ? '#f87171' : log.level === 'WARNING' ? '#fbbf24' : '#34d399'}`, fontSize: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '10px', color: log.level === 'ERROR' ? '#f87171' : log.level === 'WARNING' ? '#fbbf24' : '#34d399' }}>{log.level}</span>
                        <span>{log.time}</span>
                      </div>
                      <div style={{ color: '#cbd5e1', lineHeight: '1.4' }}>{log.msg}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* PDF 다운로드 액션 버튼 영역 */}
              <section style={{ marginTop: 'auto' }}>
                <button
                  id="pdf-download-btn"
                  onClick={handlePdfDownload}
                  style={{
                    width: '100%', padding: '15px', background: '#3b82f6', color: '#fff',
                    border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '10px', transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                  onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                >
                  <FileText size={18} />
                  탄소배출 평가 보고서 (PDF) 다운로드
                </button>
              </section>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}