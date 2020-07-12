/**
 * @author Rommel Loayza
 */
import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Participant } from '@smm/registry/registry.data.types';
import { RegistryDataService } from '@smm/registry/registry.data.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Registry Controller')
@Controller('registry')
export class RegistryController {

  @Inject()
  private readonly registryDataService: RegistryDataService;

  @Get('findByGender')
  findByGender(@Query("gender") gender: string ) : Observable<Participant[]> {
    return this.registryDataService.findByGender(gender);
  }

  @Get('findByAge')
  findByAge(@Query("age") age: string ) : Observable<Participant[]> {
    return this.registryDataService.findByAge(age);
  }

  @Get('findByName')
  findByName(@Query("name") name: string ) : Observable<Participant[]> {
    return this.registryDataService.findByName(name);
  }

  @Get('findActive')
  findActive() : Observable<Participant[]> {
    return this.registryDataService.findActive();
  }

  @Get('findInactive')
  findInactive() : Observable<Participant[]> {
    return this.registryDataService.findInactive();
  }

}
