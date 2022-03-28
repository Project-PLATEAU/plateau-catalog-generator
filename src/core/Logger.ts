type LogLevel = "info" | "warn" | "error";

type LogPath = readonly string[];

interface LogData {
  path: LogPath;
  level: LogLevel;
  message: string;
}

export default class Logger {
  private readonly logs: LogData[] = [];
  constructor(private readonly onLog?: (logData: LogData) => void) {}
  spawn(name: string): Logger {
    return new Logger((logData) => {
      this.log({ ...logData, path: [name, ...logData.path] });
    });
  }
  log(logData: LogData): void {
    this.logs.push(logData);
    this.onLog?.(logData);
  }
  info(message: string): void {
    this.log({ path: [], level: "info", message });
  }
  warn(message: string): void {
    this.log({ path: [], level: "warn", message });
  }
  error(message: string): void {
    this.log({ path: [], level: "error", message });
  }
  getLogs(): LogData[] {
    return this.logs.slice();
  }
}
