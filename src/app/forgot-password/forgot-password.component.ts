import { Component, ElementRef,  HostListener,  OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import { Howl } from 'howler';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit{

  forgotPasswordForm: any = FormGroup;
  responseMessage:any;
  alertSound:any = Howl;
  isBlinking:boolean = false;

  constructor(private formBuilder:FormBuilder,
    private userService:UserService,
    public dialogRef:MatDialogRef<ForgotPasswordComponent>,
    private ngxService:NgxUiLoaderService,
    private snackbarService:SnackbarService,
    private elementRef: ElementRef){
      this.dialogRef.disableClose = true;
      this.alertSound = new Howl({
        src: ['../../assets/alert.wav'], volume: 1.0,
      });
    }

    @HostListener('document:click', ['$event'])
    handleOutsideClick(event: Event){
      if(!this.elementRef.nativeElement.contains(event.target))
      this.playAlertSound();
      this.startBlinking();
    }
  playAlertSound() {
    this.alertSound.play();
  }
  startBlinking() {
    this.isBlinking = true;
    setTimeout(() => {
      this.isBlinking = false;
    }, 50);
  }

    

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]]
    })
  }

  handleSubmit(){
    this.ngxService.start();
    var formData = this.forgotPasswordForm.value;
    var data = {
      email:formData.email
    }
    this.userService.forgotPassword(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.dialogRef.close();
      this.snackbarService.openSnackBar(this.responseMessage,"");
    },(error)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage=error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.generateError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

}
