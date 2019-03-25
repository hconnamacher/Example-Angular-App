export interface Project {
    id: number;
    userId: number;
    name: string;
    deadline: Date;
}

export interface User {
    id: number;
    fname: string;
    lname: string;
}

export interface Response {
    type: string;
    result: object;
}
