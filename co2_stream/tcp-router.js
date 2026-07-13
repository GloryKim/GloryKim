const logger = require('./system-logger');
const { saveToCSV } = require('./data-logger');
const store = require('./state-store');

let lastErrorTime = 0;

const handleTcpConnection = (socket) => {
    logger.info(`[TCP] 장치 접속: ${socket.remoteAddress}`);
    let buffer = '';

    socket.on('data', (data) => {
        buffer += data.toString();
        
        if (buffer.length > 10000) {
            logger.error(`[TCP] 비정상 버퍼 크기 감지, 강제 초기화`);
            buffer = '';
            return;
        }

        let boundary = buffer.indexOf('\n');

        while (boundary !== -1) {
            const packet = buffer.substring(0, boundary).trim();
            buffer = buffer.substring(boundary + 1);

            if (packet) {
                try {
                    const parsed = JSON.parse(packet);
                    if (!parsed || !parsed.device_id || typeof parsed.device_id !== 'string') {
                        logger.error(`[TCP] 무결성 검증 실패: 유효하지 않은 데이터 구조`);
                        return;
                         }
                    const dId = parsed.device_id;

                    store.updateDeviceData(dId, parsed);
                    saveToCSV(parsed);

                    if (store.checkFirstConnection(dId)) {
                        logger.info(`[SUCCESS] ${dId} 기기 수신 시작`);
                    }

                } catch (e) {
                    const now = Date.now();
                    if (now - lastErrorTime > 10000) {
                        logger.error(`[ERROR] 데이터 파싱 실패 (10초 주기 알림)`);
                        lastErrorTime = now;
                    }
                }
            }
            boundary = buffer.indexOf('\n');
        }
    });

    socket.on('end', () => logger.warn('[TCP] 장치 연결 종료'));
    socket.on('error', (err) => logger.error(`[TCP] 소켓 에러: ${err.message}`));
};

module.exports = { handleTcpConnection };