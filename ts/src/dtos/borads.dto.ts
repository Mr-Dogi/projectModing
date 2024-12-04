import { Transform, Type, Expose } from 'class-transformer';
import {  
  IsString, 
  IsNotEmpty, 
  MinLength, 
  MaxLength, 
  Min,
  Max,
  IsIn,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsInt
} from 'class-validator';

// 공통 Author 인터페이스
export class Author {
    @IsString()
    @IsNotEmpty()
    type!: 'USER' | 'ADMIN';
  
    @IsString()
    @IsNotEmpty()
    nickname!: string;
  }
  
// PageInfo를 class로 변경
export class PageInfo {
    @IsNumber()
    @Min(1)
    currentPage!: number;

    @IsNumber()
    @Min(1)
    totalPages!: number;

    @IsNumber()
    @Min(0)
    totalElements!: number;

    @IsNumber()
    @Min(1)
    size!: number;
}

// 공통 응답 wrapper DTO
export class CommonResponseDto<T> {
    @Expose()
    success!: boolean;

    @Expose()
    @Type(() => Object)
    data?: T;

    @Expose()
    message?: string;

    // @Expose()
    // timestamp!: string;

    // @Expose()
    // statusCode!: number;
}

// 게시판 생성 DTO
export class CreateBoardDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    title!: string;

    @IsString()
    @MaxLength(5000)
    description!: string;

    @ValidateNested()
    @Type(() => Author)
    author!: Author;

    @IsArray()
    @IsInt({ each: true }) // 각 항목이 숫자여야 함
    category!: number[];

    @IsArray()
    @IsString({ each: true })
    attachments!: string[];

    @IsBoolean()
    isPublic!: boolean;
}

// 게시판 검색 DTO
export class SearchBoardDto {

    @IsString()
    @IsOptional()
    keyword?: string;

    @IsInt()
    @IsOptional()
    category?: number;

    @IsNumber()
    @Min(1)
    @Transform(({ value }) => value ? Number(value) : 1)
    page: number = 1;  // 기본값 설정

    @IsNumber()
    @Min(1)
    @Max(100)
    @Transform(({ value }) => value ? Number(value) : 20)
    size: number = 20;  // 기본값 설정

    @IsString()
    @IsIn(['CREATED_AT_DESC', 'CREATED_AT_ASC', 'VIEWS_DESC'])
    sort: string = 'CREATED_AT_DESC';  // 기본값 설정
}

// 게시판 응답 기본 DTO
export class BaseBoardResponseDto {
    @Expose()
    id!: string;

    @Expose()
    title!: string;

    @Expose()
    description!: string;

    @Expose()
    @ValidateNested()
    @Type(() => Author)
    author!: Author;

    @Expose()
    @Transform(({ value }) => value.toISOString())
    createdAt!: string;
}

// 게시판 목록 아이템 DTO
export class BoardListItemDto extends BaseBoardResponseDto {
    @Expose()
    @Min(0)
    viewCount!: number;
  
    @Expose()
    @Min(0)
    likeCount!: number;
  
    @Expose()
    @Min(0)
    commentCount!: number;
}
  


// 게시판 목록 데이터 DTO
export class BoardListDataDto {
    @Expose()
    @ValidateNested({ each: true })
    @Type(() => BoardListItemDto)
    content!: BoardListItemDto[];

    @Expose()
    @ValidateNested()
    @Type(() => PageInfo)
    pageInfo!: PageInfo;
}

// 게시판 상세 응답 DTO
export class BoardDetailResponseDto extends BaseBoardResponseDto {
    @Expose()
    @Transform(({ value }) => value.toISOString())
    updatedAt!: string;

    @Expose()
    @Min(0)
    viewCount!: number;

    @Expose()
    @Min(0)
    likeCount!: number;

    @Expose()
    @Min(0)
    commentCount!: number;

    @Expose()
    @IsArray()
    @IsString({ each: true })
    attachments!: string[];

    @Expose()
    @IsArray()
    @IsInt({ each: true })
    category!: number[];

    @Expose()
    @IsBoolean()
    isPublic!: boolean;
}

// 게시판 수정 DTO
export class UpdateBoardDto {
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(100)
    title?: string;

    @IsString()
    @IsOptional()
    @MaxLength(5000)
    description?: string;

    @IsArray()
    @IsOptional()
    @IsInt({ each: true })
    category?: number[];

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    attachments?: string[];

    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;
}

// 게시판 수정 응답 DTO
export class BoardUpdateResponseDto {
    @Expose()
    id!: string;

    @Expose()
    @Transform(({ value }) => value.toISOString())
    updatedAt!: string;
}

// 게시판 삭제 응답 DTO (오타 수정)
export class BoardDeleteResponseDto {
    @Expose()
    success!: boolean;  // string에서 boolean으로 변경

    @Expose()
    message!: string;
}

export class BoardStateUpdateResponseDto {
    @Expose()
    id!: string;
    @Expose()
    isPublic!: boolean;
    @Expose()
    @Transform(({ value }) => value.toISOString())
    updatedAt!: string;
}

// 최종 게시판 목록 응답 DTO
export class BoardListResponseDto extends CommonResponseDto<BoardListDataDto> {
    @Expose()
    @ValidateNested()
    @Type(() => BoardListDataDto)
    declare data: BoardListDataDto;
}
  