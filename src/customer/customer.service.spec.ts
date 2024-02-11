import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { PrismaService } from 'src/prisma.service';
import { PinoLogger } from 'nestjs-pino';
import {
  ActivationCustomerInput,
  GetCustomerInput,
  LoginCustomerInput,
  SignupCustomerInput,
} from './dto/customer.input';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('encryptedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'unique-id'),
}));

const mockPrisma = {
  customer: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
};

const mockPinoLogger = {
  setContext: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
};

const mockFindAllParams: GetCustomerInput = {
  skip: 0,
  take: 10,
  cursor: undefined,
  where: undefined,
  orderBy: undefined,
};

const mockSignupCustomerParams: SignupCustomerInput = {
  email: 'test@test.test',
  password: 'mock-password',
  passwordConfirmation: 'mock-password',
};

const mockActivationParams: ActivationCustomerInput = {
  email: 'test@test.test',
  password: 'mock-password',
  activationCode: 'mock-activation-code',
};

const mockLoginParams: LoginCustomerInput = {
  email: 'test@test.test',
  password: 'mock-password',
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

describe('CustomerService', () => {
  let customerService: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PinoLogger, useValue: mockPinoLogger },
      ],
    }).compile();

    customerService = module.get<CustomerService>(CustomerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(customerService).toBeDefined();
  });

  it('findAll() should return a list of customers on success.', async () => {
    mockPrisma.customer.findMany.mockResolvedValue(mockCustomers);
    const result = await customerService.findAll(mockFindAllParams);
    expect(result).toEqual(mockCustomers);
    expect(mockPrisma.customer.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      cursor: undefined,
      where: undefined,
      orderBy: { createdAt: 'desc' },
    });
  });

  it('findAll() should log an error and throw it on rejection.', async () => {
    const error = new Error('Database error');
    mockPrisma.customer.findMany.mockRejectedValue(error);
    await expect(customerService.findAll(mockFindAllParams)).rejects.toThrow(
      error,
    );
    expect(mockPinoLogger.error).toHaveBeenCalledWith(
      'findAll() failed to fetch customers.',
      error,
    );
  });

  it('findById() should return a customer on successful.', async () => {
    const id = mockCustomers[0].id;
    const expectedCustomer = mockCustomers[0];
    mockPrisma.customer.findFirst.mockResolvedValue(expectedCustomer);

    const result = await customerService.findById({ id });

    expect(result).toEqual(expectedCustomer);
    expect(mockPrisma.customer.findFirst).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('findById() should log an error and throw it on rejection.', async () => {
    const id = mockCustomers[0].id;
    const error = new Error('Database error');
    mockPrisma.customer.findFirst.mockRejectedValue(error);

    await expect(customerService.findById({ id })).rejects.toThrow(error);
    expect(mockPinoLogger.error).toHaveBeenCalledWith(
      'findById() failed to find customer.',
      error,
    );
  });

  it('findByEmail() should return a customer on successful.', async () => {
    const email = mockCustomers[0].email;
    const expectedCustomer = mockCustomers[0];
    mockPrisma.customer.findFirst.mockResolvedValue(expectedCustomer);

    const result = await customerService.findByEmail({ email });

    expect(result).toEqual(expectedCustomer);
    expect(mockPrisma.customer.findFirst).toHaveBeenCalledWith({
      where: { email },
    });
  });

  it('findByEmail() should log an error and throw it on rejection.', async () => {
    const email = mockCustomers[0].email;
    const error = new Error('Database error');
    mockPrisma.customer.findFirst.mockRejectedValue(error);

    await expect(customerService.findByEmail({ email })).rejects.toThrow(error);
    expect(mockPinoLogger.error).toHaveBeenCalledWith(
      'findByEmail() failed to find customer.',
      error,
    );
  });

  it('deleteById() should return the deleted customer on successful.', async () => {
    const id = mockCustomers[0].id;
    const expectedDeletedCustomer = mockCustomers[0]; // Mock response
    mockPrisma.customer.delete.mockResolvedValue(expectedDeletedCustomer);

    const result = await customerService.deleteById({ id });

    expect(result).toEqual(expectedDeletedCustomer);
    expect(mockPrisma.customer.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('deleteById() should log an error and throw it on rejection.', async () => {
    const id = mockCustomers[0].id;
    const error = new Error('Database error');
    mockPrisma.customer.delete.mockRejectedValue(error);

    await expect(customerService.deleteById({ id })).rejects.toThrow(error);
    expect(mockPinoLogger.error).toHaveBeenCalledWith(
      'deleteById() failed to delete customer.',
      error,
    );
  });

  it('updateById() should return the updated customer on successful.', async () => {
    const id = mockCustomers[0].id;
    const values = { email: mockCustomers[0].email };
    const expectedUpdatedCustomer = mockCustomers[0];
    mockPrisma.customer.update.mockResolvedValue(expectedUpdatedCustomer);

    const result = await customerService.updateById({ id, values });

    expect(result).toEqual(expectedUpdatedCustomer);
    expect(mockPrisma.customer.update).toHaveBeenCalledWith({
      where: { id },
      data: { ...values },
    });
  });

  it('updateById() should log an error and throw it on rejection.', async () => {
    const id = mockCustomers[0].id;
    const values = { email: mockCustomers[0].email };
    const error = new Error('Database error');
    mockPrisma.customer.update.mockRejectedValue(error);

    await expect(customerService.updateById({ id, values })).rejects.toThrow(
      error,
    );
    expect(mockPinoLogger.error).toHaveBeenCalledWith(
      'updateById() failed to update customer.',
      error,
    );
  });

  it('create() should create a customer and return it on success.', async () => {
    const params = mockSignupCustomerParams;
    const expectedCustomer = mockCustomers[0];
    mockPrisma.customer.create.mockResolvedValue(expectedCustomer);

    const result = await customerService.create(params);

    expect(result).toEqual(expectedCustomer);
    expect(mockPrisma.customer.create).toHaveBeenCalledWith({
      data: {
        id: expect.any(String),
        email: params.email,
        password: expect.any(String),
        activationCode: expect.any(String),
      },
    });
  });

  it('create() should log an error and throw it on rejection.', async () => {
    const params = mockSignupCustomerParams;
    const error = new Error('Database error');
    mockPrisma.customer.create.mockRejectedValue(error);

    await expect(customerService.create(params)).rejects.toThrow(error);
    expect(mockPinoLogger.error).toHaveBeenCalledWith(
      'create() failed to create customer.',
      error,
    );
  });

  it('activate() should activate the customer if password and activationCode match and return Customer.', async () => {
    customerService.findByEmail = jest.fn();
    const customer = { ...mockCustomers[0], active: true };
    const params = mockActivationParams;
    (customerService.findByEmail as jest.Mock).mockResolvedValue(customer);
    mockPrisma.customer.update.mockResolvedValue(customer);

    const result = await customerService.activate(params);

    expect(result).toBe(customer);
    expect(mockPrisma.customer.update).toHaveBeenCalledWith({
      where: { email: params.email },
      data: { isActive: true },
    });
  });

  it('activate() should return false if customer is not found.', async () => {
    customerService.findByEmail = jest.fn();
    const params = mockActivationParams;
    (customerService.findByEmail as jest.Mock).mockResolvedValue(null);

    const result = await customerService.activate(params);

    expect(result).toBe(false);
  });

  it('activate() should return false if password or activationCode do not match.', async () => {
    customerService.findByEmail = jest.fn();
    jest.mock('bcrypt', () => ({
      compare: jest.fn().mockResolvedValue(false),
    }));
    const customer = mockCustomers[0];
    customer.activationCode = 'wrong-code';
    const params = mockActivationParams;
    (customerService.findByEmail as jest.Mock).mockResolvedValue(customer);

    const result = await customerService.activate(params);

    expect(result).toBe(false);
  });

  it('login() should return false if customer is not found.', async () => {
    customerService.findByEmail = jest.fn();
    (customerService.findByEmail as jest.Mock).mockResolvedValue(null);
    const result = await customerService.login(mockLoginParams);
    expect(result).toBe(false);
  });

  it('login() should return customer on successful login.', async () => {
    customerService.findByEmail = jest.fn();
    const customer = {
      ...mockCustomers[0],
      isActive: true,
      activationCode: 'mock-activation-code',
    };
    (customerService.findByEmail as jest.Mock).mockResolvedValue(customer);
    const result = await customerService.login(mockLoginParams);
    expect(result).toEqual(customer);
  });

  it('login() should return false if customer is inactive.', async () => {
    customerService.findByEmail = jest.fn();
    (customerService.findByEmail as jest.Mock).mockResolvedValue({
      ...mockCustomers[0],
      isActive: false,
    });
    const result = await customerService.login(mockLoginParams);
    expect(result).toBe(false);
  });

  it('login() should return false if password does not match.', async () => {
    customerService.findByEmail = jest.fn();
    (customerService.findByEmail as jest.Mock).mockResolvedValue(
      mockCustomers[0],
    );
    jest.mock('bcrypt', () => ({
      compare: jest.fn().mockResolvedValue(false),
    }));
    const result = await customerService.login(mockLoginParams);
    expect(result).toBe(false);
  });
});
