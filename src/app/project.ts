/* This file defines the structure of the messages from the server to the client */

/* The structure used by the server when it sends project info */
export interface Project {
    id: number;
    userId: number;
    name: string;
    deadline: Date;
}

/* The structure used by the server when it sends client info */
export interface User {
    id: number;
    fname: string;
    lname: string;
}

/* The structure used by the server for sending data */
export interface Response {
    type: string;
    result: object;
}
