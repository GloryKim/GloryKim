require('dotenv').config();
const winston = require('winston');
const path = require('path');
const fs = require('fs');

const LOG_DIR = process.env.LOG_DIR;

if (!LOG_DIR) {
    console.error("[환경 변수 에러] .env 파일의 LOG_DIR 설정이 누락되었습니다.");
    process.exit(1);
}

const logDir = path.isAbsolute(LOG_DIR) ? LOG_DIR : path.join(__dirname, LOG_DIR);

if (!fs.existsSync(logDir)) {
    try {
        fs.mkdirSync(logDir, { recursive: true });
    } catch (err) {
        console.error(`[폴더 생성 에러] 시스템 로그 폴더 생성 실패: ${err.message}`);
        process.exit(1);
    }
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join(logDir, 'system.log') })
    ]
});

logger.saveAccessLog = (req, res, duration) => {
    const date = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString();
    
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    const logLine = `[${timestamp}] IP:${ip} | ${req.method} ${req.originalUrl} | Status:${res.statusCode} | Time:${duration}ms | Agent:${req.get('User-Agent')}\n`;
    const accessLogFile = path.join(logDir, `access_${date}.log`);
    
    fs.appendFile(accessLogFile, logLine, (err) => {
        if (err) console.error("[접속 로그 저장 에러]:", err);
    });
};

module.exports = logger;