/**
 * @author Rommel Loayza
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { from, Observable } from 'rxjs';
import { MonthlyProgram, MonthlyProgramDocument } from '@smm/monthly-programs/schemas/monthly-program.schema';
import { v4 as uuidv4 } from 'uuid';
import { ProgramStatusEnum } from '@smm/monthly-programs/enums/program-status.enum';

@Injectable()
export class MonthlyProgramsService {

  constructor(@InjectModel(MonthlyProgram.name) private readonly monthlyProgramDocumentModel: Model<MonthlyProgramDocument>) {
  }

  create(monthlyProgram: any): Observable<MonthlyProgram> {
    monthlyProgram['id'] = uuidv4();
    monthlyProgram['status'] = ProgramStatusEnum.DRAFT.valueOf();
    const newMonthlyProgram = new this.monthlyProgramDocumentModel(monthlyProgram);

    return from(newMonthlyProgram.save());
  }

  findAll(): Observable<MonthlyProgram[]> {
    return from(this.monthlyProgramDocumentModel.find().exec());
  }

  findOne(id: string): Observable<MonthlyProgram> {
    return from(this.monthlyProgramDocumentModel.findOne({ id: id }));
  }

  update(id: string, attributes: any): Observable<MonthlyProgram> {
    return from(
      this.monthlyProgramDocumentModel.findOneAndUpdate({ id: id }, attributes, { new: true }),
    );
  }

  findBy(field: string, value: string): Observable<MonthlyProgram[]> {
    let search = {};
    search[field] = value;
    return from(
      this.monthlyProgramDocumentModel.find(search).exec(),
    );
  }

}
