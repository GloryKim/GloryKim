// ms : 메인 페이지 입니다.
import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Component,
  Truck,
  Factory,
  Leaf,
  Server,
  ShieldCheck,
  Database
} from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 }
};

export default function HomePage({ deviceCount, allData, setViewMode }) {
  const devices = Object.values(allData || {});
  const onlineCount = devices.filter(device => device.is_online).length;

  const avgEfficiency = devices.length > 0
    ? (
        devices.reduce((sum, device) => {
          const input = device.input_ppm || 0;
          const output = device.output_ppm || 0;
          const efficiency = input > 0 ? ((input - output) / input) * 100 : 0;
          return sum + efficiency;
        }, 0) / devices.length
      ).toFixed(1)
    : '0.0';

  const quickMenus = [
    {
      title: '포집 대시보드',
      subtitle: 'Capture Dashboard',
      description: 'CO₂ 농도, 포집 효율, 온도, 압력, 에너지 사용량을 실시간으로 확인합니다.',
      icon: Activity,
      mode: 'DASHBOARD',
      badge: 'Live'
    },
    {
      title: '실시간 PFD 공정도',
      subtitle: 'PFD Monitoring',
      description: '포집 공정의 흐름과 장치별 센서 상태를 SVG 기반 공정도로 시각화합니다.',
      icon: Component,
      mode: 'PFD',
      badge: 'Live'
    },
    {
      title: 'CO₂ 이송 관리',
      subtitle: 'Transport Management',
      description: '포집 지점과 활용 지점 사이의 이송 경로 및 상태를 관리하는 확장 모듈입니다.',
      icon: Truck,
      mode: 'TRANSPORT',
      badge: 'Prototype'
    },
    {
      title: '건설재료 제조',
      subtitle: 'Material Production',
      description: 'CCU 건설재료 제조 조건, 배합 정보, 품질 데이터를 관리하는 확장 모듈입니다.',
      icon: Factory,
      mode: 'MANUFACTURE',
      badge: 'Prototype'
    },
    {
      title: 'MRV 환경성 평가',
      subtitle: 'MRV / LCA Assessment',
      description: '탄소 고정량, 전주기 배출량, 환경성 평가 결과를 통합 관리하는 평가 모듈입니다.',
      icon: Leaf,
      mode: 'ENVIRONMENT',
      badge: 'Prototype'
    }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.08 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}
    >
      <motion.section
        variants={cardVariants}
        style={{
          minHeight: '220px',
          borderRadius: '24px',
          padding: '36px',
          background: 'linear-gradient(135deg, #0f766e 0%, #0f172a 68%)',
          border: '1px solid #334155',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
        }}
      >
        <div>
          <p style={{
            margin: '0 0 10px',
            color: '#99f6e4',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.04em'
          }}>
            CCU Construction Materials Platform
          </p>

          <h2 style={{
            margin: 0,
            fontSize: '34px',
            letterSpacing: '-0.03em'
          }}>
            CCU 건설재료 전주기 탄소평가 플랫폼
          </h2>

          <p style={{
            marginTop: '14px',
            color: '#cbd5e1',
            lineHeight: 1.6,
            maxWidth: '760px'
          }}>
            포집 공정 데이터 수집부터 PFD 모니터링, CO₂ 이송, 건설재료 제조,
            MRV/LCA 평가까지 확장 가능한 통합 플랫폼 프로토타입입니다.
          </p>
        </div>

        <div style={{
          width: '170px',
          height: '170px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.16)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ShieldCheck size={44} color="#5eead4" />
          <strong style={{ marginTop: '12px' }}>Prototype</strong>
          <span style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
            Running
          </span>
        </div>
      </motion.section>

      <motion.section
        variants={cardVariants}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
        }}
      >
        <KpiCard icon={Server} label="연결 장치" value={deviceCount} unit="대" />
        <KpiCard icon={ShieldCheck} label="온라인 장치" value={onlineCount} unit="대" />
        <KpiCard icon={Activity} label="평균 포집 효율" value={avgEfficiency} unit="%" />
        <KpiCard icon={Database} label="데이터 갱신 주기" value="1.0" unit="sec" />
      </motion.section>

      <motion.section
        variants={cardVariants}
        style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '20px',
          padding: '26px'
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#f8fafc', margin: 0, fontSize: '22px' }}>
            전주기 플랫폼 모듈
          </h3>
          <p style={{ color: '#94a3b8', margin: '8px 0 0', fontSize: '14px' }}>
            각 모듈을 클릭하면 해당 화면으로 이동합니다.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          gap: '14px'
        }}>
          {quickMenus.map(menu => {
            const Icon = menu.icon;

            return (
              <motion.button
                key={menu.mode}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode(menu.mode)}
                style={{
                  minHeight: '220px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#fff'
                }}
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: '#1e40af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px'
                }}>
                  <Icon size={24} />
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <h4 style={{ margin: 0, fontSize: '16px' }}>{menu.title}</h4>

                  <span style={{
                    fontSize: '10px',
                    color: menu.badge === 'Live' ? '#67e8f9' : '#c4b5fd',
                    background: menu.badge === 'Live' ? '#164e63' : '#312e81',
                    borderRadius: '999px',
                    padding: '3px 7px'
                  }}>
                    {menu.badge}
                  </span>
                </div>

                <p style={{
                  color: '#64748b',
                  fontSize: '12px',
                  margin: '6px 0 12px'
                }}>
                  {menu.subtitle}
                </p>

                <p style={{
                  color: '#94a3b8',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  margin: 0
                }}>
                  {menu.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </motion.section>
    </motion.div>
  );
}

function KpiCard({ icon: Icon, label, value, unit }) {
  return (
    <div style={{
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '16px',
      padding: '20px',
      color: '#fff'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{ color: '#94a3b8', fontSize: '13px' }}>{label}</span>
        <Icon size={20} color="#38bdf8" />
      </div>

      <strong style={{
        display: 'block',
        fontSize: '30px',
        marginTop: '14px'
      }}>
        {value}
        <small style={{
          fontSize: '14px',
          color: '#94a3b8',
          marginLeft: '4px'
        }}>
          {unit}
        </small>
      </strong>
    </div>
  );
}