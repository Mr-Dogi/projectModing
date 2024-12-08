# projectModding
모드 공유 사이트 및 커뮤니티 사이트들의 기능을 클론코딩하며 레어어 아키텍쳐 기반의 개발 방식을 공부하고자 제작한 프로젝트입니다.

## 주요 기능
* 기능 1: Member
* 기능 2: board (게시판 기능)

## 기술 스택
* 언어: typescript
* Backend: Node.js, express
* Databases: Mysql
* DI : tsyringe
* 클라우드 : google Cloud VM , google Sql

## 시작하기
### 개발 환경
```
Node.js 22.11
npm 10.9
yarn 
fnm 1.38.1
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
레이아웃 아키텍쳐에 따라 구성하였습니다.
부가적인 레이아웃도 추가로 구성 
DTO, MODEL(DB 스키마), middlewares (공통 로직) 등...
1. Presentation Layer
   controller
   - 클라이언트의 요청 변환
   - 기본적인 내용을 검증한다.
2. Business Layer
   services
   - 비즈니스 로직을 정의한다.
3. Persistence Layer
   repository (DAO)
   - DB와 상호작용하는 역할 수행
4. Database Layer
   실제 DB가 존재하는 계층
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
