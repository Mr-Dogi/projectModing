import { BaseBoardResponseDto, BoardDetailResponseDto, BoardListDataDto, BoardStateUpdateResponseDto, BoardUpdateResponseDto, CommonResponseDto, CreateBoardDto, SearchBoardDto, UpdateBoardDto } from '@/dtos/borads.dto';
import { HttpException } from '@/exceptions/httpException';
import { BoardSevice } from '@/services/boards.service';
import { NextFunction, Request, Response } from 'express';

export class boardController {
    boardService: BoardSevice;

    constructor(){
        this.boardService = new BoardSevice();
    }

    public createBoard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const newBoard: CreateBoardDto = req.body;
            const board:BaseBoardResponseDto | null = await this.boardService.createBoard(newBoard);
            if(!board) throw new HttpException(409, "생성에 실패하였습니다.")

            const result: CommonResponseDto<BaseBoardResponseDto> = {
                success: true,
                data : board
            }
            res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }

    public searchBoard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            
            const filter: SearchBoardDto = req.body;
            const boardList: BoardListDataDto | null = await this.boardService.searchBoards(filter);
            if(!boardList) throw new HttpException(409, "생성에 실패하였습니다.");

            const result: CommonResponseDto<BoardListDataDto> = {
                success: true,
                data : boardList
            }
            res.status(200).json(result)
        } catch(error){
            next(error)
        }
    }

    public BoardDetail = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
        try {
            const boardId = req.params.boardId;
            const memberId = req.params.memberId;

            const board: BoardDetailResponseDto | null = await this.boardService.getBoardDetail(Number(boardId),Number(memberId));
            if(!board) throw new HttpException(409, "조회에 실패하였습니다.");

            const result: CommonResponseDto<BoardDetailResponseDto> = {
                success: true,
                data : board
            }
            res.status(200).json(result)
        }catch(error){
            next(error)
        }
    }

    public updateBoard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const boardId = req.params.boardId;
            const memberId = req.params.memberId;
            const newBoard: UpdateBoardDto = req.body;
            const board: BoardUpdateResponseDto | null = await this.boardService.updateBoard(Number(boardId),Number(memberId),newBoard);
            if(!board) throw new HttpException(409, "수정에 실패하였습니다.");

            const result: CommonResponseDto<BoardUpdateResponseDto> = {
                success: true,
                data : board
            }
            res.status(200).json(result)
        } catch(error){
            next(error)
        }
    }

    public deleteBoard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const boardId = req.params.boardId;
            const memberId = req.params.memberId;
            const board: boolean = await this.boardService.boardDelete(Number(boardId),Number(memberId));
            if(!board) throw new HttpException(409,"삭제에 실패하였습니다.")
            
            const result: CommonResponseDto<null> = {
                success: true,
                message: "게시글이 삭제되었습니다."
            }
            res.status(200).json(result)
        } catch(error){
            next(error)
        }
    }

    public toggleState = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const boardId = req.params.boardId;
            const memberId = req.params.memberId;
            const board: BoardStateUpdateResponseDto | null = await this.boardService.togglePublicState(Number(boardId),Number(memberId));
            if(!board) throw new HttpException(409,"공개여부 수정에 실패하였습니다.")
            
            const result: CommonResponseDto<BoardStateUpdateResponseDto> = {
                success: true,
                data : board
            }
            res.status(200).json(result)
        } catch(error){
            next(error)
        }
    }
}