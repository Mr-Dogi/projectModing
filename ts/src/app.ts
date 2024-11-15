import express, { Request, Response } from 'express';
 
const app = express();
const port = 3000;
 
export class App{
  public app : express.Application;
  public env: string;
  public port : string | number;

  // any 타입은 추후 사용자 지정 라우터를 받도록 선언 예정
  constructor(routes : any[]){
    this.app = express();
    this.port = 3000
    this.env = 'development'

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
    
  }

  // 중간 목적의 함수
  private initializeMiddlewares(){
    this.app.use()
  }

  // 
  private initializeRoutes(routes: any[]){
    routes.forEach(route => {
      this.app.use('/',route.routes);
    });
  }

  private initializeErrorHandling(){
    this.app.use();
  }
}