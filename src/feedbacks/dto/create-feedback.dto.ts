export class CreateFeedbackDto {
    name: string ='';
    email: string ='';
    comment: string ='';
    rating?: number;
    tourId?:string;
    userId?:string;
}
