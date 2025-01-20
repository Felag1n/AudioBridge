import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseIntPipe,
  } from '@nestjs/common';
  import { CommentsService } from './comments.service';
  import { CreateCommentDto } from './dto/create-comment.dto';
  import { UpdateCommentDto } from './dto/update-comment.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { User } from '../common/decorators/user.decorator';
  
  @Controller('comments')
  export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createCommentDto: CreateCommentDto, @User('id') userId: number) {
      return this.commentsService.create(createCommentDto, userId);
    }
  
    @Get('track/:trackId')
    findByTrackId(@Param('trackId', ParseIntPipe) trackId: number) {
      return this.commentsService.findByTrackId(trackId);
    }
  
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateCommentDto: UpdateCommentDto,
      @User('id') userId: number,
    ) {
      return this.commentsService.update(id, updateCommentDto, userId);
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id', ParseIntPipe) id: number, @User('id') userId: number) {
      return this.commentsService.remove(id, userId);
    }
  }