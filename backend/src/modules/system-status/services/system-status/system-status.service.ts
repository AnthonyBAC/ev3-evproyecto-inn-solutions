// Servicio de health check — retorna estado ok con timestamp actual
import { Injectable } from '@nestjs/common';
import { SystemStatusResponseDto } from '../../dto/system-status-response-dto/system-status-response.dto';

@Injectable()
export class SystemStatusService {
  getStatus(): SystemStatusResponseDto {
    return new SystemStatusResponseDto(
      'backend',
      'ok',
      new Date().toISOString(),
    );
  }
}
