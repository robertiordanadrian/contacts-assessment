import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CONTACTS_MOCK } from '../../mock/contacts.mock';
import { ContactsService } from '../../services/contacts.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-contact',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './edit-contact-dialog.component.html',
  styleUrl: './edit-contact-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditContactDialogComponent {
  private _snackBar = inject(MatSnackBar);
  data = inject(MAT_DIALOG_DATA);
  groups = [...new Set(CONTACTS_MOCK.map((contact) => contact.group))];
  form: FormGroup = new FormGroup({
    firstName: new FormControl(this.data.firstName, [Validators.required]),
    lastName: new FormControl(this.data.lastName, [Validators.required]),
    group: new FormControl(this.data.group, [Validators.required]),
    id: new FormControl(this.data.id, [Validators.required]),
  });
  constructor(
    private contactsService: ContactsService,
    public dialogRef: MatDialogRef<EditContactDialogComponent>
  ) {}
  submit() {
    if (this.form.valid) {
      this.openSnackBar('Successfully edited the contact', 'Close');
      this.contactsService.editContact(this.form.value);
      this.dialogRef.close();
    }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2500 });
  }
  closeDialog(event: any) {
    event.preventDefault();
    this.dialogRef.close();
  }
}
