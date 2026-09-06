import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ContactsService } from '../../contacts/contacts.service';
import { Contact } from '../types/contact.type';
import { CreateContactInput } from '../inputs/create-contact.input';
import { UpdateContactInput } from '../inputs/update-contact.input';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => Contact)
export class ContactsResolver {
    constructor(private readonly contactsService: ContactsService) { }

    @Query(() => [Contact], { name: 'contacts' })
    async getContacts() {
        return this.contactsService.findAll();
    }

    @Query(() => Contact, { name: 'contact' })
    async getContact(@Args('id', { type: () => ID }) id: string) {
        const contact = await this.contactsService.findOne(id);
        if (!contact) {
            throw new NotFoundException(`Contact ${id} not found`);
        }
        return contact;
    }

    @Mutation(() => Contact, { name: 'createContact' })
    async createContact(@Args('input') createContactInput: CreateContactInput) {
        return this.contactsService.create(createContactInput);
    }

    @Mutation(() => Contact, { name: 'updateContact' })
    async updateContact(
        @Args('id', { type: () => ID }) id: string,
        @Args('input') updateContactInput: UpdateContactInput,
    ) {
        return this.contactsService.update(id, updateContactInput);
    }

    @Mutation(() => Contact, { name: 'deleteContact' })
    async deleteContact(@Args('id', { type: () => ID }) id: string) {
        return this.contactsService.remove(id);
    }
}