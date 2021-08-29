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
export enum ModalType {
    Alert = 1,
    Confirm = 2
}

export type ModalButton = {
    label: string;
    onClick?: () => void;
    className?: string;
}

export type Modal = {
    tittle: string;
    message: string;
    type: ModalType;
    buttonOK: ModalButton;
    buttomCancel?: ModalButton;
}