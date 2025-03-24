import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'app', 
      protoPath: 'proto/app.proto',
      url: 'localhost:50051',
    },
  });

  await app.listen();
  console.log('gRPC Microservice is running on port 50051');
}
bootstrap();
