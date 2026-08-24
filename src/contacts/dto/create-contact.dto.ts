export class CreateContactDto {
    name: string = '';
    email: string = '';
    phone?: string;
    destination?: string;
    budget?: string;
    message: string = '';
    subscribe?: boolean;
}