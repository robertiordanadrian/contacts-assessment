import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContactsComponent } from '../contacts/contacts.component';
import { Contact } from '../../models/contact.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EditContactDialogComponent } from '../../dialogs/edit-contact-dialog/edit-contact-dialog.component';
import { ContactsService } from '../../services/contacts.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, ContactsComponent, MatButtonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomepageComponent {
  private _snackBar = inject(MatSnackBar);

  dialog = inject(MatDialog);

  selectedContact: Contact | undefined;
  constructor(private contactsService: ContactsService) {}
  onSelectedContact(contact: Contact) {
    this.selectedContact = contact;
  }
  editContact(contact: Contact) {
    this.openEditContactDialog(contact);
  }
  openEditContactDialog(contact: Contact) {
    this.dialog.open(EditContactDialogComponent, {
      data: contact,
    });
  }
  deleteContact(contact: Contact) {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      this.contactsService.deleteContact(contact.id);
      this.selectedContact = undefined;
      this.openSnackBar('Successfully deleted the contact', 'Close');
    }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2500 });
  }
}
