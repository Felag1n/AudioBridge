import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    ParseIntPipe,
  } from '@nestjs/common';
  import { ChatService } from './chat.service';
  import { CreateMessageDto } from './dto/create-message.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { User } from '../common/decorators/user.decorator';
  
  @Controller('chat')
  @UseGuards(JwtAuthGuard)
  export class ChatController {
    constructor(private readonly chatService: ChatService) {}
  
    @Post('messages')
    async createMessage(
      @Body() createMessageDto: CreateMessageDto,
      @User('id') userId: number,
    ) {
      return this.chatService.createMessage(createMessageDto, userId);
    }
  
    @Get('messages/:otherId')
    async getMessages(
      @User('id') userId: number,
      @Param('otherId', ParseIntPipe) otherId: number,
    ) {
      return this.chatService.getMessages(userId, otherId);
    }
  
    @Post('messages/read/:otherId')
    async markAsRead(
      @User('id') userId: number,
      @Param('otherId', ParseIntPipe) otherId: number,
    ) {
      return this.chatService.markAsRead(userId, otherId);
    }
  }