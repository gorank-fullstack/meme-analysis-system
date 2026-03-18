import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  if (process.env.NODE_ENV === 'development') {
    // 开发模式
    console.log('开发模式，启用：CORS（跨域资源共享）')
    
    // ✅ 启用 CORS，允许所有来源访问（开发环境推荐）
    app.enableCors();
  }else if (process.env.NODE_ENV === 'production') {
    // 生产模式
    console.log('生产模式，在未绑定域名单。启用：CORS（跨域资源共享）')
    app.enableCors();
  }

  // await app.listen(process.env.PORT ?? 3000);
  // await app.listen(process.env.PORT ?? 3018);
  await app.listen(process.env.PORT ?? 3018, '0.0.0.0');
}
bootstrap();
