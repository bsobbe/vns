import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Customer } from '../lib/entities/customer.entity';
import { CustomerService } from './customer.service';
import {
  GetCustomerInput,
  GetCustomerByIdOrEmailInput,
  UpdateCustomerInput,
  SignupCustomerInput,
  ActivationCustomerInput,
  LoginCustomerInput,
} from './dto/customer.input';
import { Tokens } from '../lib/entities/tokens.entity';
import {
  BadRequestException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from '../authentication/authentication.service';
import { Roles } from '../authentication/roles/roles.decorator';
import { RolesGuard } from '../authentication/roles/roles.guard';
import { GqlAuthGuard } from '../authentication/roles/gql-auth.guard';
import { PinoLogger } from 'nestjs-pino';
import { AccountActivationException } from './exception/AccountActivationException';
import { SignupException } from './exception/SignupException';
import { PasswordException } from './exception/PasswordException';
import { MissingCustomerIdAndEmailException } from './exception/MissingCustomerIdAndEmailException';
import { LoginException } from './exception/LoginException';
import { PasswordNotComplexException } from './exception/PasswordNotComplexException';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(
    private readonly customerService: CustomerService,
    private readonly logger: PinoLogger,
    private readonly authenticationService: AuthenticationService,
  ) {
    this.logger.setContext(CustomerResolver.name);
  }

  @Query(() => [Customer])
  @Roles('USER', 'ADMIN')
  @UseGuards(GqlAuthGuard, RolesGuard)
  async customers(
    @Args('data') { skip, take, cursor, where, orderBy }: GetCustomerInput,
  ) {
    try {
      return await this.customerService.findAll({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    } catch (e) {
      throw new BadRequestException();
    }
  }

  @Query(() => Customer)
  @Roles('USER', 'ADMIN')
  @UseGuards(GqlAuthGuard, RolesGuard)
  async customer(@Args('data') { id, email }: GetCustomerByIdOrEmailInput) {
    try {
      if (id != undefined) {
        return await this.customerService.findById({ id });
      } else if (email != undefined) {
        return await this.customerService.findByEmail({ email });
      } else {
        throw new MissingCustomerIdAndEmailException();
      }
    } catch (e) {
      throw new BadRequestException();
    }
  }

  @Mutation(() => Customer)
  @Roles('ADMIN')
  @UseGuards(GqlAuthGuard, RolesGuard)
  async deleteCustomer(@Args('id') id: string) {
    try {
      return await this.customerService.deleteById({ id });
    } catch (e) {
      throw new BadRequestException();
    }
  }

  @Mutation(() => Customer)
  @Roles('ADMIN')
  @UseGuards(GqlAuthGuard, RolesGuard)
  async updateCustomer(@Args('data') { id, values }: UpdateCustomerInput) {
    try {
      return await this.customerService.updateById({ id, values });
    } catch (e) {
      throw new BadRequestException();
    }
  }

  @Mutation(() => Customer)
  async signup(
    @Args('data')
    { email, password, passwordConfirmation }: SignupCustomerInput,
  ) {
    try {
      const isComplexPassword =
        await this.authenticationService.validatePassword(password);
      if (!isComplexPassword) {
        throw new PasswordNotComplexException();
      }
      if (password !== passwordConfirmation) {
        throw new PasswordException();
      }
      return await this.customerService.create({ email, password });
    } catch (e) {
      if (
        e instanceof PasswordNotComplexException ||
        e instanceof PasswordException
      ) {
        throw e;
      }
      throw new SignupException();
    }
  }

  @Mutation(() => Boolean)
  async activate(
    @Args('data')
    { email, password, activationCode }: ActivationCustomerInput,
  ) {
    try {
      const activation = await this.customerService.activate({
        email,
        password,
        activationCode,
      });
      if (activation != false) {
        return true;
      }
      throw new AccountActivationException();
    } catch (e) {
      throw new AccountActivationException();
    }
  }

  @Query(() => Tokens)
  async login(@Args('data') { email, password }: LoginCustomerInput) {
    try {
      const customer = await this.customerService.login({ email, password });
      if (customer) {
        return {
          type: 'Bearer',
          accessToken: await this.authenticationService.generateAccessToken(
            customer,
          ),
          refreshToken: await this.authenticationService.generateRefreshToken(
            customer,
          ),
        };
      }
      throw new LoginException();
    } catch (e) {
      if (e instanceof LoginException) {
        throw e;
      }
      throw new UnauthorizedException();
    }
  }

  @Query(() => Tokens)
  async refresh(@Args('refreshToken') refreshToken: string) {
    try {
      const validToken = await this.authenticationService.validateRefreshToken(
        refreshToken,
      );
      if (!validToken) {
        throw new UnauthorizedException();
      }
      const customer = await this.customerService.findById({
        id: validToken.id,
      });
      if (customer) {
        return {
          type: 'Bearer',
          accessToken: await this.authenticationService.generateAccessToken(
            customer,
          ),
          refreshToken: await this.authenticationService.generateRefreshToken(
            customer,
          ),
        };
      }
      throw new UnauthorizedException();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
