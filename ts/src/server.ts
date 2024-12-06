import "reflect-metadata";
import { App } from './app';
import { Member } from '@router/members.router';
import { Board } from '@router/boards.router';``
import { ContainerConfig, diContainer } from "@config/containerConfig";

ContainerConfig.configure();

const app = new App([diContainer.resolve(Member), diContainer.resolve(Board)]);
app.listen();

