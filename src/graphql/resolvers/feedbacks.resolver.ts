import {Resolver, Query, Mutation, Args, ID} from '@nestjs/graphql'
import { FeedbacksService } from '../../feedbacks/feedbacks.service'
import { Feedback } from '../types/feedback.type'
import { CreateFeedbackInput } from '../inputs/create-feedback.input'
import { UpdateFeedbackInput } from '../inputs/update-feedback.input'
import { NotFoundException } from '@nestjs/common'

@Resolver(() => Feedback)
export class FeedbacksResolver{
    constructor (private readonly feedbacksService: FeedbacksService){}

    @Query(() => [Feedback], {name: 'feedbacks'})
    async getFeebacks(){
        return this.feedbacksService.findAll();
    }

    @Query(() => Feedback, { name: 'feedback' })
    async getFeedback(@Args('id', { type: () => ID }) id: string) {
        const feedback = await this.feedbacksService.findOne(id);
        if (!feedback) {
            throw new NotFoundException(`Feedback ${id} not found`);
        }
        return feedback;
    }

    @Mutation(() => Feedback, { name: 'createFeedback' })
    async createFeedback(@Args('input') createFeedbackInput: CreateFeedbackInput) {
        return this.feedbacksService.create(createFeedbackInput);
    }

    @Mutation(() => Feedback, { name: 'updateFeedback' })
    async updateFeedback(
        @Args('id', { type: () => ID }) id: string,
        @Args('input') updateFeedbackInput: UpdateFeedbackInput,
    ) {
        return this.feedbacksService.update(id, updateFeedbackInput);
    }

    @Mutation(() => Feedback, { name: 'deleteFeedback' })
    async deleteFeedback(@Args('id', { type: () => ID }) id: string) {
        return this.feedbacksService.remove(id);
    }
}