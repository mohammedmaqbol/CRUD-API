import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from '@hapi/joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value, {abortEarly : false});
    if (error) {
      const messages = error.details.map((d)=> d.message)
      throw new BadRequestException(messages);
    }
    return value;
  }
}
