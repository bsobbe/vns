import { Field, InputType, Int } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

@InputType()
export class WhereCustomerInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}

@InputType()
export class CustomerWhereUniqueInput {
  @Field(() => String, { nullable: true })
  id?: string;
}

@InputType()
export class OrderByCustomerInput {
  @Field(() => String, { nullable: true })
  createdAt?: 'asc' | 'desc';
}

@InputType()
export class GetCustomerInput {
  @Field(() => CustomerWhereUniqueInput, { nullable: true })
  cursor?: Prisma.CustomerWhereUniqueInput;

  @Field(() => Int, { nullable: true })
  skip: number;

  @Field(() => Int, { nullable: true })
  take: number;

  @Field(() => WhereCustomerInput, { nullable: true })
  where: WhereCustomerInput;

  @Field(() => OrderByCustomerInput, { nullable: true })
  orderBy: OrderByCustomerInput;
}

@InputType()
export class GetCustomerByIdOrEmailInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String, { nullable: true })
  email?: string;
}

@InputType()
export class UpdateCustomerValueInput {
  @Field(() => String, { nullable: true })
  email?: string;
}

@InputType()
export class UpdateCustomerInput {
  @Field(() => String, { nullable: false })
  id: string;

  @Field(() => UpdateCustomerValueInput, { nullable: true })
  values: UpdateCustomerValueInput;
}

@InputType()
export class SignupCustomerInput {
  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: false })
  password: string;

  @Field(() => String, { nullable: false })
  passwordConfirmation: string;
}

@InputType()
export class ActivationCustomerInput {
  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: false })
  password: string;

  @Field(() => String, { nullable: false })
  activationCode: string;
}

@InputType()
export class LoginCustomerInput {
  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: false })
  password: string;
}
