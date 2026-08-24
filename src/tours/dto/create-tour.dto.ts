export class CreateTourDto {
    name: string = '';
    image: string = '';
    description: string = '';
    code: string = '';
    price: number = 0;
    duration?: string = '';
    isFeatured?: boolean = false;
}
