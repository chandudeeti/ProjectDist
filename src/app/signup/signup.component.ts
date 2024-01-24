import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderConfig, NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  password = true;
  confirmPassword = true;
  signupForm: any = FormGroup;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    public dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService,
    private dialog:MatDialog) { 
      this.dialogRef.disableClose = true;
    }

  ngOnInit(): void {
    console.log("Message from the ngOnInit")
    this.signupForm = this.formBuilder.group({
      
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    })
  }


  validateSubmit() {
   // console.log("Message from validateSubmit{}")
    //console.log("message from the signupForm"+this.signupForm)
    if (this.signupForm.controls['password'].value != this.signupForm.controls['confirmPassword'].value) {
      return true;
    } else {
      return false;
    }
  }

  handleSubmit(){
    
   // console.log("Message from handleSubmit{}")
    this.ngxService.start();
    var formData = this.signupForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password

    }
    
    this.userService.signup(data).subscribe((response:any)=>{
      debugger
      this.ngxService.stop();
      this.dialogRef.close();
      this.responseMessage=response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,'success');
      this.router.navigate(['/']);
      console.log("Message from the handleSubmit response: "+ response);
      console.log("Message from the handleSubmit responseMessage: "+this.responseMessage)
    },(error)=>{
      this.ngxService.stop();
      if(error.error?.message){
        console.log("Message from the handleSubmit error: "+error.error?.message);
        this.responseMessage=error.error?.message;
      }else{
        this.responseMessage=GlobalConstants.generateError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  // handleLoginAction(){
  //   const dialogConfig2 = new MatDialogConfig();
  //   dialogConfig2.width = "550px"
  //   this.dialog.open(LoginComponent,dialogConfig2);
  // }

}