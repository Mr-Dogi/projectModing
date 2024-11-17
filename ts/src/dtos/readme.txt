DTO (Data Transfer Object):

클라이언트와 서버 간의 데이터 전송을 위한 객체
필요한 데이터만 선택적으로 포함
데이터 검증 규칙 포함 가능
민감한 정보 제외 가능
여러 모델의 데이터를 조합 가능

## 사용 예시

// dtos/user.dto.ts

// 사용자 생성을 위한 DTO
export class CreateUserDto {
    @IsEmail()
    email: string;

    @MinLength(8)
    password: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;
}

// 사용자 응답을 위한 DTO (비밀번호 제외)
export class UserResponseDto {
    id: number;
    email: string;
    fullName: string;
    createdAt: Date;
    role: string;

    static fromModel(user: User): UserResponseDto {
        return {
            id: user.id,
            email: user.email,
            fullName: `${user.firstName} ${user.lastName}`,
            createdAt: user.createdAt,
            role: user.role
        };
    }
}

// controllers/user.controller.ts
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        // DTO를 통해 입력 데이터 검증
        const user = await this.userService.createUser(createUserDto);
        // Model을 DTO로 변환하여 응답
        return UserResponseDto.fromModel(user);
    }

    @Get(':id')
    async getUser(@Param('id') id: number) {
        const user = await this.userService.findById(id);
        // 민감한 정보를 제외한 DTO로 변환
        return UserResponseDto.fromModel(user);
    }
}

// services/user.service.ts
export class UserService {
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        // DTO를 Model로 변환
        const user = new User();
        user.email = createUserDto.email;
        user.password = await hashPassword(createUserDto.password);
        user.firstName = createUserDto.firstName;
        user.lastName = createUserDto.lastName;

        return await this.userRepository.save(user);
    }

    async getUserProfile(userId: number): Promise<UserProfileDto> {
        // 여러 Model의 데이터를 조합하여 DTO 생성
        const user = await this.userRepository.findById(userId);
        const posts = await this.postRepository.findByUserId(userId);
        const lastLogin = await this.loginRepository.getLastLogin(userId);

        return {
            id: user.id,
            fullName: user.getFullName(),
            email: user.email,
            posts: posts.map(post => PostSummaryDto.fromModel(post)),
            lastLogin
        };
    }
}



## model 과 dto 간 차이 점

주요 차이점:

목적:
Model: 비즈니스 로직과 데이터베이스 상호작용
DTO: 데이터 전송과 API 인터페이스 정의

구조:
Model: 전체 데이터 구조와 비즈니스 메서드 포함
DTO: 필요한 데이터만 선택적으로 포함

검증:
Model: 데이터베이스 수준의 검증
DTO: API 요청/응답 수준의 검증

보안:
Model: 모든 데이터 포함
DTO: 민감한 정보 제외 가능

유연성:
Model: 데이터베이스 스키마에 종속
DTO: 클라이언트 요구사항에 맞춤 설계 가능

사용해야 하는 경우:

Model 사용:
데이터베이스 작업
비즈니스 로직 처리
도메인 규칙 적용

DTO 사용:
API 요청/응답 처리
데이터 검증
클라이언트에 맞춤 데이터 구조 제공
민감한 정보 필터링