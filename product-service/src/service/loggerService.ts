import winston from 'winston';

interface LoggerInterface {
  logRequest: (message: string) => void;
  logError: (message: string, error: any) => void;
}

class WinstonLogger implements LoggerInterface {
  private readonly logger: any;
  private readonly format: any;

  constructor() {
    this.format = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.printf(
        (info) => `${info.timestamp} [${info.level}]: ${info.message} `
      )
    );

    this.logger = winston.createLogger({
      level: 'debug',
      transports: [
        new winston.transports.Console({
          format: this.format,
        }),
      ],
    });
  }

  logRequest(message: string) {
    this.logger.info(message);
  }

  logError(message: string, error: any) {
    this.logger.error(message, error);
  }
}

const winstonLogger = new WinstonLogger();

export default winstonLogger;
