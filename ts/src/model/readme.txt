Model (모델):

비즈니스 로직과 데이터베이스 스키마를 표현
데이터베이스 테이블의 구조를 반영
데이터 유효성 검사 규칙 포함
비즈니스 도메인 메서드 포함

## 사용 예시

// models/user.model.ts
export class User {
    id: number;
    email: string;
    password: string; // 민감한 정보 포함
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    role: string;

    // 비즈니스 로직 메서드
    getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    isAdmin(): boolean {
        return this.role === 'admin';
    }
}

## 데이터베이스와 연동하여 사용하기
// models/user.model.ts
export interface IUser {
    id?: number;
    email: string;
    username: string;
    password: string;
    created_at?: Date;
    updated_at?: Date;
}

// 데이터베이스 결과를 타입으로 변환하는 helper 함수

helper 함수를 통한 타입 변환
export const toUser = (row: any): IUser => ({
    id: row.id,
    email: row.email,
    username: row.username,
    password: row.password,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at)
});