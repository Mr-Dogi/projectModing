import { Router } from 'express';
import { Routes } from '@interfaces/route.interface';

export class User implements Routes {
    path?: string | undefined;
    router: Router;

    // 기존 정보 생성
    constructor(){
        this.path = '/user'
        this.router = Router();
    }

    // 컨트롤러 등록
    initializeRoutes(): void {

    }
    
}