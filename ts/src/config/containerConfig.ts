// src/config/container.ts
import "reflect-metadata";
import { container } from "tsyringe";
import { Member } from '@router/members.router';
import { Board } from '@router/boards.router';
import { memberController } from "@controller/members.controller";
import { MemberService } from "@services/members.service";
import { MemberRepository } from "@repository/members.repository";
import { 
  Board_likes, 
  BoardCategoryRepository, 
  BoardRepository 
} from "@repository/boards.repository";
import { boardController } from "@controller/boards.controller";
import { BoardSevice } from "@services/boards.service";

export class ContainerConfig {
  static configure(): void {
    // Controllers
    container.register("memberController", memberController);
    container.register("boardController", boardController);

    // Services
    container.register("MemberService", MemberService);
    container.register("BoardSevice", BoardSevice);

    // Repositories
    container.register("MemberRepository", MemberRepository);
    container.register("BoardRepository", BoardRepository);
    container.register("BoardCategoryRepository", BoardCategoryRepository);
    container.register("Board_likes", Board_likes);
  }

  static getContainer() {
    return container;
  }
}

// singleton instance export
export const diContainer = container;