import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  GetCustomerInput,
  UpdateCustomerValueInput,
} from './dto/customer.input';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { PinoLogger } from 'nestjs-pino';
import { Customer } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CustomerService.name);
  }

  async findAll(params: GetCustomerInput): Promise<Customer[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;

      return await this.prisma.customer.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy: orderBy ? orderBy : { createdAt: 'desc' },
      });
    } catch (e) {
      this.logger.error('findAll() failed to fetch customers.', e);
      throw e;
    }
  }

  async findById(params: { id: string }): Promise<Customer> {
    try {
      const { id } = params;
      return await this.prisma.customer.findFirst({
        where: {
          id,
        },
      });
    } catch (e) {
      this.logger.error('findById() failed to find customer.', e);
      throw e;
    }
  }

  async findByEmail(params: { email: string }): Promise<Customer> {
    try {
      const { email } = params;
      return await this.prisma.customer.findFirst({
        where: {
          email,
        },
      });
    } catch (e) {
      this.logger.error('findByEmail() failed to find customer.', e);
      throw e;
    }
  }

  async deleteById(params: { id: string }): Promise<Customer> {
    try {
      const { id } = params;
      return await this.prisma.customer.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      this.logger.error('deleteById() failed to delete customer.', e);
      throw e;
    }
  }

  async updateById(params: {
    id: string;
    values: UpdateCustomerValueInput;
  }): Promise<Customer> {
    try {
      const { id, values } = params;
      return await this.prisma.customer.update({
        where: {
          id,
        },
        data: { ...values },
      });
    } catch (e) {
      this.logger.error('updateById() failed to update customer.', e);
      throw e;
    }
  }

  async create(params: { email: string; password: string }): Promise<Customer> {
    try {
      const { email, password } = params;
      const encryptedPassword = await bcrypt.hash(password, 10);
      return await this.prisma.customer.create({
        data: {
          id: uuidv4(),
          email,
          password: encryptedPassword,
          activationCode: uuidv4(),
        },
      });
    } catch (e) {
      this.logger.error('create() failed to create customer.', e);
      throw e;
    }
  }

  async activate(params: {
    email: string;
    password: string;
    activationCode: string;
  }): Promise<false | Customer> {
    try {
      const { email, password, activationCode } = params;
      const customer = await this.findByEmail({ email });
      if (!customer) {
        this.logger.info('activate() Customer not found.');
        return false;
      }
      const passwordMatch = await bcrypt.compare(password, customer.password);
      if (passwordMatch && activationCode === customer.activationCode) {
        return await this.prisma.customer.update({
          where: {
            email,
          },
          data: {
            isActive: true,
          },
        });
      } else {
        return false;
      }
    } catch (e) {
      this.logger.error('activate() failed to activate customer.', e);
      throw e;
    }
  }

  async login(params: {
    email: string;
    password: string;
  }): Promise<false | Customer> {
    try {
      const { email, password } = params;
      const customer = await this.findByEmail({ email });
      if (!customer) {
        this.logger.info('login() Customer not found');
        return false;
      }
      if (!customer.isActive) {
        return false;
      }
      const passwordMatch = await bcrypt.compare(password, customer.password);
      if (passwordMatch) {
        return customer;
      }
      return false;
    } catch (e) {
      this.logger.error('login() failed to login.', e);
      throw e;
    }
  }
}
