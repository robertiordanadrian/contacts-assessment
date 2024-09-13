import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { ContactsService } from '../../services/contacts.service';
import { Contact } from '../../models/contact.model';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { AddNewContactDialogComponent } from '../../dialogs/add-new-contact-dialog/add-new-contact.component';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AdvancedFilterDialogComponent } from '../../dialogs/advanced-filter-dialog/advanced-filter-dialog.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsComponent {
  @Output() onSelectedContact: EventEmitter<Contact> = new EventEmitter();

  public groupedContacts$: Observable<{ [key: string]: Contact[] }>;
  public searchControl = new FormControl('');
  dialog = inject(MatDialog);

  private filterCriteria = { name: '', group: '' };

  constructor(private contactsService: ContactsService) {
    this.groupedContacts$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((searchTerm: any) =>
        this.contactsService.getContacts$().pipe(
          map((contacts) => this.filterContacts(contacts, searchTerm)),
          map((filteredContacts) => this.groupByFirstLetter(filteredContacts))
        )
      ),
      switchMap((groupedContacts$) => groupedContacts$)
    );
  }

  private filterContacts(contacts: Contact[], searchTerm: string): Contact[] {
    if (
      !searchTerm &&
      !this.filterCriteria.name &&
      !this.filterCriteria.group
    ) {
      return contacts;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return contacts.filter(
      (contact) =>
        (contact.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
          contact.lastName.toLowerCase().includes(lowerCaseSearchTerm)) &&
        (!this.filterCriteria.group ||
          contact.group === this.filterCriteria.group)
    );
  }

  private groupByFirstLetter(contacts: Contact[]): {
    [key: string]: Contact[];
  } {
    return contacts.reduce((groups, contact) => {
      const firstLetter = contact.firstName.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(contact);
      return groups;
    }, {} as { [key: string]: Contact[] });
  }

  getGroupKeys(groupedContacts: { [key: string]: Contact[] }): string[] {
    return Object.keys(groupedContacts);
  }

  onContactClick(contact: Contact) {
    this.onSelectedContact.emit(contact);
  }

  openAddNewContactDialog() {
    this.dialog.open(AddNewContactDialogComponent);
  }

  openAdvancedFilterDialog() {
    const dialogRef = this.dialog.open(AdvancedFilterDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.filterCriteria = result;
        this.applyAdvancedFilter();
      }
    });
  }

  applyAdvancedFilter() {
    this.searchControl.setValue(this.filterCriteria.name || '');
  }

  clearAdvancedFilter() {
    this.filterCriteria.group = '';
    this.filterCriteria.name = '';
    this.searchControl.setValue('');
  }
}
