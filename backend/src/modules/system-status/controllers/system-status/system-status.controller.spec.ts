import { Test, TestingModule } from '@nestjs/testing';
import { SystemStatusController } from './system-status.controller';
import { SystemStatusService } from '../../services/system-status/system-status.service';

describe('SystemStatusController', () => {
  let systemStatusController: SystemStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemStatusController],
      providers: [SystemStatusService],
    }).compile();

    systemStatusController = module.get<SystemStatusController>(
      SystemStatusController,
    );
  });

  it('should return the backend status', () => {
    const status = systemStatusController.getStatus();

    expect(status.name).toBe('backend');
    expect(status.status).toBe('ok');
    expect(typeof status.timestamp).toBe('string');
  });
});
