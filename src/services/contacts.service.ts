import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Contact } from '../models/contact.model';
import { CONTACTS_MOCK } from '../mock/contacts.mock';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private contacts$: BehaviorSubject<Contact[]> = new BehaviorSubject<
    Contact[]
  >(CONTACTS_MOCK);
  constructor() {}

  public getContacts$(): BehaviorSubject<Contact[]> {
    return this.contacts$;
  }
  public addNewContact(contact: Contact) {
    this.contacts$.next([...this.contacts$.getValue(), contact]);
  }
  public editContact(updatedContact: Contact) {
    const currentContacts = this.contacts$.getValue();

    const contactIndex = currentContacts.findIndex(
      (contact) => contact.id === updatedContact.id
    );

    if (contactIndex !== -1) {
      currentContacts[contactIndex] = updatedContact;

      this.contacts$.next(currentContacts);
    }
  }

  public deleteContact(contactId: number) {
    const currentContacts = this.contacts$.getValue();
    const updatedContacts = currentContacts.filter(
      (contact) => contact.id !== contactId
    );
    this.contacts$.next(updatedContacts);
  }
}
