## Description
Package.json 에 명시된 "이름", "버전 값" 을 참조하여 S3에 배포가 진행 된다.

## Features
- S3 에 업로드
- 버전 기록 하여 데이터베이스에 레코드 생성
- 배포 이력 슬랙등의 채널에 공유 

## Options
- --force
  - 버전 값이 동일하더라도 배포를 진행한다.
- --init
  - 배포와 관련된 초기화 진행 및 새로운 JSON 생성
 -- build
 - S3에 배포
