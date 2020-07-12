import { registerAs } from '@nestjs/config';
import { APPLICATION_CONFIG } from './constants';

/**
 * @author Rommel Loayza
 */
export default registerAs(APPLICATION_CONFIG, () => ({
  port: process.env.PORT || '3000',
  data: process.env.DATA,
}));
