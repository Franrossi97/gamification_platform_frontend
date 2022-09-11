import { Email } from './../../shared/Email';
import { EmailSenderService } from './../../services/email-sender.service';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent implements OnInit {

  @Input() emailsToSend: Array<string>;
  @Output() cancelationEmitter = new EventEmitter<boolean>();
  private sendEmailForm: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder, private emailSenderService: EmailSenderService) { }

  ngOnInit(): void {
    this.createEmailForm();
  }

  createEmailForm() {
    this.sendEmailForm= this.fb.group({
      subject: new UntypedFormControl('', []),
      message: new UntypedFormControl('', [Validators.required])
    });
  }

  onSendEmail() {
    this.emailSenderService.sendEmail(new Email(null, this.emailsToSend,
      this.sendEmailForm.get('subject').value, this.sendEmailForm.get('message').value)).subscribe(res => {
        this.cancelEmailSender();
      }, err => {
        console.log(err.status);
      });
  }

  cancelEmailSender() {
    this.cancelationEmitter.emit(true);
  }

  getSendEmailForm() {
    return this.sendEmailForm;
  }
}
