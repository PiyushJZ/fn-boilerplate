import pino from "pino";
import Config from "./config";

export const logger = pino({
  level: "info",
  formatters: {
    level: (label) => ({ level: label }),
  },
  transport: {
    targets: [
      {
        target: "pino-pretty",
        level: "info",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
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
});
