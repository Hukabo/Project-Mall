# 🛒 Shopping Mall Project

온라인 쇼핑몰 서비스를 구현한 **풀스택 웹 애플리케이션**입니다.

---

## 📌 프로젝트 개요

- **프로젝트명**: Shopping Mall
- **개발 기간**: 2026.01 ~ (진행 중)
- **개발 인원**: 개인 프로젝트
- **목적**
  - 실제 서비스에 가까운 쇼핑몰 도메인 경험
  - 기획부터 배포 및 유지보수까지 풀스택 개발자로서의 역량 향상
  - 개발 과정속에서의 트러블 슈팅으로 인한 문제 해결 능력 향상

---

## 🛠️ 사용 기술 스택

### Frontend
- React
- Next.js
- TypeScript
- Tailwind CSS

### Backend
- Nest.js
- TypeORM
- PostgreSQL
- JWT Athentication(Cookie 방식)

### Devops & Tools
- AWS EC2 / S3
- Docker
- Git & GitHub
- Postman

---

## 주요 기능

### 회원
- JWT 로그인
- Refresh Token 재발급
- Cookie 기반 인증
- 사용자 권한 분리(USER/ ADMIN)

### 상품
- 이미지 파일 업로드(multer)
- 상품 조회(무한 스크롤)
- 카테고리 or 상품 이름 검색 기능
- 계층형 카테고리(부모 카테고리 -> 자식 카테고리)

### 장바구니
- 동일 상품 수량 병합
- 재고 보다 많은 수량 담기 제한
- 수량 변경 즉시 DB 업데이트

### 주문
- 토스페이먼츠 결제 연동(테스트 환경)
- 주문 생성 및 상태 관리
- 트랜젝션
- 주문 내역 조회

### 관리자
- 전체 회원 조회
- 상품 CRUD 기능
