import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('AppService', 'GetCompletion')
  async getCompletion(data: { document: string; retrievedSimilarDocuments: string[] }) {
    return await this.appService.getCompletion(data.document, data.retrievedSimilarDocuments);
  }
}
