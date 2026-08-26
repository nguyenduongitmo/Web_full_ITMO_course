export class CreateFeedbackDto {
    fullName: string = '';
    email: string = '';
    comment: string = '';
    rating: number | string ='';
    tourId?: string;
    userId?: string;
}
