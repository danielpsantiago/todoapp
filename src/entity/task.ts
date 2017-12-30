export default class Task {
    _id?: string
    name: string;
    createdAt?: Date;
    dueTo?: Date;
    completed: boolean;
    assigneeId: string;
    createdById?: string;
    deleted: boolean;
}