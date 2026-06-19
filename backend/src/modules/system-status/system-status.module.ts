import { Module } from '@nestjs/common';
import { SystemStatusController } from './controllers/system-status/system-status.controller';
import { SystemStatusService } from './services/system-status/system-status.service';

@Module({
  controllers: [SystemStatusController],
  providers: [SystemStatusService],
})
export class SystemStatusModule {}
