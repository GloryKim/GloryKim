const fs = require('fs');
const path = require('path');

const LOG_DIR = process.env.LOG_DIR;
const FIELDS = ["status", "device_id", "input_ppm", "output_ppm", "flow_rate", "temp", "pressure", "energy_cons", "runtime"];

if (!LOG_DIR) {
    console.error("[환경 변수 에러] .env의 LOG_DIR 설정이 없습니다.");
    process.exit(1);
}

const logDir = path.isAbsolute(LOG_DIR) ? LOG_DIR : path.join(__dirname, LOG_DIR);
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const saveToCSV = (data) => {
    const date = new Date().toISOString().split('T')[0];
    const logFile = path.join(logDir, `${data.device_id}_${date}.csv`); 

    if (!fs.existsSync(logFile)) {
        const header = "Time, " + FIELDS.map(f => f.toUpperCase()).join(", ") + "\n";
        fs.writeFileSync(logFile, header);
    }

    const logValues = FIELDS.map(field => data[field] ?? "");
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
const logLine = `${timestamp},${logValues.join(",")}\n`;
    
    fs.appendFile(logFile, logLine, (err) => {
        if (err) console.error(`[CSV 저장 실패] ${data.device_id}:`, err);
    });
};

module.exports = { saveToCSV };