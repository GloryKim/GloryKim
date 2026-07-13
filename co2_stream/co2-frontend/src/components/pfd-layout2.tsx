import React, { useState, useEffect, useRef } from 'react';

// 흡수탑 SVG
type AbsorberSymbolProps = { color?: string; deviceId: string }; 
export const AbsorberSymbol = ({ color = '#8a8a8a', deviceId }: AbsorberSymbolProps) => (
  <svg width="60" height="100" viewBox="0 0 220 360" xmlns="http://www.w3.org/2000/svg">
    {/* Gradient ID에 deviceId를 결합해 충돌 방지 */}
    <defs><linearGradient id={`absorberBodyGradient-${deviceId}`} x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#e9e9e9" /><stop offset="18%" stopColor="#f7f7f7" /><stop offset="55%" stopColor="#dcdcdc" /><stop offset="100%" stopColor="#f2f2f2" /></linearGradient></defs>
    <path d="M50 330 L50 95 A60 60 0 0 1 170 95 L170 330 Z" fill={`url(#absorberBodyGradient-${deviceId})`} stroke={color} strokeWidth="2" />
  </svg>
);

// 블로워 SVG
export const BlowerSymbol = () => (
  <svg width="65" height="55" viewBox="0 0 220 170" xmlns="http://www.w3.org/2000/svg">
    <path d="M78 98 L122 98 L140 136 L60 136 Z" fill="#f2f2f2" stroke="#222" strokeWidth="3" strokeLinejoin="round" />
    <circle cx="96" cy="80" r="40" fill="#f2f2f2" stroke="#222" strokeWidth="3" />
    <path d="M96 40 L166 40 L166 68 L136 68 Z" fill="#f2f2f2" stroke="#222" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M 96 63 A 17 17 0 1 1 79 80" fill="none" stroke="#222" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// 플래시 드럼 SVG
export const FlashDrumSymbol = () => (
  <svg width="60" height="100" viewBox="0 0 160 260" xmlns="http://www.w3.org/2000/svg">
    <rect x="40" y="20" width="80" height="220" rx="40" ry="40" fill="#f2f2f2" stroke="#222" strokeWidth="3" />
    <rect x="40" y="60" width="80" height="140" fill="none" stroke="#222" strokeWidth="2" />
    <line x1="48" y1="68" x2="112" y2="192" stroke="#777" strokeWidth="2" strokeDasharray="4 4" />
    <line x1="112" y1="68" x2="48" y2="192" stroke="#777" strokeWidth="2" strokeDasharray="4 4" />
  </svg>
);

// 열교환기 SVG
type HeatExchangerSymbolProps = { strokeColor?: string; };
export const HeatExchangerSymbol = ({ strokeColor = 'black' }: HeatExchangerSymbolProps) => (
  <svg width="100" height="55" viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg">
    <rect x="35" y="40" width="250" height="90" rx="45" ry="45" fill="white" stroke={strokeColor} strokeWidth="8" />
    <line x1="80" y1="40" x2="80" y2="130" stroke={strokeColor} strokeWidth="8" />
    <line x1="240" y1="40" x2="240" y2="130" stroke={strokeColor} strokeWidth="8" />
    <line x1="80" y1="58" x2="240" y2="58" stroke={strokeColor} strokeWidth="8" />
    <line x1="80" y1="82" x2="240" y2="82" stroke={strokeColor} strokeWidth="8" />
    <line x1="80" y1="106" x2="240" y2="106" stroke={strokeColor} strokeWidth="8" />
  </svg>
);

// 펌프 SVG
export const PumpSymbol = ({ deviceId }: { deviceId: string }) => ( 
  <svg width="60" height="60" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
    {/* Gradient ID에 deviceId를 결합하여 충돌 방지 */}
    <defs><radialGradient id={`pumpVesselGrad-${deviceId}`} cx="38%" cy="35%" r="70%"><stop offset="0%" stopColor="#f1f1e8" /><stop offset="45%" stopColor="#c8c5b7" /><stop offset="75%" stopColor="#9d9a8d" /><stop offset="100%" stopColor="#6f6d63" /></radialGradient></defs>
    <path d="M62 98 L118 98 L136 138 L44 138 Z" fill={`url(#pumpVesselGrad-${deviceId})`} stroke="#5a5a52" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="90" cy="74" r="36" fill={`url(#pumpVesselGrad-${deviceId})`} stroke="#5a5a52" strokeWidth="2" />
  </svg>
);

// 리보일러 SVG
type ReboilerSymbolProps = { strokeColor?: string; };
export const ReboilerSymbol = ({ strokeColor = 'red' }: ReboilerSymbolProps) => (
  <svg width="55" height="100" viewBox="0 0 170 320" xmlns="http://www.w3.org/2000/svg">
    <rect x="40" y="35" width="90" height="250" rx="45" ry="45" fill="white" stroke={strokeColor} strokeWidth="8" />
    <line x1="40" y1="80" x2="130" y2="80" stroke={strokeColor} strokeWidth="8" />
    <line x1="40" y1="240" x2="130" y2="240" stroke={strokeColor} strokeWidth="8" />
    <line x1="58" y1="80" x2="58" y2="240" stroke={strokeColor} strokeWidth="8" />
    <line x1="82" y1="80" x2="82" y2="240" stroke={strokeColor} strokeWidth="8" />
    <line x1="106" y1="80" x2="106" y2="240" stroke={strokeColor} strokeWidth="8" />
  </svg>
);

// 재생탑 SVG
type StripperSymbolProps = { color?: string; deviceId: string }; 
export const StripperSymbol = ({ color = '#8a8a8a', deviceId }: StripperSymbolProps) => (
  <svg width="60" height="100" viewBox="0 0 220 360" xmlns="http://www.w3.org/2000/svg">
    {/* Gradient ID에 deviceId를 결합하여 충돌 방지 */}
    <defs><linearGradient id={`stripperBodyGradient-${deviceId}`} x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#e9e9e9" /><stop offset="18%" stopColor="#f7f7f7" /><stop offset="55%" stopColor="#dcdcdc" /><stop offset="100%" stopColor="#f2f2f2" /></linearGradient></defs>
    <path d="M50 330 L50 95 A60 60 0 0 1 170 95 L170 330 Z" fill={`url(#stripperBodyGradient-${deviceId})`} stroke={color} strokeWidth="2" />
  </svg>
);

// 기본 레이아웃 구성 요소

const ProcessNode = ({ children, label, left, top }: { children: React.ReactNode; label: string; left: number; top: number }) => (
  <div style={{ position: 'absolute', left, top, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', zIndex: 2, transform: 'translateX(-50%)' }}>
    {children}  
    <div style={{ background: 'white', padding: '2px 6px', border: '1px solid #222', color: '#222', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap', zIndex: 3 }}>
      {label}
    </div>
  </div>
);

const FlowLabel = ({ text, left, top }: { text: string; left: number; top: number }) => (
  <div style={{ position: 'absolute', left, top, transform: 'translate(-50%, -50%)', background: 'white', padding: '2px 8px', border: '1px solid #222', color: '#222', fontSize: '11px', fontWeight: 'bold', zIndex: 3 }}>
    {text}
  </div>
);

// 실시간 모니터링 컴포넌트

// 상태값에 따른 색변화
const getStatusColor = (status: string) => {
  if (status === 'warning') return '#f1c40f';
  if (status === 'error') return '#e74c3c';
  return '#ffffff';
};

// React.memo -> 불필요한 리렌더링을 방지 
const areEqual = (prevProps: any, nextProps: any) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.initialX === nextProps.initialX &&
    prevProps.initialY === nextProps.initialY &&
    JSON.stringify(prevProps.statusHistory) === JSON.stringify(nextProps.statusHistory)
  );
};

const DraggableMonitor = React.memo(({ 
  label, value, unit, statusHistory, anchorX, anchorY, initialX, initialY 
}: { 
  label: string, value: string|number, unit: string, statusHistory: string[], anchorX: number, anchorY: number, initialX: number, initialY: number 
}) => {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number, startY: number, initPosX: number, initPosY: number }>({ startX: 0, startY: 0, initPosX: pos.x, initPosY: pos.y });

  // 마우스 이벤트
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, initPosX: pos.x, initPosY: pos.y };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPos({ x: dragRef.current.initPosX + dx, y: dragRef.current.initPosY + dy });
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const currentStatus = statusHistory[0] || 'operating';
  const textColor = getStatusColor(currentStatus);

  return (
    <>
      {/* 실시간 박스 연결 점선 */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 4 }}>
        <path d={`M ${anchorX} ${anchorY} Q ${anchorX} ${pos.y + 30}, ${pos.x + 60} ${pos.y + 30}`} fill="none" stroke="#2c3e50" strokeWidth="2" strokeDasharray="6 4" />
        <circle cx={anchorX} cy={anchorY} r="4" fill="#e74c3c" />
      </svg>

      {/* 실시간 데이터 표시 박스 */}
      <div 
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute', left: pos.x, top: pos.y, width: '120px',
          background: '#1e272e', border: '3px solid #3498db', borderRadius: '4px',
          padding: '8px', color: 'white', zIndex: 5,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}
      >
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', justifyContent: 'center' }}>
          {statusHistory.map((status, idx) => (
            <div key={idx} style={{ width: '16px', height: '16px', backgroundColor: getStatusColor(status), border: '1px solid #7f8c8d' }} />
          ))}
        </div>
        <div style={{ fontSize: '11px', color: '#bdc3c7', marginBottom: '2px', textAlign: 'center' }}>{label}</div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '4px' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: textColor }}>{value}</span>
          <span style={{ fontSize: '10px', color: '#bdc3c7' }}>{unit}</span>
        </div>
      </div>
    </>
  );
}, areEqual);

