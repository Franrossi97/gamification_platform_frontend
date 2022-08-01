export class Email {
  sender: string;
  reciever: Array<string>
  subject: string;
  message: string;

  constructor(sender: string, reciever: Array<string>, subject: string, message: string) {
    this.sender= sender;
    this.reciever= reciever;
    this.subject= subject;
    this.message= message
  }
}
