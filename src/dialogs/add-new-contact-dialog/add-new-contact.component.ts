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
  selector: 'app-add-new-contact',
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
  templateUrl: './add-new-contact-dialog.component.html',
  styleUrl: './add-new-contact-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewContactDialogComponent {
  private _snackBar = inject(MatSnackBar);
  data = inject(MAT_DIALOG_DATA);
  groups = [...new Set(CONTACTS_MOCK.map((contact) => contact.group))];
  form: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    group: new FormControl('', [Validators.required]),
  });
  constructor(
    private contactsService: ContactsService,
    public dialogRef: MatDialogRef<AddNewContactDialogComponent>
  ) {}
  submit() {
    if (this.form.valid) {
      this.contactsService.addNewContact({
        ...this.form.value,
        id: this.contactsService.getContacts$().getValue().length + 1,
      });
      this.dialogRef.close();
      this.openSnackBar('Successfully added a new contact', 'Close');
    }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2500 });
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
