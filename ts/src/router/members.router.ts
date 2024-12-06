import { Router } from 'express';
import { Routes } from '@interfaces/route.interface';
import { memberController } from '@controller/members.controller';
import { inject, injectable } from 'tsyringe';

@injectable()
export class Member implements Routes {
    path = '/members'
    routes = Router();

    constructor(@inject(memberController) private member: memberController) {
        this.initializeRoutes();
    }

    // 컨트롤러 등록
    initializeRoutes(): void {
        this.routes.post(`${this.path}`, this.member.createUser);
        this.routes.get(`${this.path}/:id(\\d+)`, this.member.findUser);
        this.routes.delete(`${this.path}/:id(\\d+)`, this.member.deleteUser);
    }
    
}