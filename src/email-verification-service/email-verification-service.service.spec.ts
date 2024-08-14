import { Test, TestingModule } from '@nestjs/testing';
import { EmailVerificationService } from './email-verification-service.service';

describe('EmailVerificationServiceService', () => {
  let service: EmailVerificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailVerificationService],
    }).compile();

    service = module.get<EmailVerificationService>(EmailVerificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
