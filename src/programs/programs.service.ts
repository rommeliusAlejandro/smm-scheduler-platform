/**
 * @author Rommel Loayza
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Program, ProgramDocument } from '@smm/programs/schemas/program.schema';
import { from, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProgramsService {

  constructor(@InjectModel(Program.name) private readonly programModel: Model<ProgramDocument>) {
  }

  create(program: any): Observable<Program> {
    program['id'] = uuidv4();
    const newProgram = new this.programModel(program);

    return from(newProgram.save());
  }

  getAll(): Observable<Program[]> {
    return from(this.programModel.find().sort({'month': 1}).exec());
  }

  findById(id: string): Observable<Program> {
    return from(this.programModel.findOne({id: id}));
  }

  getBy(field: string, value: string): Observable<Program[]> {
    let search = {};
    search[field] = value;
    return from(
      this.programModel.find(search).exec(),
    );
  }

  update(id: string, attributes: any): Observable<Program> {
    return from(
      this.programModel.findOneAndUpdate({ id: id }, attributes, { new: true }),
    );
  }


}
