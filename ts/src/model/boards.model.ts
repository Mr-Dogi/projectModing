
// 기본 게시판 테이블 스키마
export interface boards {
    id : number,
    member_id : number,
    title : string,
    content : string,
    status : string,
    is_public : boolean,
    view_count : number,
    like_count : number,
    comment_count : number,
    created_at : Date,
    updated_at : Date,
    deleted_at : Date
}

// 게시판 카테로기 스키마
export interface categories {
    id : number,
    name : string,
    parent_id : number | undefined
    depth : number,
    created_at : Date
}

// 게시판 - 카테고리 매칭
export interface board_categories {
    noard_id : number,
    category_id : number
}

// 게시판 좋아요 테이블 스키마
export interface board_likes {
    board_id : number,
    member_id : number,
    created_at : Date
}

// 게시판 댓글 테이블 스키마
export interface comments {
    id : number,
    board_id : number,
    member_id : number,
    parent_id : number | undefined
    content : string,
    status : string,
    created_at : Date,
    updated_at : Date,
    deleted_at : Date
}