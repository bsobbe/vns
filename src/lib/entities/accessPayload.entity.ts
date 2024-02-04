import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AccessPayload {
  @Field(() => String)
  id: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  role: string;
}
