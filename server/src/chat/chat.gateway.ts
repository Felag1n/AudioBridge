import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { ChatService } from './chat.service';
  import { CreateMessageDto } from './dto/create-message.dto';
  
  @WebSocketGateway({
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
  })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private users: Map<number, string> = new Map();
  
    constructor(private readonly chatService: ChatService) {}
  
    handleConnection(client: Socket) {
      console.log('Client connected:', client.id);
    }
  
    handleDisconnect(client: Socket) {
      console.log('Client disconnected:', client.id);
      // Удаляем пользователя из карты подключений
      for (const [userId, socketId] of this.users.entries()) {
        if (socketId === client.id) {
          this.users.delete(userId);
          break;
        }
      }
    }
  
    @SubscribeMessage('join')
    handleJoin(client: Socket, userId: number) {
      this.users.set(userId, client.id);
    }
  
    @SubscribeMessage('message')
    async handleMessage(client: Socket, data: CreateMessageDto) {
      const { receiverId } = data;
      const senderId = this.getUserIdBySocketId(client.id);
  
      if (!senderId) {
        return;
      }
  
      const message = await this.chatService.createMessage(data, senderId);
  
      // Отправляем сообщение получателю, если он онлайн
      const receiverSocketId = this.users.get(receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('message', message);
      }
  
      // Отправляем подтверждение отправителю
      client.emit('message', message);
    }
  
    private getUserIdBySocketId(socketId: string): number | null {
      for (const [userId, id] of this.users.entries()) {
        if (id === socketId) {
          return userId;
        }
      }
      return null;
    }
  }