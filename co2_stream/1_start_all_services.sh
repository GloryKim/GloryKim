#!/bin/bash

# CO2 포집 모니터링 통합 시작 스크립트 (tmux 사용)
# 사용법: ./1_start_all_services.sh

set -e

# 프로젝트 경로 설정
BASE_DIR=$(pwd)

# .env 파일에서 환경 변수 자동 로드
if [ -f "${BASE_DIR}/.env" ]; then
  set -a
  source "${BASE_DIR}/.env"
  set +a
else
  echo "알림: .env 파일을 찾을 수 없습니다. 기본 설정을 사용합니다."
  SERVER_IP="localhost"
  PORT_WEB="4000"
fi

echo "=== CO2 포집 모니터링 시스템 가동 시작 ==="

# 기존 프로세스 정리 (중복 실행 방지)
echo "기존 프로세스 정리 중..."
pkill -f "node server.js" || true
pkill -f "node co2_machine.js" || true
sleep 2

# tmux 세션 시작 함수
start_tmux() {
  local session="$1"
  local dir="$2"
  shift 2
  local cmd="$*"

  tmux has-session -t "${session}" 2>/dev/null && tmux kill-session -t "${session}"
  tmux new-session -d -s "${session}" -c "${dir}" "${cmd}"
}

echo "1. 통합 웹 및 API 서버 시작 (포트: ${PORT_WEB})"
start_tmux co2_server "${BASE_DIR}" "node server.js"
sleep 2

echo "2. 공정 장비 자동 가동 시작..."
# devices.txt 파일이 없으면 기본 3대 목록을 생성합니다.
if [ ! -f "${BASE_DIR}/devices.txt" ]; then
  echo "알림: devices.txt 파일이 없어 기본 장비 목록을 생성합니다."
  echo -e "ABS-01\nABS-06\nABS-07" > "${BASE_DIR}/devices.txt"
fi

# devices.txt 파일을 읽어서 차례대로 장비를 가동합니다.
while IFS= read -r DEVICE_ID || [ -n "$DEVICE_ID" ]; do
  # 빈 줄은 무시
  if [ ! -z "$DEVICE_ID" ]; then
    echo "  - 장비(${DEVICE_ID}) 가동 중"
    start_tmux "co2_device_${DEVICE_ID}" "${BASE_DIR}" "node co2_machine.js ${DEVICE_ID}"
    sleep 1
  fi
done < "${BASE_DIR}/devices.txt"

echo ""
echo "=== 모든 서비스가 정상적으로 시작되었습니다 ==="
echo ""
echo "대시보드 접속 주소:"
echo "  주소: http://${SERVER_IP}:${PORT_WEB}"
echo ""
echo "명령어 안내:"
echo "  - 특정 세션 로그 확인: tmux attach-session -t [세션명]"
echo "  - 장비 추가 실행: ./3_add_device.sh [장비명]"
echo "  - 전체 시스템 종료: ./2_stop_all_services.sh"
echo ""