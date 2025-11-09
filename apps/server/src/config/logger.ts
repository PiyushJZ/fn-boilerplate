import Config from "./index";
import pino from "pino";

export const loggerConfig = {
  level: "debug",
  transport: {
    targets: [
      {
        target: "pino-pretty",
        level: "info",
        options: {
          colorize: true,
          translateTime: "dd/mm/yy HH:MM:ss",
          ignore: "pid,hostname",
        },
      },
      {
        target: "pino/file",
        level: "info",
        options: {
          destination: Config.LOGS_PATH,
          mkdir: true,
        },
      },
    ],
  },
};

const logger = pino(loggerConfig);

// Override console methods to use Pino
console.log = (...args) => logger.info(args.length === 1 ? args[0] : args);
console.info = (...args) => logger.info(args.length === 1 ? args[0] : args);
console.warn = (...args) => logger.warn(args.length === 1 ? args[0] : args);
console.error = (...args) => logger.error(args.length === 1 ? args[0] : args);

export default logger;
