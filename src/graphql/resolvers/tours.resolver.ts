import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { ToursService } from '../../tours/tours.service';
import { BookingsService } from '../../bookings/bookings.service';
import { FeedbacksService } from '../../feedbacks/feedbacks.service';
import { Tour } from '../types/tour.type';
import { Booking } from '../types/booking.type';
import { Feedback } from '../types/feedback.type';
import { CreateTourInput } from '../inputs/create-tour.input';
import { UpdateTourInput } from '../inputs/update-tour.input';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => Tour)
//  Resolver này xử lý các query/mutation liên quan đến Tour
export class ToursResolver {
    constructor(private readonly toursService: ToursService,
        // inject ToursService để sử dụng lại logic nghiệp vụ từ REST
        private readonly bookingsService: BookingsService,
        private readonly feedbacksService: FeedbacksService,
    ) { }

    @Query(() => [Tour], { name: 'tours' })
    //  Định nghĩa query tên "tours" trả về array Tour
    async getTours(
        @Args('search', { nullable: true }) search?: string,
    ) {
        // dùng Args để Lấy tham số từ chuối truy vấn
        return this.toursService.findAll(search);
    }

    @Query(() => Tour, { name: 'tour' })
    async getTour(@Args('id', { type: () => ID }) id: string) {
        const tour = await this.toursService.findOne(id);
        if (!tour) {
            throw new NotFoundException(`Tour ${id} not found`);
        }
        return tour;
    }

    @Mutation(() => Tour, { name: 'createTour' })
    // dùng Mutation để Thay đổi dữ liệu
    async createTour(@Args('input') createTourInput: CreateTourInput) {
        // dùng Args('input') để GraphQL convention - gom params vào 1 object
        return this.toursService.create(createTourInput);
    }

    @Mutation(() => Tour, { name: 'updateTour' })
    async updateTour(
        @Args('id', { type: () => ID }) id: string,
        @Args('input') updateTourInput: UpdateTourInput,
    ) {
        return this.toursService.update(id, updateTourInput);
    }

    @Mutation(() => Tour, { name: 'deleteTour' })
    async deleteTour(@Args('id', { type: () => ID }) id: string) {
        return this.toursService.remove(id);
    }

    @ResolveField(() => [Booking], { name: "bookings" })
    async getBookings(@Parent() tour: Tour) {
        return this.bookingsService.findByTourId(tour.id);
    }

    @ResolveField(() => [Feedback], { name: 'feedbacks' })
    async getFeedbacks(@Parent() tour: Tour) {
        return this.feedbacksService.findByTourId(tour.id);
    }
}