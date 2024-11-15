import { Router } from 'express';

export interface Routes {
    path ?: string
    router : Router

    // 라우팅 경로 설정 
    initializeRoutes() : void
}