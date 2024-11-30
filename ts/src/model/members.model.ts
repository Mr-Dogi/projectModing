import { 
    IsDate, 
    IsEmail, 
    IsString, 
    IsEnum, 
    IsOptional, 
    IsNumber, 
    MinLength, 
    MaxLength, 
    Matches 
} from 'class-validator';
import { Board, BoardLike } from '@model/boards.model';

// 멤버 상태 enum
export enum MemberStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED'
}

// 멤버 역할 enum
export enum MemberRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

// 공통 타임스탬프 베이스 모델
export abstract class TimeStampModel {
    @IsDate()
    created_at!: Date;

    @IsDate()
    @IsOptional()
    updated_at?: Date;

    @IsDate()
    @IsOptional()
    deleted_at?: Date;
}

// 멤버 모델
export class Member extends TimeStampModel {
    @IsNumber()
    id!: number;

    @IsEmail()
    @IsString()
    email!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @Matches(/^[a-zA-Z0-9]+$/)
    nickname!: string;

    @IsString()
    @MinLength(8)
    @MaxLength(100)
    password!: string;

    @IsEnum(MemberStatus)
    status!: MemberStatus;

    @IsEnum(MemberRole)
    role!: MemberRole;

    @IsDate()
    @IsOptional()
    last_login_at?: Date;

    // Relation fields
    boards?: Board[];
    comments?: Comment[];
    likes?: BoardLike[];

    constructor(partial: Partial<Member>) {
        super();
        Object.assign(this, partial);
    }

    // Utility methods
    isActive(): boolean {
        return this.status === MemberStatus.ACTIVE;
    }

    isAdmin(): boolean {
        return this.role === MemberRole.ADMIN;
    }

    canEdit(resourceOwnerId: number): boolean {
        return this.id === resourceOwnerId || this.isAdmin();
    }

    updateLastLogin(): void {
        this.last_login_at = new Date();
    }

    softDelete(): void {
        this.status = MemberStatus.DELETED;
        this.deleted_at = new Date();
    }

    deactivate(): void {
        this.status = MemberStatus.INACTIVE;
    }
}

// Member Factory (생성 패턴)
export class MemberFactory {
    static createMember(
        email: string,
        nickname: string,
        password: string,
        role: MemberRole = MemberRole.USER
    ): Member {
        return new Member({
            email,
            nickname,
            password,  // Note: 실제로는 암호화된 비밀번호가 들어가야 함
            status: MemberStatus.ACTIVE,
            role,
            created_at: new Date()
        });
    }
}

// 사용자 정의 Error 클래스
export class MemberError extends Error {
    constructor(
        public code: string,
        message: string,
        public status: number = 400
    ) {
        super(message);
        this.name = 'MemberError';
    }
}

export const toMember = (row: any) : Member => {
    const member = new Member({
        id: row.id,
        email: row.email,
        nickname: row.nickname,
        password: row.password,
        status: row.status,
        role: row.role,
        last_login_at: new Date(row.last_login_at), // 선택적 필드
    })

    return member
}