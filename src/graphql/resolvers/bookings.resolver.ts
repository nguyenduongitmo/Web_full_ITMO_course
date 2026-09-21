import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { BookingsService } from '../../bookings/bookings.service';
import { Booking } from '../types/booking.type';
import { CreateBookingInput } from '../inputs/create-booking.input';
import { UpdateBookingInput } from '../inputs/update-booking.input';
import { NotFoundException } from '@nestjs/common';
import { Tour } from '../types/tour.type';
import { ToursService } from '../../tours/tours.service';

@Resolver(() => Booking)
export class BookingsResolver {
    constructor(private readonly bookingsService: BookingsService, private readonly toursService: ToursService,) { }

    @Query(() => [Booking], { name: 'bookings' })
    async getBookings() {
        return this.bookingsService.findAll();
    }

    @Query(() => Booking, { name: 'booking' })
    async getBooking(@Args('id', { type: () => ID }) id: string) {
        const booking = await this.bookingsService.findOne(id);
        if (!booking) {
            throw new NotFoundException(`Booking ${id} not found`);
        }
        return booking;
    }

    @Mutation(() => Booking, { name: 'createBooking' })
    async createBooking(@Args('input') createBookingInput: CreateBookingInput) {
        return this.bookingsService.create(createBookingInput);
    }

    @Mutation(() => Booking, { name: 'updateBooking' })
    async updateBooking(
        @Args('id', { type: () => ID }) id: string,
        @Args('input') updateBookingInput: UpdateBookingInput,
    ) {
        return this.bookingsService.update(id, updateBookingInput);
    }

    @Mutation(() => Booking, { name: 'deleteBooking' })
    async deleteBooking(@Args('id', { type: () => ID }) id: string) {
        return this.bookingsService.remove(id);
    }

    @ResolveField(() => Tour, { name: 'tour', nullable: true })
    async getTour(@Parent() booking: Booking) {
    return this.toursService.findOne(booking.tourId);
  }
}