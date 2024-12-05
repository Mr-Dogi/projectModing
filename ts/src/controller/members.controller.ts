import { CommonResponseDto, CreateMemberDto, MemberDetailDto, LoginMemberInfo } from '@/dtos/members.dto';
import { HttpException } from '@/exceptions/httpException';
import { Member } from '@/model/members.model';
import { MemberService } from '@/services/members.service';
import { NextFunction, Request, Response } from 'express';

export class memberController {
    memberService: MemberService;

    constructor(){
        this.memberService = new MemberService();
    }

    public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const newUser: CreateMemberDto = req.body;
            const member: Member | null = await this.memberService.createUser(newUser);
            if(!member) throw new HttpException(409, "생성에 실패하였습니다.")

            const result:CommonResponseDto<Member> = {
                success: true,
                data: member
            }

            res.status(200).json(result);
        } catch (error) {
          next(error);
        }
    };

    public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // 파라미터 숫자 값인지 검사 필요
            const memberId = req.params.id;
            const deleteUser = await this.memberService.deleteUser(Number(memberId))
            if(!deleteUser) throw new HttpException(409, "삭제에 실패하였습니다.")

            const result:CommonResponseDto<null> = {
                success: true,
                message: "회원 탈퇴가 완료되었습니다."
            }
            
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
    
    public findUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const memberId = req.params.id;
            const member = await this.memberService.findUser(Number(memberId))
            if(!member) throw new HttpException(404, "조회된 유저가 없습니다.")

            const result:CommonResponseDto<MemberDetailDto> = {
                success: true,
                data: member
            }

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const memberId = req.params.id;
            const newMember: CreateMemberDto = req.body;
            const member = await this.memberService.updateUser(Number(memberId),newMember)
            if(!member) throw new HttpException(409,"업데이트에 실패하였습니다.");

            const result:CommonResponseDto<Member> = {
                success: true,
                data: member
            }

            res.status(200).json(result);
        } catch(error){
            next(error)
        }
    }

    public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const loginMemberInfo: LoginMemberInfo = req.body;
            const findMember = await this.memberService.login(loginMemberInfo);
            if(!findMember) throw new HttpException(404, '존재하지 않는 회원입니다.')

            const result:CommonResponseDto<Member> = {
                success: true,
                data: findMember
            }
    
            res.status(200).json(result);
        } catch(error){
            next(error)
        }
    }
}