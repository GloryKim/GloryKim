require('dotenv').config();
const net = require('net');
const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');           
const { Server } = require('socket.io'); 

const logger = require('./system-logger');       
const apiRoutes = require('./api-routes');        
const { handleTcpConnection } = require('./tcp-router');
const store = require('./state-store');  

const PORT_TCP = process.env.PORT_TCP;
const PORT_WEB = process.env.PORT_WEB;

if (!PORT_TCP || !PORT_WEB || !process.env.SERVER_IP) {
    console.error("[환경 변수 에러] .env 파일의 포트 및 IP 설정이 누락되었습니다.");
    process.exit(1);
}

const app = express();
app.use(cors());

// HTTP 서버 인스턴스 생성 및 Express 연동
const webServer = http.createServer(app);

// 웹소켓(Socket.io) 서버 인스턴스 생성 및 CORS 설정
const io = new Server(webServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// 웹소켓 클라이언트(프론트엔드) 연결 수립 시 로직
io.on('connection', (socket) => {
    logger.info(`[WS] 프론트엔드 대시보드 연결 성공 (ID: ${socket.id})`);

    socket.emit('init_data', store.getStoredData());

    socket.on('disconnect', () => {
        logger.info(`[WS] 프론트엔드 대시보드 연결 종료 (ID: ${socket.id})`);
    });
});

store.storeEvents.on('dataUpdated', (deviceData) => {
    io.emit('realtime_update', deviceData);
});

const loggedPaths = new Set();
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logKey = `${req.method}:${req.originalUrl}`;
        
        if (res.statusCode !== 200 || !loggedPaths.has(logKey)) {
            logger.info(`[HTTP] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
            if (res.statusCode === 200) loggedPaths.add(logKey);
        }
        logger.saveAccessLog(req, res, duration);
    });
    next();
});

app.use(express.static(path.join(__dirname, 'co2-frontend', 'dist')));
app.use('/api', apiRoutes);

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'co2-frontend', 'dist', 'index.html'));
});

const tcpServer = net.createServer(handleTcpConnection);

tcpServer.listen(PORT_TCP, () => {
    logger.info(`[READY] TCP 수집 서버 가동 성공 (Port: ${PORT_TCP})`);
});

webServer.listen(PORT_WEB, () => {
    logger.info(`[READY] 통합 웹 대시보드 및 실시간 웹소켓 서버 가동: http://${process.env.SERVER_IP}:${PORT_WEB}`);
});

process.on('SIGINT', () => {
    logger.info('시스템 종료 프로세스를 시작합니다...');
    tcpServer.close(() => {
        webServer.close(() => {
            logger.info('모든 서버가 종료 되엇습니다. ');
            process.exit(0);
        });
    });
});