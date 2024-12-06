import "reflect-metadata";
import express from 'express';
import { logger, stream } from '@utile/logger';
import { ErrorMiddleware, RateLimit } from '@middlewares/error.middleware'
import { PORT } from '@config/index';
import morgan from 'morgan';
import { container } from "tsyringe";
import { BoardSevice } from '@services/boards.service';
import { BoardRepository } from "@repository/boards.repository";
 
export class App{
  public app : express.Application;
  public env: string;
  public port : string | number;

  // any 타입은 추후 사용자 지정 라우터를 받도록 선언 예정
  constructor(routes : any[]){
    this.app = express();
    this.port = PORT || 7001
    this.env = 'development'

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  // 중간 목적의 함수
  private initializeMiddlewares(){
    this.app.use(morgan("dev", { stream }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(RateLimit)
  }

  // 
  private initializeRoutes(routes: any[]){
    routes.forEach(route => {
      this.app.use('/',route.routes);
    });
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}