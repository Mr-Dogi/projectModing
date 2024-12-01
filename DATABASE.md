## 데이터베이스 스키마 문서

### 목차
* 사용자 members
* 게시판 Boards
* 카테고리 종류 Categories 
* 게시글 카테고리 정보 Board_categories
* 게시글 첨파일 Board_Attachments
* 게시글 좋아요 Board_Likes
* 게시글 댓글 Comments

## 사용자

### 테이블 명칭 : `members`
| 필드명 | 타입 | 필수 | 기본값 | 설명 |
| ------------ | ------------- | --- | --- | --- |
| id | BIGINT  | YES | auto | 고유 ID |  
| email | VARCHAR(100) | YES | 유니크 | email |
| nickname | VARCHAR(20) | YES | 유니크 | 별칭 |
| password | VARCHAR(200) | YEST | 암호화 | 암호 |
| status | VARCHAR(20) | YES | 'ACTIVE' | 활성화 상태 |
| role | VARCHAR(20) | YES | 'USER' | 권한 |
| last_login_at | DATETIME | NO |  | 접속 시간 |
| created_at | DATETIME | YES | CURRENT | 가입 시간 |
| updated_at | DATETIME | YES | CURRENT | 정보 갱신 시간 |

### 제약 조건
* emial과 nickname은 유니크한 키값이여야 한다.
* password hash를 통하여 암호화된 데이터를 저장하여야한다.

### 예시 문서
```
{
    "id" : 1,
    "email" : "admin@example.com",
    "nickname" : "admim",
    "password" : "$2a$10$xxxx",
    "status" : "ACTIVE",
    "role" : "ADMIN",
    "last_login_at" "2024-11-30 10:00:00",
    "created_at" : "2024-11-30 10:00:00",
    "updated_at" : "2024-11-30 10:00:00",
}
```

## 게시글

### 테이블 명칭 : `boards`
| 필드명 | 타입 | 필수 | 기본값 | 설명 |
| ------------ | ------------- | --- | --- | --- |
| id | BIGINT | YES | auto | 고유 ID |
| member_id | BIGINT | YES |  | 작성자 고유 ID |  
| title | VARCHAR(100) | YES |  | 제목 |  
| content | TEXT | NO |  | 내용 |  
| status | VARCHAR(20) | YES | 'ACTIVE' | 게시 상태 정보 |  
| is_public | BOOLEAN | YES | true | 공개 여부 정보 |  
| view_count | INT | YES | 0 | 조회수 정보 | 
| like_count | INT | YES | 0 | 좋아요수 정보 |  
| comment_count | INT | YES | 0 | 댓글수 정보 |  
| created_at | DATETIME | YES | CURRENT | 생성 시간 정보 |  
| updated_at | DATETIME | YES | CURRENT | 업데이트 시간 정보 |  
| deleted_at | DATETIME | NO |  | 삭제 시간 정보 |  

### 예시 문서
```
{
    "id" : 1,
    "member_id" : 1,
    "title" : "게인 글쓰기",
    "cotent" : "비공개 게시글 입니다",
    "status" : "ACTIVE",
    "is_piblic" : false,
    "view_couunt" : 25,
    "like_count" : 3,
    "comment_count" : 2,
    "created_at" : "2024-12-05 10:00:00",
    "updated_at" : "2024-12-06 10:00:00",
    "deleted_at" : NULL,
```

## 카테고리 종류

## 테이블 명칭 : `Categories`
| 필드명 | 타입 | 필수 | 기본값 | 설명 |
| ------------ | ------------- | --- | --- | --- |
| id | BIGINT | YES | auto | 고유 ID |
| name | VARCHAR(50) | YES |  | 명칭 |
| parent_id | BIGINT | NO |  | 상위 카테고리 ID |
| depth | INT | YES | 0 | 카테고리 깊이 |
| created_at | DATETIME | YES | CURRENT | 생성 시간 정보 |

