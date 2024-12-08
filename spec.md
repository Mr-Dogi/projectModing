# projectModing API 상세 명세서

---

## 1. 개요

본 문서는 회원 관리 및 게시판 서비스를 위한 REST API 명세를 정의합니다.

## 2. 공통 사항

### 2.1 기본 URL

```
https://api.example.com/api/v1
```

### 2.2 공통 응답 형식

```tsx
{
  "success": boolean,
  "message": string,
  "data": object | null,
}

```

### 2.3 에러 응답 형식

```json
{
  "success": false,
  "error": {
    "message": string,
    "details": object
  }
}

```

### 2.4 공통 헤더

```
Content-Type: application/json
Accept: application/json
```

## 3. Members API

### 3.1 회원 가입

- **Endpoint**: `POST /members`
- **설명**: 새로운 회원을 등록합니다.
- **권한**: 없음

**Request Body**:

```json
{
  "email": "string(max:100, format:email)",
  "nickname": "string(min:2, max:20, pattern:^[a-zA-Z0-9]+$)"
  "passwod" : "string(min:2, max:100)"
}
```

**Response**:

```json
{
  "success": "boolean",
  "data": {
    "userId": "string",
    "email": "string",
    "nickname": "string",
    "createdAt": "string(datetime)"
  }
}
```

### 3.2 회원 탈퇴

- **Endpoint**: `DELETE /members/{userId}`
- **설명**: 회원 정보를 삭제합니다.
- **권한**: 본인만 가능

**Response**:

```json
{
  "success": "boolean",
  "message": "회원 탈퇴가 완료되었습니다."
}
```

### 3.3 회원 정보 수정

- **Endpoint**: `PUT /members/{id}`
- **설명**: 새로운 회원을 등록합니다.
- **권한**: 로그인한 유저

**Request Body**:

```tsx
{
	"email" : "string(max:100, format:email)",
	"nickname" : "string(min:2, max:20, pattern:^[a-zA-Z0-9]+$)",
	"password" : "string(min:2, max:100)"
}
```

**Response**:

```tsx
{
	"success": "boolean",
  "data": {
	  "id" : "number",
	  "emial" : "string",
	  "nickname" : "string",
	  "status" : "string",
	  "role" : "string",
	  "last_login_at" : "string(datetime)"
  }
}
```

### 3.4 로그인

- **Endpoint**: `POST /members`
- **설명**: 새로운 회원을 등록합니다.
- **권한**: 없음

**Request Body**:

```tsx
{
	"email" : "string(max:100, format:email)",
	"password" : "string(min:2, max:100)",
}
```

**Response**:

```tsx
{
	"success": "boolean",
  "data": {
	  "id" : "number",
	  "emial" : "string",
	  "nickname" : "string",
	  "status" : "string",
	  "role" : "string",
	  "last_login_at" : "string(datetime)"
  }
}
```

### 3.3 회원 상세 조회

- **Endpoint**: `GET /members/{id}`
- **설명**: 회원의 상세 정보를 조회합니다.
- **권한**: 없음

**Response**:

```json
{
  "success": "boolean",
  "data": {
    "userId": "string",
    "nickname": "string",
    "createdAt": "string(datetime)",
    "boardPosts": [
      {
        "id": "string",
        "title": "string",
        "createdAt": "string(datetime)"
      }
    ]
  }
}
```

## 4. Boards API

### 4.1 게시글 등록

- **Endpoint**: `POST /boards`
- **설명**: 새로운 게시글을 등록합니다.
- **권한**: 로그인 사용자

**Request Body**:

```json
{
  "title": "string(max:100)",
  "description": "string(max:5000)",
  "author": {
    "type": "string(enum: USER, ADMIN)",
    "nickname": "string(min:2, max:20, pattern:^[a-zA-Z0-9]+$)"
  },
  "categories": ["number"],
  "attachments": ["string(file)"],
  "isPublic": "boolean"
}
```

**Response**:

```json
{
  "success": "boolean",
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "author": {
      "type": "string",
      "nickname": "string"
    },
    "createdAt": "string(datetime)"
  }
}
```

### 4.2 게시글 목록 조회

