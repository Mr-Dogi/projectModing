import { Router } from 'express';
import { Routes } from '@interfaces/route.interface';
import { boardController } from '@/controller/boards.controller';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CreateBoardDto, SearchBoardDto, UpdateBoardDto } from '@/dtos/borads.dto';


export class User implements Routes {
    path = '/boards'
    router = Router();
    board = new boardController();

    constructor() {
        this.initializeRoutes();
      }

    // 컨트롤러 등록
    initializeRoutes(): void {
        this.router.get(`${this.path}`, ValidationMiddleware(SearchBoardDto),this.board.searchBoard);
        this.router.get(`${this.path}/:boardId(\\d+)/:memberId(\\d+)`,this.board.BoardDetail);
        this.router.post(`${this.path}`, ValidationMiddleware(CreateBoardDto),this.board.createBoard);
        this.router.put(`${this.path}/:boardId(\\d+)/:memberId(\\d+)`,ValidationMiddleware(UpdateBoardDto),this.board.updateBoard);
        this.router.patch(`${this.path}/:boardId(\\d+)/:memberId(\\d+)`,this.board.toggleState);
        this.router.delete(`${this.path}/:boardId(\\d+)/:memberId(\\d+)`, this.board.deleteBoard);
    }
    
}