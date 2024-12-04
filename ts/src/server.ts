import { App } from './app';
import { Member } from '@router/members.router';
import { Board } from '@router/boards.router';
import 'reflect-metadata';

const app = new App([new Member(), new Board()]);

app.listen();