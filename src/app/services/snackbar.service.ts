import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackbar: MatSnackBar) { }

  openSnackBar(message: string, action: string) {
    let panelClass = '';

    if (action === 'error') {
      panelClass = 'error-snackbar';
    } else {
      panelClass = 'success-snackbar';
    }

    const snackBarConfig = {
      horizontalPosition: 'center' as MatSnackBarHorizontalPosition,
      verticalPosition: 'top' as MatSnackBarVerticalPosition,
      duration: 2000,
      panelClass: [panelClass]
    };

    this.snackbar.open(message, '', snackBarConfig);
  }
}

