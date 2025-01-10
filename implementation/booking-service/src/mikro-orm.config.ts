import { Migrator } from '@mikro-orm/migrations';
import { defineConfig, ReflectMetadataProvider } from '@mikro-orm/postgresql';
import config from './config';

export default defineConfig({
  ...(config().mikroOrm as any),
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  metadataProvider: ReflectMetadataProvider,
  extensions: [Migrator],
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
});
