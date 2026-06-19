import { Controller, Get } from '@nestjs/common';
import { SystemStatusResponseDto } from '../../dto/system-status-response-dto/system-status-response.dto';
import { SystemStatusService } from '../../services/system-status/system-status.service';

@Controller('system-status')
export class SystemStatusController {
  constructor(private readonly systemStatusService: SystemStatusService) {}

  @Get()
  getStatus(): SystemStatusResponseDto {
    return this.systemStatusService.getStatus();
  }
}
