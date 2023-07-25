import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoseFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    switch(exception.code){
        case 11000:
            response
            .status(400)
            .json({
                message: `${Object.keys(exception.keyValue)} must be unique`
            })
    }
  }
}