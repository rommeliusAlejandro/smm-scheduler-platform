/**
 * @author Rommel Loayza
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Program, ProgramSchema } from '@smm/programs/schemas/program.schema';
import { ProgramsService } from '@smm/programs/programs.service';
import { ProgramsController } from '@smm/programs/programs.controller';

@Module({
  providers: [
    ProgramsService
  ],
  controllers: [
    ProgramsController
  ],
  exports: [
    ProgramsService
  ],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: Program.name, schema: ProgramSchema
        }
      ]
    )
  ]
})
export class ProgramsModule {

}
