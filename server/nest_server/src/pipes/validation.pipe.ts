import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod/v3';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      // console.log(metadata.data);
      // console.log(metadata.metatype);
      // console.log(metadata.type);
      return parsedValue;
    } catch (error) {
      throw new BadRequestException(error.issues ?? error);
    }
  }
}
