#!/bin/bash

# 신규 CO2 포집 장비 동적 추가 스크립트
# 사용법: ./3_add_device.sh [장비ID]

if [ -z "$1" ]; then
  echo "사용법: ./3_add_device.sh [장비ID]"
  echo "예시: ./3_add_device.sh ABS-04"
  exit 1
fi

DEVICE_ID=$1
BASE_DIR=$(pwd)
SESSION_NAME="co2_device_${DEVICE_ID}"
FILE_PATH="${BASE_DIR}/devices.txt"

echo "신규 장비 [${DEVICE_ID}] 추가 가동을 시작합니다."

#  중복 실행 확인
if tmux has-session -t "${SESSION_NAME}" 2>/dev/null; then
  echo "알림: 이미 [${DEVICE_ID}] 장비가 실행 중입니다."
  exit 1
fi

# 백그라운드 세션 생성 및 실행
tmux new-session -d -s "${SESSION_NAME}" -c "${BASE_DIR}" "node co2_machine.js ${DEVICE_ID}"

# devices.txt 파일 관리 (줄바꿈 보장 및 정렬)
if [ -f "$FILE_PATH" ]; then
  [ -n "$(tail -c 1 "$FILE_PATH")" ] && echo "" >> "$FILE_PATH"
fi

# 등록 명단 확인 및 추가
if ! grep -q "^${DEVICE_ID}$" "$FILE_PATH" 2>/dev/null; then
  echo "${DEVICE_ID}" >> "$FILE_PATH"
  
  # 파일 내용을 오름차순(01, 02, 06...)으로 자동 정렬하여 덮어쓰기
  sort -o "$FILE_PATH" "$FILE_PATH"
  
  echo "알림: 등록 명단(devices.txt)에 자동 정렬되어 저장되었습니다."
fi

echo "성공: 장비 [${DEVICE_ID}] 가동 완료. 대시보드에서 확인 가능합니다."
echo "로그 확인: tmux attach-session -t ${SESSION_NAME}"