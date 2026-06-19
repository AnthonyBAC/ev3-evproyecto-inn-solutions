export class SystemStatusResponseDto {
  constructor(
    public readonly name: 'backend',
    public readonly status: 'ok',
    public readonly timestamp: string,
  ) {}
}
