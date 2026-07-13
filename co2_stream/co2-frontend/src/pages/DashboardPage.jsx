import React from 'react';
import { motion } from 'framer-motion';
import DashboardPanels from '../components/DashboardPanels';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// 개별 장치 카드 애니메이션 설정
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  }
};

export default function DashboardPage({
  deviceIds = [],
  allData = {},
  histories = {},
  getStatusStyle
}) {
  if (deviceIds.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          minHeight: 'calc(100vh - 160px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '40px 60px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)'
          }}
        >
          <h2 style={{ margin: 0, fontSize: '22px', color: '#f8fafc' }}>
            데이터를 기다리는 중입니다
          </h2>
          <p style={{ marginTop: '10px', color: '#94a3b8', fontSize: '14px' }}>
            서버에 연결된 CO₂ 포집 장치 데이터가 수신되면 대시보드가 표시됩니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{
        width: '100%',
        maxWidth: 'none',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        boxSizing: 'border-box'
      }}
    >
      {deviceIds.map((id) => {
        const device = allData[id];

        if (!device) return null;

        const status = getStatusStyle
          ? getStatusStyle(device.status, device.is_online)
          : { color: '#38A169', text: 'OPERATING' };

        const statusColor = status.color;
        const statusText = status.text;

        return (
          <motion.div
            key={id}
            variants={itemVariants}
            style={{
              width: '100%',
              maxWidth: 'none',
              minWidth: 0,
              boxSizing: 'border-box',
              background: '#1e293b',
              padding: '25px',
              borderRadius: '15px',
              border: '1px solid #334155',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              opacity: device.is_online ? 1 : 0.6
            }}
          >
            {/* 장치 상단 헤더 */}
            <div
              style={{
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '15px',
                flexWrap: 'wrap'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  flexWrap: 'wrap'
                }}
              >
                <h2
                  style={{
                    color: '#fff',
                    margin: 0,
                    fontSize: '24px',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {id}
                </h2>

                <span
                  style={{
                    color: statusColor,
                    fontWeight: 'bold',
                    background: '#0f172a',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${statusColor}40`,
                    fontSize: '13px'
                  }}
                >
                  ● {statusText}
                </span>
              </div>

              <div
                style={{
                  color: '#94a3b8',
                  fontSize: '13px',
                  background: '#0f172a',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  border: '1px solid #334155'
                }}
              >
                Runtime:{' '}
                <strong style={{ color: '#38bdf8' }}>
                  {device.runtime}
                </strong>
                s
              </div>
            </div>

            {/* 오프라인 경고 */}
            {!device.is_online && (
              <div
                style={{
                  color: '#e74c3c',
                  fontSize: '13px',
                  marginBottom: '15px',
                  background: '#2a1111',
                  border: '1px solid #7f1d1d',
                  borderRadius: '8px',
                  padding: '10px 12px'
                }}
              >
                장치 통신이 끊겼습니다. 마지막 수신 데이터를 기준으로 상태를 표시합니다.
              </div>
            )}

            {/* 실제 차트/게이지 패널 */}
            <DashboardPanels
              deviceId={id}
              data={device}
              history={histories[id] || []}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}