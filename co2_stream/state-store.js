const EventEmitter = require('events');
const storeEvents = new EventEmitter(); // 데이터 변경 이벤트를 중계할 인스턴스

let latestData = {}; 
let hasLoggedSuccess = {}; 

// 센서별 임계값 판별 로직 (백엔드)
const getMetricStatus = (val, type) => {
    const limits = {
        input_ppm: { warn: 145000, err: 160000 },
        output_ppm: { warn: 20000, err: 30000 }, 
        efficiency: { warn: 90, err: 85, reverse: true },
        temp: { warn: 50, err: 60 },
        pressure: { warn: 1.1, err: 1.2 },
        energy_cons: { warn: 0.4, err: 0.5 },
        flow_rate: { warn: 2550, err: 2650 }
    };

    const limit = limits[type];
    if (!limit) return 'operating';

    if (limit.reverse) {
        if (val <= limit.err) return 'error';
        if (val <= limit.warn) return 'warning';
    } else {
        if (val >= limit.err) return 'error';
        if (val >= limit.warn) return 'warning';
    }
    
    return 'operating';
};

const updateDeviceData = (deviceId, data) => {
    if (!deviceId) return;
    
    const prevData = latestData[deviceId] || {};
    const prevHistory = prevData.history || {};
    
    const eff = data.input_ppm ? Number((((data.input_ppm - data.output_ppm) / data.input_ppm) * 100).toFixed(1)) : 0;
    
    const metrics = [
        { key: 'input_ppm', val: data.input_ppm },
        { key: 'output_ppm', val: data.output_ppm },
        { key: 'flow_rate', val: data.flow_rate },
        { key: 'temp', val: data.temp },
        { key: 'pressure', val: data.pressure },
        { key: 'energy_cons', val: data.energy_cons },
        { key: 'efficiency', val: eff }
    ];

    const newHistory = {};
    
    metrics.forEach(m => {
        const status = getMetricStatus(Number(m.val), m.key);
        const currentArr = prevHistory[m.key] || ['operating', 'operating', 'operating', 'operating', 'operating'];
        newHistory[m.key] = [status, ...currentArr].slice(0, 5);
    });

    latestData[deviceId] = { 
        ...data, 
        efficiency: eff, 
        history: newHistory,
        server_time: new Date().toISOString() 
    };

    // 실시간 데이터 업데이트 이벤트 발생 (가공 완료된 최신 디바이스 데이터를 전달)
    storeEvents.emit('dataUpdated', getStoredData(deviceId));
};

const getStoredData = (deviceId = null) => {
    const now = new Date();
    
    const processDevice = (data) => {
        if (!data) return null;
        
        const diff = (now - new Date(data.server_time)) / 1000;
        const is_online = diff < 10;
        
        let processedHistory = data.history;
        
        if (!is_online) {
            processedHistory = {};
            for (let key in data.history) {
                // 통신 단절 시 5칸 모두 에러로 강제 변경
                processedHistory[key] = ['error', 'error', 'error', 'error', 'error']; 
            }
        }
        
        return { ...data, is_online, history: processedHistory };
    };

    if (deviceId) {
        return processDevice(latestData[deviceId]);
    }
    
    const processedData = {};
    for (const id in latestData) {
        processedData[id] = processDevice(latestData[id]);
    }
    return processedData;
};

const checkFirstConnection = (deviceId) => {
    if (!hasLoggedSuccess[deviceId]) {
        hasLoggedSuccess[deviceId] = true;
        return true;
    }
    return false;
};

module.exports = { 
    updateDeviceData, 
    getStoredData, 
    checkFirstConnection,
    storeEvents 
};