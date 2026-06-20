// DTO de respuesta del health check — name, status y timestamp
export class SystemStatusResponseDto {
  constructor(
    public readonly name: 'backend',
    public readonly status: 'ok',
    public readonly timestamp: string,
  ) {}
}
