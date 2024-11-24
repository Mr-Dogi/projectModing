import { Transform, Type, Expose } from 'class-transformer';
import { 
  IsEmail, 
  IsString, 
  MinLength, 
  MaxLength, 
  Matches,
  ValidateNested
} from 'class-validator';
import { Member } from '@model/members.model'
import { Board } from '@model/boards.model'

// 게시글 정보 인터페이스를 클래스로 변경
export class BoardBriefDto {
  @Expose()
  @IsString()
  id!: string;

  @Expose()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title!: string;

  @Expose()
  @Transform(({ value }) => value.toISOString())
  createdAt!: string;
}

// 공통 응답 wrapper DTO
export class CommonResponseDto<T> {
  @Expose()
  success!: boolean;

  @Expose()
  @Type(() => Object)
  data!: T;

  @Expose()
  timestamp!: string;

  @Expose()
  statusCode!: number;
}

// 회원 생성 요청 DTO
export class CreateMemberDto {
  @IsEmail()
  @MaxLength(100)
  email!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: '닉네임은 영문자와 숫자만 사용할 수 있습니다.'
  })
  nickname!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: '비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다.'
  })
  password!: string;
}

// 기본 회원 정보 DTO
export class BaseMemberDto {
  @Expose()
  @IsString()
  userId!: string;

  @Expose()
  @IsEmail()
  email!: string;

  @Expose()
  @IsString()
  nickname!: string;

  @Expose()
  @Transform(({ value }) => value.toISOString())
  createdAt!: string;
}

// 회원 생성 응답 DTO
export class MemberResponseDto extends CommonResponseDto<BaseMemberDto> {
  @Expose()
  @ValidateNested()
  @Type(() => BaseMemberDto)
  declare data: BaseMemberDto;

  static fromModel(member: Member): MemberResponseDto {
    return {
      success: true,
      data: {
        userId: member.id.toString(),
        email: member.email,
        nickname: member.nickname,
        createdAt: member.created_at.toISOString()
      },
      timestamp: new Date().toISOString(),
      statusCode: 200
    };
  }
}

// 회원 상세 정보 DTO
export class MemberDetailDto extends BaseMemberDto {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => BoardBriefDto)
  boardPosts!: BoardBriefDto[];
}

// 회원 상세 조회 응답 DTO
export class MemberDetailResponseDto extends CommonResponseDto<MemberDetailDto> {
  @Expose()
  @ValidateNested()
  @Type(() => MemberDetailDto)
  declare data: MemberDetailDto;

  static fromModel(member: Member, boards: Board[]): MemberDetailResponseDto {
    return {
      success: true,
      data: {
        userId: member.id.toString(),
        email: member.email,
        nickname: member.nickname,
        createdAt: member.created_at.toISOString(),
        boardPosts: boards.map(board => ({
          id: board.id.toString(),
          title: board.title,
          createdAt: board.created_at.toISOString()
        }))
      },
      timestamp: new Date().toISOString(),
      statusCode: 200
    };
  }
}

// 회원 삭제 응답 DTO
export class MemberDeleteResponseDto extends CommonResponseDto<null> {
  @Expose()
  message!: string;
}