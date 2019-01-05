import { User } from './user';
import { Action } from './action';

export class Message {
    from?: User;
    content?: any; //will usually hold what is sent from the client
    action?: Action;
    debugMessage?: string; //will hold information from the server being sent to the client
}
