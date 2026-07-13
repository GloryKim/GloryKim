require('dotenv').config();
const net = require('net');
const fs = require('fs');
const path = require('path');

const deviceId = process.argv[2];
const SERVER_IP = process.env.SERVER_IP;
const SERVER_PORT = process.env.PORT_TCP;
const SEND_INTERVAL = parseInt(process.env.SEND_INTERVAL) || 100;

if (!deviceId) {
    console.error("[실행 에러] 기기 ID가 지정되지 않았습니다. (예: node co2_machine.js ABS-01)");
    process.exit(1);
}
if (!SERVER_IP || !SERVER_PORT) {
    console.error("[환경 변수 에러] .env 파일의 SERVER_IP 또는 PORT_TCP 설정을 확인하세요.");
    process.exit(1);
}

const dataPath = path.join(__dirname, 'temporary_datas', `device_${deviceId}.json`);

let client = null;
let dataInterval = null;
let rawData = [];
let index = 0;

try {
    if (fs.existsSync(dataPath)) {
        rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        console.log(`[시스템] ${deviceId} 데이터 로드 완료`);
    } else {
        throw new Error(`파일이 존재하지 않습니다: ${dataPath}`);
    }
} catch (err) {
    console.error(`[에러] 데이터를 불러올 수 없습니다: ${err.message}`);
    process.exit(1);
}

function connectToServer() {
    client = new net.Socket();
    console.log(`[연결 시도] 서버 주소 -> ${SERVER_IP}:${SERVER_PORT}`);

    client.connect(SERVER_PORT, SERVER_IP, () => {
        console.log(`[${deviceId}] 서버 연결 성공! 데이터 송신을 시작합니다.`);
        
        dataInterval = setInterval(() => {
            if (rawData.length > 0 && rawData[index]) {
                const payload = JSON.stringify(rawData[index]) + '\n';
                client.write(payload);
                index = (index + 1) % rawData.length;
            }
        }, SEND_INTERVAL); 
    });

    client.on('close', () => {
        console.log(`[${deviceId}] 연결 끊김. 5초 후 다시 시도합니다...`);
        cleanup();
        setTimeout(connectToServer, 5000); 
    });

    client.on('error', (err) => {
        console.error(`[${deviceId}] 통신 에러: ${err.message}`);
    });
}

function cleanup() {
    if (dataInterval) {
        clearInterval(dataInterval);
        dataInterval = null;
    }
    if (client) {
        client.destroy();
        client = null;
    }
}

connectToServer();

process.on('SIGINT', () => {
    console.log(`\n[${deviceId}] 시뮬레이터를 종료합니다.`);
    cleanup();
    process.exit(0);
});