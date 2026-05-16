import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogModel } from './log.schema';
import { BaseRepositoryAbstract } from '../../common/database/base.repository.abstract';
import { BaseRepositoryInterface } from '../../common/database/base.repository.interface';

export type LogRepositoryInterface = BaseRepositoryInterface<LogModel>;

@Injectable()
export class LogRepository
  extends BaseRepositoryAbstract<LogModel>
  implements LogRepositoryInterface
{
  constructor(
    @InjectModel(LogModel.name)
    private readonly logModel: Model<LogModel>,
  ) {
    super(logModel);
  }
}
