# projectModding
모드 공유 사이트 및 커뮤니티 사이트들의 기능을 클론코딩하며 레어어 아키텍쳐 기반의 개발 방식을 공부하고자 제작한 프로젝트입니다.

## 주요 기능
* 기능 1: Member
* 기능 2: board (게시판 기능)

## 기술 스택
* 언어: typescript
* Backend: Node.js express
* Databases: Mysql
* 기타 :

## 시작하기
### 개발 환경
```
Node.js 22.11
npm 10.9
fnm 1.38.1
yarn or npm
mysql 5.7 for google cloud sql
```

### 설치 방법
1. 저장소를 클론합니다
```
git clone https://github.com/Mr-Dogi/projectModing.git
cd projectModing/ts
```

2. 필요한 패키지를 설치합니다.
```
##npm
npm install

##yarn
yarn install
```

3. 프로젝트를 실행합니다.
```
##npm
npm run dev

##yarn
yarn run dev
```

## 프로젝트 구조
```
src/
├── config/     # 환경 변수 정의
├── controller/ # 요청 검증 및 비즈니스 로직 매칭
├── dtos/       # 데이터 베이스 스키마 정의
├── exceptions/ # exption resolver 정의
├── interfaces/ # 구현체에 대한 역할 정의
├── middlewares/# router 와 controller 중간 로직
├── model/      # 프로젝트 내부 통신용 객체
├── repository/ # 데이터 베이스 통신 당담 (DAO)
├── router/     # API endpoint 정의
├── services/   # 비즈니스 로직 정의
├── test/       # 테스트 커버리지 작성
└── utile/      # 공용 함수 정의 ex: logger
app.ts          
server.ts       
```

### 테스트
```
## npm
npm run test
yarn run test
```

## 기타 문서
[데이터베이스 문서](./DATABASE.md)

### 참고 자료
