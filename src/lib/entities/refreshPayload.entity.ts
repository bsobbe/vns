import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RefreshPayload {
  @Field(() => String)
  id: string;

  @Field(() => String)
  email: string;
}
