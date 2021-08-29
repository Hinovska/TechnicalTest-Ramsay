export type Student = {
    id: number;
    username: string;
    firstName: string,
    lastName: string,
    age: number,
    career: string,
}

export type Response = {
    data?: Array<Student>;
    message?: string;
    statusCode?: string;
}

export type APICredentials = {
    username: string;
    password: string;
}

export class TryAgain {
    Attempts: number;
    Seconds: number;
    constructor() {
        this.Attempts = 10;
        this.Seconds = 5;
    }
}