// 개별 장치 공정도 메인 (Device PFD)

const ResponsivePFDFrame = ({ children }: { children: React.ReactNode }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  const BASE_WIDTH = 1040;
  const BASE_HEIGHT = 640;

  useEffect(() => {
    const updateScale = () => {
      if (!wrapperRef.current) return;

      const availableWidth = wrapperRef.current.clientWidth;
      const nextScale = Math.min(1, availableWidth / BASE_WIDTH);

      setScale(nextScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);

    return () => {
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        overflow: 'visible'
      }}
    >
      <div
        style={{
          width: `${BASE_WIDTH}px`,
          height: `${BASE_HEIGHT * scale}px`,
          position: 'relative'
        }}
      >
        <div
          style={{
            width: `${BASE_WIDTH}px`,
            height: `${BASE_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top center'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const DevicePFD = React.memo(({ deviceData }: { deviceData: any }) => {
  const efficiency = deviceData.efficiency ? deviceData.efficiency.toFixed(1) : "0.0";
  const deviceId = deviceData.device_id || deviceData.id; 

  const safeHist = (key: string) => {
    return (deviceData.history && deviceData.history[key]) 
      ? deviceData.history[key] 
      : ['operating', 'operating', 'operating', 'operating', 'operating'];
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '1040px',
        height: '640px',
        background: '#fcfcfc',
        border: '2px solid #34495e',
        borderRadius: '8px',
        overflow: 'hidden',
        margin: '0 auto 24px auto'
      }}
    >
      
      <div style={{ position: 'absolute', top: 10, left: 15, zIndex: 10, display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ background: '#2c3e50', color: 'white', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>
          DEVICE ID : {deviceId}
        </div>
        <div style={{ color: '#222', fontWeight: 'bold', fontSize: '14px' }}>
          Runtime : {deviceData.runtime} s
        </div>
      </div>

      <div style={{ position: 'absolute', width: '100%', height: '100%', left: '-15px', top: '40px' }}>
        <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }}>
          <defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#555" /></marker></defs>
          <g fill="none" stroke="#555" strokeWidth="2" markerEnd="url(#arrow)">

            {/* 1. 외부 가스 유입 -> 블로워(BLOWER) */}
            <path d="M 60 270 L 130 270" /> 
            
            {/* 2. 블로워(BLOWER) 출력 -> 흡수탑(ABSORBER) */}
            <path d="M 180 270 L 230 270" /> 
            
            {/* 3. 흡수탑 상부 가스 -> 플래시 드럼(FLASH) */}
            <path d="M 230 230 L 200 230 L 200 80 L 230 80" /> 
            
            {/* 4. 플래시 드럼(FLASH) 상부 -> 가스 배출(VENT) */}
            <path d="M 250 30 L 250 10 L 350 10" /> 
            
            {/* 5. 플래시 드럼 하부 액체 -> 흡수탑(ABSORBER) */}
            <path d="M 270 80 L 300 80 L 300 230 L 270 230" /> 
            
            {/* 6. 흡수탑 하부(Rich Solvent) -> 펌프(PUMP) */}
            <path d="M 250 300 L 250 480 L 270 480" /> 
            
            {/* 7. 펌프(PUMP) 출력 -> 열교환기(HEATEX) */}
            <path d="M 330 485 L 500 485" /> 
            
            {/* 8. 열교환기에서 가열된 액체(Rich Solvent) -> 재생탑(STRIPPER) */}
            <path d="M 600 480 L 760 480 L 760 260 L 820 260" /> 
            
            {/* 9. 재생탑 상부 -> 포집된 CO2 배출 (CO2OUT) */}
            <path d="M 850 200 L 850 130 L 970 130" /> 
            
            {/* 10. 재생탑 하부 액체 -> 리보일러(REBOILER) */}
            <path d="M 850 300 L 850 320 L 920 320" /> 
            
            {/* 11. 리보일러(REBOILER) 증기 -> 재생탑 하부  */}
            <path d="M 920 260 L 880 260" /> 
            
            {/* 12. 재생탑/리보일러 하부(Lean Solvent) -> 열교환기(HEATEX) */}
            <path d="M 950 340 L 950 495 L 600 495" /> 
            
            {/* 13. 열교환기에서 냉각된 액체 -> 쿨러(COOLER) */}
            <path d="M 550 455 L 550 200" /> 
            
            {/* 14. 쿨러(COOLER)에서 최종 냉각된 액체 -> 흡수탑 상부 */}
            <path d="M 500 175 L 350 175 L 350 270 L 270 270" />
          </g>
        </svg>

        {/* 공정도 장비 위치 및 라벨  */}
        <ProcessNode left={155} top={243} label="BLOWER"><BlowerSymbol /></ProcessNode>
        <ProcessNode left={250} top={200} label="ABSORBER"><AbsorberSymbol deviceId={deviceId} /></ProcessNode> 
        <ProcessNode left={250} top={30} label="FLASH"><FlashDrumSymbol /></ProcessNode>
        <ProcessNode left={300} top={450} label="PUMP"><PumpSymbol deviceId={deviceId} /></ProcessNode> 
        <ProcessNode left={550} top={460} label="HEATEX"><HeatExchangerSymbol /></ProcessNode>
        <ProcessNode left={550} top={150} label="COOLER"><HeatExchangerSymbol strokeColor="#007bff" /></ProcessNode>
        <ProcessNode left={850} top={200} label="STRIPPER"><StripperSymbol deviceId={deviceId} /></ProcessNode> 
        <ProcessNode left={950} top={240} label="REBOILER"><ReboilerSymbol strokeColor="#ff4d4d" /></ProcessNode>


        {/* 공정 흐름 지점 라벨  */}
        <FlowLabel text="FLUEGAS" left={70} top={270} />
        <FlowLabel text="GASOUT" left={198} top={180} />
        <FlowLabel text="VENT" left={300} top={10} />
        <FlowLabel text="WATER" left={297} top={180} />
        <FlowLabel text="RICHOUT" left={250} top={390} />
        <FlowLabel text="TOHEATER" left={415} top={485} />
        <FlowLabel text="RICHIN" left={680} top={480} />
        <FlowLabel text="CO2OUT" left={900} top={130} />
        <FlowLabel text="LEANOUT" left={780} top={495} />
        <FlowLabel text="LEANOUT2" left={550} top={335} />
        <FlowLabel text="LEANIN2" left={430} top={175} />

        {/* 실시간 데이터 정보 */}
        <DraggableMonitor label="INPUT PPM" value={deviceData.input_ppm} unit="ppm" statusHistory={safeHist('input_ppm')} anchorX={70} anchorY={270} initialX={20} initialY={100} />
        <DraggableMonitor label="FLOW RATE" value={deviceData.flow_rate} unit="KG/hr" statusHistory={safeHist('flow_rate')} anchorX={155} anchorY={243} initialX={65} initialY={350} />
        <DraggableMonitor label="ABS. TEMP" value={deviceData.temp} unit="°C" statusHistory={safeHist('temp')} anchorX={250} anchorY={200} initialX={360} initialY={60} />
        <DraggableMonitor label="ABS. PRESS" value={deviceData.pressure} unit="atm" statusHistory={safeHist('pressure')} anchorX={250} anchorY={200} initialX={360} initialY={190} />
        <DraggableMonitor label="ENERGY" value={deviceData.energy_cons} unit="kWh" statusHistory={safeHist('energy_cons')} anchorX={300} anchorY={450} initialX={65} initialY={450} />
        <DraggableMonitor label="OUTPUT PPM" value={deviceData.output_ppm} unit="ppm" statusHistory={safeHist('output_ppm')} anchorX={970} anchorY={130} initialX={690} initialY={10} />
        <DraggableMonitor label="EFFICIENCY" value={efficiency} unit="%" statusHistory={safeHist('efficiency')} anchorX={970} anchorY={130} initialX={690} initialY={110} />
      </div>
    </div>
  );
});

// 서버로부터 받은 전체 데이터를 처리하여 장치별 PFD를 리스트로 렌더링

export default function PFDLayout2({ allData }: { allData: any }) {
  const sortedDevices = Object.keys(allData || {})
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map(id => ({
      ...allData[id],
      device_id: id,
    }));

  return (
    <div
      style={{
        padding: '12px',
        backgroundColor: '#ecf0f1',
        minHeight: 'calc(100vh - 110px)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          color: '#2c3e50',
          margin: '0 0 16px 0',
          fontSize: '20px'
        }}
      >
        CO2 습식 포집 공정 통합 모니터링 (연결된 장치: {sortedDevices.length}대)
      </h2>
      
      {sortedDevices.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            color: '#7f8c8d',
            marginTop: '50px',
            fontSize: '18px'
          }}
        >
          현재 서버에 연결되어 가동 중인 장치가 없습니다.
        </div>
      ) : (
        sortedDevices.map((data) => (
          <ResponsivePFDFrame key={data.device_id}>
            <DevicePFD deviceData={data} />
          </ResponsivePFDFrame>
        ))
      )}
    </div>
  );
}