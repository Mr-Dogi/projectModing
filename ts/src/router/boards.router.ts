import { Router } from 'express';
import { Routes } from '@interfaces/route.interface';
import { boardController } from '@/controller/boards.controller';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CreateBoardDto, SearchBoardDto, UpdateBoardDto } from '@/dtos/borads.dto';


export class Board implements Routes {
    path = '/boards'
    routes = Router();
    board = new boardController();

    constructor() {
        this.initializeRoutes();
      }

    // 컨트롤러 등록
    initializeRoutes(): void {
        this.routes.get(`${this.path}`, ValidationMiddleware(SearchBoardDto),this.board.searchBoard);
        this.routes.get(`${this.path}/:boardId(\\d+)/:memberId(\\d+)`,this.board.BoardDetail); // 
        this.routes.post(`${this.path}`, ValidationMiddleware(CreateBoardDto, false, true, false),this.board.createBoard);  //검증
        this.routes.put(`${this.path}/:boardId(\\d+)/:memberId(\\d+)`,ValidationMiddleware(UpdateBoardDto),this.board.updateBoard);
        this.routes.patch(`${this.path}/:boardId(\\d+)/:memberId(\\d+)`,this.board.toggleState);
        this.routes.delete(`${this.path}/:boardId(\\d+)/:memberId(\\d+)`, this.board.deleteBoard);
    }
    
}