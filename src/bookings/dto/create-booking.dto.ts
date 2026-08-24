export class CreateBookingDto {
  userId: string ='';
  tourId: string ='';
  fullName: string ='';
  email: string='';
  phone: string='';
  travelDate: string='';
  passengers: number=0;
  status?: string='';
}