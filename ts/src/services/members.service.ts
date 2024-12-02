import { Member, MemberStatus } from "@/model/members.model";
import { MemberRepository } from "@repository/members.repository"
import { BoardRepository } from "@repository/boards.repository"
import { HttpException } from "@exceptions/httpException"
import { BoardBriefDto, CreateMemberDto, MemberDetailDto } from "@dtos/members.dto"
import * as bcrypt from 'bcrypt';

export class MemberService {
    memberRepository: MemberRepository;
    boardRepository : BoardRepository;

    constructor(){
        this.memberRepository = new MemberRepository()
        this.boardRepository = new BoardRepository();
    }

    // 회원가입 로직
    public async createUser(member : CreateMemberDto): Promise<Member | null>{
        try{
            // 이메일 중복 유효성 검사
            let result = await this.memberRepository.findByEmail(member.email)
            if (result) throw new HttpException(409, "User doesn't exist");

            // 닉네임 중복 유효성 검사
            let existingNickname = await this.memberRepository.findByNickname(member.nickname)
            if (existingNickname) throw new HttpException(409, '이미 존재하는 닉네임입니다.')

            const hashedPassword = await bcrypt.hash(member.password, 10);

            // MemberFactory 사용 고려 필요
            let newMember : Partial<Member> = {
                email : member.email,
                nickname : member.nickname,
                password : hashedPassword
            }
            // 맴버 생성
            let createMember = await this.memberRepository.create(newMember)
            if (!createMember) throw new HttpException(500, '회원 생성에 실패했습니다.');

            // 민감한 정보 제거 후 반환
            const { password, ...memberWithoutPassword } = createMember;
            return memberWithoutPassword as Member

        } catch(error) {
            // 로그 유틸리티 호출문
            throw error;
        }
        
    }

    // 회원 탈퇴 로직
    public async deleteUser(userId : number): Promise<boolean>{
        try{
            // 회원 존재 여부 확인
            const existingMember = await this.memberRepository.findById(userId);
            if (!existingMember) {
                throw new HttpException(404, '존재하지 않는 회원입니다.');
            }

            // Soft Delete 처리
            const deleteResult = await this.memberRepository.update(userId, {
                status: MemberStatus.DELETED,
                deleted_at: new Date()
            });

            if (!deleteResult) {
                throw new HttpException(500, '회원 탈퇴 처리에 실패했습니다.');
            }

            return true;
        } catch(error){
            // 로그 유틸리티 호출문
            throw error;
        }
        
    }

    // 회원 상세 조회
    public async findUser(id : number): Promise<MemberDetailDto | null>{
        try{
            let findMember = await this.memberRepository.findById(id)

            if (!findMember) throw new HttpException(409, "User doesn't exist") ;
    
            // 삭제된 회원 체크
            if (findMember.status === 'DELETED') {
                throw new HttpException(410, '탈퇴한 회원입니다.');
            }
    
            let memberBoardList: BoardBriefDto[] = [];
            let boardList = await this.boardRepository.findByMemberId(id);
            if(boardList){
                memberBoardList = boardList.map((board):BoardBriefDto=>{
                 const boardDto = {
                    id: board.id.toString(),
                    title: board.title,
                    createdAt: board.created_at.toISOString()
                 }  
                 return  boardDto;})
            }

            // 민감한 정보 제거
            const { password, ...memberWithoutPassword} = findMember;
            const meber = memberWithoutPassword as Member
            const memberDetail: MemberDetailDto = {
                userId: meber.id.toString(),
                email: meber.email,
                nickname: meber.nickname,
                createdAt: meber.created_at.toISOString(),
                boardPosts : memberBoardList.length >= 0 ? memberBoardList : undefined,
            }

            return memberDetail;
        } catch(error){
            // 로그 유틸리티 호출문
            throw error;
        }
        
    }

    // 회원 가입 로직
    public async updateUser(userId : number, updateMember : Partial<Member>) : Promise<Member | null>{
        try {
            if(updateMember.email){
                let result = await this.memberRepository.findByEmail(updateMember.email)
                if (result) throw new HttpException(409, "User doesn't exist");
            }
            
            if (updateMember.nickname){
                let existingNickname = await this.memberRepository.findByNickname(updateMember.nickname)
                if (existingNickname) throw new HttpException(409, "User doesn't exist");
            }
    
            const updatedMember = await this.memberRepository.update(userId, {
                ...updateMember,
                updated_at: new Date()
            });
    
            if (!updatedMember) {
                throw new HttpException(500, '회원 정보 수정에 실패했습니다.');
            }
    
            const { password, ...memberWithoutPassword } = updatedMember;
            return memberWithoutPassword as Member;
        } catch(error){
            // 로그 유틸리티 호출문
            throw error;
        }
    }

    // 로그인 로직
    public async login(email : string, updatePassword : string): Promise<Member | null>{
        try {
            const member = await this.memberRepository.findByEmail(email)
            if (!member) throw new HttpException(401, '이메일이 일치하지 않습니다.');

            const isPasswordValid = await bcrypt.compare(updatePassword, member.password);
            if (!isPasswordValid) throw new HttpException(401, '비밀번호가 일치하지 않습니다');
            
            const updatedMember = await this.memberRepository.update(member.id,{
                last_login_at : new Date()
            })

            if(!updatedMember) throw new HttpException(401, '로그인 정보 갱신에 실패하였습니다');
            
            const { password, ...memberWithoutPassword } = updatedMember;
            return memberWithoutPassword as Member

            // 패스워드 검사
        } catch(error){
            // 로그 유틸리티 호출문
            throw error;
        }
    }
}