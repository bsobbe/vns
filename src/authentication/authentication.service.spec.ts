import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { PinoLogger } from 'nestjs-pino';
import { JwtService } from '@nestjs/jwt';
import { RefreshPayload } from 'src/lib/entities/refreshPayload.entity';

const mockPinoLogger = {
  setContext: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockCustomers = [
  {
    id: '9e391faf-64b2-4d4c-b879-463532920fd4',
    email: 'test@test.test',
    password: 'mock-password',
    activationCode: 'mock-activation-code',
  },
  {
    id: '9e391faf-64b2-4d4c-b879-463532920fd5',
    email: 'test1@test.test',
    password: 'mock-password',
  },
];

const mockRefreshPayload: RefreshPayload = {
  id: '9e391faf-64b2-4d4c-b879-463532920fd4',
  email: 'test@test.test',
};

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: PinoLogger, useValue: mockPinoLogger },
      ],
    }).compile();

    authenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authenticationService).toBeDefined();
  });

  it('generateAccessToken() should successfully generate an access token.', async () => {
    const customer = {
      ...mockCustomers[0],
      role: 'user',
      createdAt: new Date('2022-12-12'),
      updatedAt: new Date('2022-12-12'),
    };
    const expectedToken = 'jwt-correct';
    mockJwtService.sign.mockResolvedValue(expectedToken);

    const token = await authenticationService.generateAccessToken({
      ...customer,
      role: 'user',
      createdAt: new Date('2022-12-12'),
      updatedAt: new Date('2022-12-12'),
    });

    expect(token).toEqual(expectedToken);
    expect(mockJwtService.sign).toHaveBeenCalledWith(
      {
        id: customer.id,
        email: customer.email,
        role: customer.role,
      },
      { expiresIn: '1h' },
    );
  });

  it('generateAccessToken() should throw error when JWT signing fails.', async () => {
    const customer = {
      ...mockCustomers[0],
      role: 'user',
      createdAt: new Date('2022-12-12'),
      updatedAt: new Date('2022-12-12'),
    };
    const error = new Error('Signing failed');
    mockJwtService.sign.mockRejectedValue(error);

    await expect(
      authenticationService.generateAccessToken(customer),
    ).rejects.toThrow(error);
  });

  it('generateRefreshToken() should successfully generate an refresh token.', async () => {
    const customer = {
      ...mockCustomers[0],
      role: 'user',
      createdAt: new Date('2022-12-12'),
      updatedAt: new Date('2022-12-12'),
    };
    const expectedToken = 'jwt-correct';
    mockJwtService.sign.mockResolvedValue(expectedToken);

    const token = await authenticationService.generateRefreshToken({
      ...customer,
      role: 'user',
      createdAt: new Date('2022-12-12'),
      updatedAt: new Date('2022-12-12'),
    });

    expect(token).toEqual(expectedToken);
    expect(mockJwtService.sign).toHaveBeenCalledWith(
      {
        id: customer.id,
        email: customer.email,
      },
      { expiresIn: '7d' },
    );
  });

  it('generateRefreshToken() should throw error when JWT signing fails.', async () => {
    const customer = {
      ...mockCustomers[0],
      role: 'user',
      createdAt: new Date('2022-12-12'),
      updatedAt: new Date('2022-12-12'),
    };
    const error = new Error('Signing failed');
    mockJwtService.sign.mockRejectedValue(error);
    await expect(
      authenticationService.generateRefreshToken(customer),
    ).rejects.toThrow(error);
  });

  it('validatePassword() should return true for a valid password.', async () => {
    const validPassword = 'Password123!';
    const result = await authenticationService.validatePassword(validPassword);
    expect(result).toBeTruthy();
    expect(mockPinoLogger.error).not.toHaveBeenCalled();
  });

  it('validatePassword() should return false if the password is not valid.', async () => {
    const password = 'notvalid';
    const res = await authenticationService.validatePassword(password);
    expect(res).toEqual(false);
  });

  it('validateRefreshToken() should return the payload for a valid token.', async () => {
    mockJwtService.verify.mockResolvedValue(mockRefreshPayload);
    await expect(
      authenticationService.validateRefreshToken('valid.token'),
    ).resolves.toEqual(mockRefreshPayload);
  });

  it('validateRefreshToken() should throw and log a warning for an invalid token.', async () => {
    const error = new Error('Invalid token');
    mockJwtService.verify.mockRejectedValue(error);
    await expect(
      authenticationService.validateRefreshToken('invalid.token'),
    ).rejects.toThrow(error);
    expect(mockPinoLogger.warn).toHaveBeenCalledWith(
      'validateRefreshToken() invalid refresh token.',
      error,
    );
  });
});
