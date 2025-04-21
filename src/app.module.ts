import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'; 
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TeamsModule } from './modules/teams/teams.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Keep loading .env for local dev and other vars
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Make ConfigModule available to the factory
      inject: [ConfigService], // Inject ConfigService
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';
        const databaseUrl = configService.get<string>('DATABASE_URL'); // Check for Render's DATABASE_URL

        if (databaseUrl) {
          // If DATABASE_URL is provided (common on Render, Heroku, etc.)
          return {
            type: 'postgres', // Explicitly set type
            url: databaseUrl, // TypeORM can parse the URL
            ssl: {
              // Render typically requires SSL and provides the necessary setup via DATABASE_URL
              // Setting rejectUnauthorized to false is common but less secure.
              // Check Render docs if they provide a CA cert for better validation.
              rejectUnauthorized: false,
            },
            entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
            synchronize: false, // NEVER use synchronize: true in production with DATABASE_URL
            logging: false,     // Disable verbose logging in production
          };
        } else {
          // Fallback to individual variables (useful for local development)
          return {
            type: 'postgres', // <--- Changed from 'mysql'
            host: configService.get<string>('DB_HOST'), // Default host
            port: parseInt(configService.get<string>('DB_PORT', '5432'), 10), // <--- Changed default port
            username: configService.get<string>('DB_USER'), // Using your variable name
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'), // Using your variable name
            entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
            synchronize: true, // synchronize: true ONLY for non-production
            logging: true, // Log SQL ONLY for non-production
            ssl: isProduction // Enable SSL conditionally for production if not using DATABASE_URL
              ? { rejectUnauthorized: false }
              : false,
          };
        }
      },
    }),
    // Feature Modules
    UsersModule,
    AuthModule,
    TeamsModule,
  ],
  // Only include controllers NOT handled by feature modules (usually just AppController if used)
  controllers: [AppController],
  // Only include providers NOT handled by feature modules (usually just AppService if used)
  providers: [AppService],
})
export class AppModule {}