## 제약 조건
* parent_id가 존재하는 경우 카테고리의 깊이를 명시아여햐 한다.
* Front에서 동적으로 깊이를 표현하기 위한 식별자이다.

### 예시 문서
```
{
    "id" : 1,
    "name" "일반게시판": ,
    "partend_id" : NULL,
    "depth" : 0,
    "created_at" : "2024-11-30 10:00:00",
}
```

## 게시글 카테고리 정보

### 테이블 명칭 : `board_categories`
| 필드명 | 타입 | 필수 | 기본값 | 설명 |
| ------------ | ------------- | --- | --- | --- |
| board_id | BIGINT | YES |  | 게시글 고유 ID |
| category_id | BIGINT | YES |  | 카테고리 항목 고유 ID |

### 예시 문서
```
{
    "board_id" : 1,
    "category_id" : 7,
}
```

## 게시글 첨부파일

### 테이블 명칭 : `board_attachments`
| 필드명 | 타입 | 필수 | 기본값 | 설명 |
| ------------ | ------------- | --- | --- | --- |
| id | BIGINT | YES | auto | 첨부파일 고유 ID |
| board_id | BIGINT | YES |  | 게시글 고유 ID |
| file_name | VARCHAR(255) | YES |  | 파일명칭 |
| file_path | VARCHAR(500) | YES |  | 저장 경로 |
| file_size | BIGINT | YES |  | 데이터 사이즈 |
| file_type | VARCHAR(100) | YES |  | 파일 타입 |
| created_at | DATETIME | YES | CURRENT | 생성 시간 |

### 예시 문서
```
{
    "id" : 1,
    "board_id" : 1,
    "file_name" : "오류스크린샷.png",
    "file_path" : "/fules/2024/11/error.png",
    "file_size" : 393216,
    "file_type" : image/png,
    "created_at" :"2024-12-05 10:00:00",
}
```

## 게시글 좋아요

### 테이블 명칭 : `board_likes`
| 필드명 | 타입 | 필수 | 기본값 | 설명 |
| ------------ | ------------- | --- | --- | --- |
| board_id | BIGINT | YES |  | 게시글 고유 ID |
| member_id | BIGINT | YES |  | 사용자 고유 ID |
| created_at | DATETIME | YES |  | 생성 시간 |

### 예시 문서
```
{
    "board_id" : 1,
    "member_id" : 3,
    "created_at" : "2024-12-05 11:00:00",
}
```

## 게시글 댓글

### 테이블 명칭: `comments`
| 필드명 | 타입 | 필수 | 기본값 | 설명 |
| ------------ | ------------- | --- | --- | --- |
| id | BIGINT | YES | auto | 고유 ID |
| board_id | BIGINT | YES |  | 게시글 ID |
| member_id | BIGINT | YES |  | 사용자 ID |
| parent_id | BIGINT | NO |  | 부모 댓글 ID |
| content | TEXT | YES |  | 내용 |
| created_at | DATETIME | YES | CURRENT | 생성 시간 |
| updated_at | DATETIME | YES | CURRENT | 갱신 시간 |
| deleted_at | DATETIME | NO |  | 삭제 시간 |

## 제약 조건
* parent_id가 존재하는 경우에만 필수로 명시되어야 한다
* 그렇지 않다면 계층형 구조를 생성할 없다.

### 예시 문서
```
{
    "id" : 1,
    "board_id" : 1,
    "member_id" : 3,
    "parent_id" : NULL,
    "cotent" : "좋은 정보 감사합니다",
    "created_at" : "2024-12-05 11:00:00",
    "updated_at" : "2024-12-05 11:00:00",
    "deleted_at" : NULL,
}
```

## 테이블 관계도
```
erDiagram
    members  ||--o{ boards : member_id
    boards   }o--o{ categories : 
    boards   ||--o{ comments : board_id
    members  ||--o{ comments : belongs_to
    comments ||--o{ comments : contains
    boards   ||--o{ board_attachemnts
    members  }o--o{ board_lkes
```

## 인덱스 정보
