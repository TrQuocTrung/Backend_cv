import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterConfigService } from './muter.config';
import { MulterModule, MulterModuleOptions } from '@nestjs/platform-express';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [MulterModule.registerAsync({
    useClass: MulterConfigService,
  })
  ]
})
export class FilesModule {

}
