#!/bin/bash

# 모든 서비스 종료 및 좀비 프로세스 정리 스크립트
# 사용법: ./2_stop_all_services.sh

echo "=== 모든 CO2 모니터링 서비스 종료 및 정리 시작 ==="

# 1. 고정 서버 세션 종료
echo "메인 서버 세션 종료 중..."
for session in \
  co2_server
do
  tmux kill-session -t "${session}" 2>/dev/null || true
done

# 2. 가동 중인 모든 장비 세션 일괄 종료
echo "실행 중인 모든 장비 세션 종료 중..."
tmux ls -F "#{session_name}" 2>/dev/null | grep "^co2_device_" | xargs -I {} tmux kill-session -t {} 2>/dev/null || true

# 3. 백그라운드 잔류 프로세스 강제 종료
echo "잔류 프로세스 제거 중..."
pkill -f "node server.js" || true
pkill -f "node co2_machine.js" || true

sleep 2

echo "=== 시스템이 종료되었습니다 ==="
echo ""
echo "현재 실행 중인 tmux 세션 상태:"
tmux list-sessions 2>/dev/null || echo "실행 중인 세션이 없습니다."