- **Endpoint**: `GET /boards`
- **설명**: 게시글 목록을 조회합니다.
- **권한**: 로그인 사용자

**Query Parameters**:

```json
{
	"keyword" : "string" (게시판명/게시자 검색어)
	"category" : "string"
	"page" : "number" (default: 1) 
	"size" : "number" (default: 20)
	"sort" : "string" (enum: CREATED_AT_DESC, CREATED_AT_ASC, VIEWS_DESC)
}
```

**Response**:

```json
{
  "success": "boolean",
  "data": {
    "content": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "author": {
          "type": "string",
          "nickname": "string"
        },
        "createdAt": "string(datetime)",
        "viewCount": "number",
        "likeCount": "number",
        "commentCount": "number"
      }
    ],
    "pageInfo": {
      "currentPage": "number",
      "totalPages": "number",
      "totalElements": "number",
      "size": "number"
    }
  }
}
```

### 4.3 게시글 상세 조회

- **Endpoint**: `GET /boards/{boardId}/{memberId}`
- **설명**: 특정 게시글의 상세 정보를 조회합니다.
- **권한**: 로그인 사용자

**Response**:

```json
{
  "success": "boolean",
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "author": {
      "type": "string",
      "nickname": "string"
    },
    "createdAt": "string(datetime)",
    "updatedAt": "string(datetime)",
    "viewCount": "number",
    "likeCount": "number",
    "commentCount": "number",
    "attachments": ["string"],
    "categories": ["string"],
    "isPublic": "boolean"
  }
}
```

### 4.4 게시글 수정

- **Endpoint**: `PUT /boards/{boardId}/{memberId}`
- **설명**: 게시글 정보를 수정합니다.
- **권한**: 게시글 작성자만 가능

**Request Body**:

```json
{
  "title": "string(max:100)",
  "description": "string(max:5000)",
  "categories": ["number"],
  "attachments": ["string(file)"],
  "isPublic": "boolean"
}
```

**Response**:

```json
{
  "success": "boolean",
  "data": {
    "id": "string",
    "updatedAt": "string(datetime)"
  }
}
```

### 4.5 게시글 삭제

- **Endpoint**: `DELETE /boards/{boardId}/{memberId}`
- **설명**: 게시글을 삭제합니다.
- **권한**: 게시글 작성자만 가능

**Response**:

```json
{
  "success": "boolean",
  "message": "게시글이 삭제되었습니다."
}
```

### 4.6 게시글 공개 여부 수정

- **Endpoint**: `PATCH /boards/{boardId}/{memberId}/visibility`
- **설명**: 게시글의 공개/비공개 상태를 변경합니다.
- **권한**: 게시글 작성자만 가능

**Response**:

```json
{
  "success": "boolean",
  "data": {
    "id": "string",
    "isPublic": "boolean",
    "updatedAt": "string(datetime)"
  }
}
```

## 5. 보안 정책

### 5.1 인증 - 계획

- JWT 기반 인증 사용
- Access Token 유효기간: 1시간
- Refresh Token 유효기간: 2주

### 5.2 Rate Limiting

- IP 당 분당 100회 요청 제한

### 5.3 CORS 정책

- 허용된 도메인만 접근 가능
- JWT 기반 인증과 함께 추가 예정
- 기본 설정:

```
Access-Control-Allow-Origin: https://example.com 
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization
```

## 6. 에러 코드

```
400: Bad Request - 잘못된 요청
401: Unauthorized - 인증 필요
403: Forbidden - 권한 없음
404: Not Found - 리소스 없음
409: Conflict - 리소스 충돌
429: Too Many Requests - 요청 횟수 초과
500: Internal Server Error - 서버 오류

```

## 7. 데이터 제약사항

- 이메일: RFC 5322 표준 준수
- 닉네임: 영문, 숫자 조합 (2-20자)
- 게시글 제목: 최대 100자
- 게시글 내용: 최대 5000자
- 첨부파일: 최대 10MB, jpg, png, pdf 형식만 허용

## 8. 변경 이력

- 2024-11-15: 최초 작성
- API 구조 정의
- 응답 형식 표준화
- 보안 정책 추가
