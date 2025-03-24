import { Controller } from '@nestjs/common';
import { ChatService } from './chat.service';
import { GrpcMethod } from '@nestjs/microservices';


@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}
    @GrpcMethod('AppService', 'GetCompletion')
    async getCompletion(data: { document: string; retrievedSimilarDocuments: string[] }) {
      return await this.chatService.getCompletion(data.document, data.retrievedSimilarDocuments);
    }
}
