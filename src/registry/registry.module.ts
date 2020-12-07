/**
 * @author Rommel Loayza
 */
import { Inject, Logger, Module, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APPLICATION_CONFIG } from '@smm/config/constants';
import { RegistryDataStore } from '@smm/registry/registry.data.store';
import { RegistryDataService } from '@smm/registry/registry.data.service';
import { RegistryController } from '@smm/registry/registry.controller';
import { ParticipantsModule } from '@smm/participants/participants.module';

@Module({
  imports: [
    ConfigModule,
    ParticipantsModule
  ],
  providers: [
    RegistryDataStore,
    RegistryDataService,
  ],
  exports: [
    RegistryDataService
  ],
  controllers: [RegistryController],
})
export class RegistryModule implements OnModuleInit {

  @Inject()
  private readonly configService: ConfigService;

  @Inject()
  private readonly dataStore: RegistryDataStore;

  onModuleInit(): any {
    const path = this.configService.get(APPLICATION_CONFIG).data;
    const createData = this.configService.get(APPLICATION_CONFIG).createData;

    if('true' == createData) {
      const data = require(`${path}/data.json`);
      this.dataStore.createStore(data);
      return;
    }

    this.dataStore.initializeStore();

  }


}
