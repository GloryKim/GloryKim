import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  LayoutDashboard,
  Component,
  Truck,
  Factory,
  Leaf
} from 'lucide-react';

export default function MainLayout({ children, viewMode, setViewMode, deviceCount }) {
  const menus = [
    { id: 'HOME', label: '메인 허브', icon: Home, active: true },
    { id: 'DASHBOARD', label: '포집 대시보드', icon: LayoutDashboard, active: true },
    { id: 'PFD', label: '실시간 PFD 공정도', icon: Component, active: true },
    { id: 'TRANSPORT', label: 'CO2 이송 관리', icon: Truck, active: true },
    { id: 'MANUFACTURE', label: '건설재료 제조', icon: Factory, active: false },
    { id: 'ENVIRONMENT', label: 'MRV 환경성 평가', icon: Leaf, active: false },
  ];

  const titleMap = {
    HOME: 'CCU 건설재료 전주기 탄소평가 플랫폼',
    DASHBOARD: 'CO2 습식 포집 공정 모니터링',
    PFD: '실시간 PFD 공정도',
    TRANSPORT: 'CO2 이송 관리',
    MANUFACTURE: '건설재료 제조',
    ENVIRONMENT: 'MRV 환경성 평가',
  };

  return (
    <div
        style={{
        display: 'flex',
        height: '100vh',
        background: '#0f172a',
        overflow: 'hidden'
     }}
>
      
      {/* 좌측 사이드바 */}
      <nav
        style={{
          width: '266px',
          background: '#1e293b',
          padding: '20px',
          borderRight: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* 좌측 상단 로고/타이틀 영역 - 클릭 시 HOME 이동 */}
        <button
          onClick={() => setViewMode('HOME')}
          style={{
            marginBottom: '35px',
            padding: '10px',
            paddingLeft: '10px',
            background: viewMode === 'HOME' ? '#0f172a' : 'transparent',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            borderRadius: '10px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#0f172a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = viewMode === 'HOME' ? '#0f172a' : 'transparent';
          }}
        >
          <h2 style={{ color: '#f8fafc', fontSize: '18px', margin: 0 }}>
            CCU 전주기 플랫폼
          </h2>
          <p
            style={{
              color: '#94a3b8',
              fontSize: '12px',
              marginTop: '5px',
              marginBottom: 0
            }}
          >
            포집·운송·제조 통합 관리
          </p>
        </button>

        {/* 사이드바 메뉴 */}
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          {menus.map((menu) => {
            const Icon = menu.icon;
            const isSelected = viewMode === menu.id;

            return (
              <li key={menu.id}>
                <motion.button
                  whileHover={menu.active ? { x: 4 } : {}}
                  whileTap={menu.active ? { scale: 0.98 } : {}}
                  onClick={() => menu.active && setViewMode(menu.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '12px 15px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: menu.active ? 'pointer' : 'not-allowed',
                    background: isSelected ? '#3b82f6' : 'transparent',
                    color: isSelected ? '#fff' : (menu.active ? '#cbd5e1' : '#475569'),
                    textAlign: 'left',
                    fontSize: '15px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={20} />

                  <span>{menu.label}</span>

                  {!menu.active && (
                    <span
                      style={{
                        fontSize: '10px',
                        background: '#334155',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        marginLeft: 'auto'
                      }}
                    >
                      준비중
                    </span>
                  )}
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 우측 메인 콘텐츠 영역 */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* 공통 헤더 */}
        <header
          style={{
            height: '70px',
            background: '#1e293b',
            borderBottom: '1px solid #334155',
            display: 'flex',
            alignItems: 'center',
            padding: '0 30px',
            justifyContent: 'space-between'
          }}
        >
          <h1 style={{ color: '#f8fafc', fontSize: '20px', margin: 0 }}>
            {titleMap[viewMode] || 'CCU 전주기 플랫폼'}
          </h1>

          <div
            style={{
              color: '#cbd5e1',
              fontSize: '14px',
              background: '#0f172a',
              padding: '6px 15px',
              borderRadius: '20px',
              border: '1px solid #334155'
            }}
          >
            가동 장비:{' '}
            <strong style={{ color: '#38bdf8' }}>
              {deviceCount}
            </strong>{' '}
            대
          </div>
        </header>

        {/* 페이지 렌더링 영역 */}
        <div
        style={{
            flex: 1,
            padding: viewMode === 'PFD' ? '12px' : '30px',
            overflowY: 'auto',
            overflowX: 'hidden'
        }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}