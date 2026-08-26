export class CreateContactDto {
    fullName: string = '';
    email: string = '';
    phone?: string;
    interest?: string; 
    destination?: string;
    budget?: string;
    travelDate?: string; 
    message: string = '';
    subscribe?: boolean;
}