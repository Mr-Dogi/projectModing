import { Router } from 'express';
import { Routes } from '@interfaces/route.interface';
import { memberController } from '@controller/members.controller';

export class Member implements Routes {
    path = '/members'
    routes = Router();
    member = new memberController();

    constructor() {
        this.initializeRoutes();
      }

    // 컨트롤러 등록
    initializeRoutes(): void {
        this.routes.post(`${this.path}`, this.member.createUser);
        this.routes.get(`${this.path}/:id(\\d+)`, this.member.findUser);
        this.routes.delete(`${this.path}/:id(\\d+)`, this.member.deleteUser);
    }
    
}