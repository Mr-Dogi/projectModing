import { IsDate, IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';
import { Member } from '@model/members.model';

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

// 게시판 상태 enum
export enum BoardStatus {
    ACTIVE = 'ACTIVE',
    DELETED = 'DELETED'
}

// 댓글 상태 enum
export enum CommentStatus {
    ACTIVE = 'ACTIVE',
    DELETED = 'DELETED'
}

// 기본 게시판 모델
export class Board extends TimeStampModel {
    @IsNumber()
    id!: number;

    @IsNumber()
    member_id!: number;

    @IsString()
    title!: string;

    @IsString()
    description!: string;

    @IsString()
    status!: BoardStatus;

    @IsBoolean()
    is_public!: boolean;

    @IsNumber()
    view_count!: number;

    @IsNumber()
    like_count!: number;

    @IsNumber()
    comment_count!: number;

    // Relation fields
    category?: CategoryInfo[];
    likes?: BoardLike[];
    comments?: Comment[];
    @IsNumber()
    categoryId ?: number;

    constructor(partial: Partial<Board>) {
        super();
        Object.assign(this, partial);
    }
}

//카테고리 모델
export class CategoryInfo {
    @IsNumber()
    id!: number;

    @IsString()
    name!: string;

    @IsNumber()
    @IsOptional()
    parent_id?: number;

    @IsNumber()
    depth!: number;

    @IsDate()
    created_at!: Date;

    // Relation fields
    parent?: CategoryInfo;
    children?: CategoryInfo[];
    boards?: Board[];

    constructor(partial: Partial<CategoryInfo>) {
        Object.assign(this, partial);
    }
}

// 게시판-카테고리 연결 모델
export class BoardCategory {
    @IsNumber()
    board_id!: number;

    @IsNumber()
    category_id!: number;

    // Relation fields
    board?: Board;
    category?: CategoryInfo;

    constructor(partial: Partial<BoardCategory>) {
        Object.assign(this, partial);
    }
}

// 게시판 좋아요 모델
export class BoardLike {
    @IsNumber()
    board_id!: number;

    @IsNumber()
    member_id!: number;

    @IsDate()
    created_at!: Date;

    // Relation fields
    board?: Board;
    member?: Member;

    constructor(partial: Partial<BoardLike>) {
        Object.assign(this, partial);
    }
}

// 댓글 모델
export class Comment extends TimeStampModel {
    @IsNumber()
    id!: number;

    @IsNumber()
    board_id!: number;

    @IsNumber()
    member_id!: number;

    @IsNumber()
    @IsOptional()
    parent_id?: number;

    @IsString()
    content!: string;

    @IsString()
    status!: CommentStatus;

    // Relation fields
    board?: Board;
    member?: Member;
    parent?: Comment;
    children?: Comment[];

    constructor(partial: Partial<Comment>) {
        super();
        Object.assign(this, partial);
    }
}


export const toBoard = (row: any): Board => {
    const board = new Board({
        id : row.id,
        member_id : row.member_id,
        title : row.title,
        description : row.content,
        status : row.status,
        is_public : row.is_public,
        view_count : row.view_count,
        like_count : row.like_count,
        comment_count : row.comment_count
    })
    return board
}

export const toBoardCategoryes = (row : any): BoardCategory => {
    const boardCategories = new BoardCategory({
        board_id : row.board_id,
        category_id : row.category_id
    })
    return boardCategories
}

export const toBoardLike = (row : any): BoardLike => {
    const boardLike = new BoardLike({
        board_id : row.board_id,
        member_id : row.member_id,
        created_at : new Date(row.created_at)
    })
    return boardLike
}