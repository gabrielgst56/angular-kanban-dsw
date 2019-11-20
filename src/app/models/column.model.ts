import { Task } from './task.model';

export class Column {
    constructor(public name: string, public isToDo: boolean, public tasks: Task[]) {}
}