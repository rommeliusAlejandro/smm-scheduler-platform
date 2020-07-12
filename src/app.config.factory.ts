/**
 * @author Rommel Loayza
 */
import { Inject, Injectable } from '@nestjs/common';
import AppServiceConfig from '@smm/config/app.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AppConfigFactory {

  @Inject(AppServiceConfig.KEY)
  private readonly appConfig: ConfigType<typeof AppServiceConfig>;

  getDataPath(): string {
    return this.appConfig.data;
  }

}
