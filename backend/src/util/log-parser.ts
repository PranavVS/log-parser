import * as fs from "fs";
import { LogAttr } from "../types/logs";
export class LogParser {
  private async logStringToArray(logString: string) {
    try {
      return logString.split(/\r?\n/);
    } catch (error) {
      console.log("Error Occurred while parsing the log", {
        stack: error.stack,
      });
      return [];
    }
  }
  async parse(logsString: string) {
    let logsStrArray = await this.logStringToArray(logsString);
    let parsedLogs: LogAttr[] = [];
    const allowedLogLevels = ["error", "warn"];
    await logsStrArray?.forEach(async (log, index) => {
      if (log === "") return;
      let logLevel = this.getLogLevel(log);
      if (!allowedLogLevels.includes(logLevel)) {
        return;
      }
      let logJSON = this.getLogJson(log);
      let parsedLog: LogAttr = {
        timeStamp: this.getDateFromLog(log),
        logLevel,
        transactionId: this.getTransactionId(log),
        err: logJSON.err,
      } as LogAttr;

      parsedLogs.push(parsedLog);
    });
    return parsedLogs;
  }

  private getDateFromLog(log: string) {
    let dateStr = log.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
    return +new Date(dateStr ? dateStr[0] : "");
  }
  private getLogLevel(log: string) {
    let logStrMatch = log.match(/ - [a-z]* - /);
    let logStr = logStrMatch ? logStrMatch[0] : "";
    let logLevel = logStr.replace(/[^a-z]/gi, "");
    return logLevel;
  }
  private getTransactionId(log: string) {
    let transIdMatch = log.match(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/gi);
    return transIdMatch ? transIdMatch[0] : "";
  }
  private getLogJson(log: string) {
    let logJsonStringMatch = log.match(/{[a-zA-z0-9\":\-, {}.]*/);
    try {
      return JSON.parse(logJsonStringMatch ? logJsonStringMatch[0] : "{}");
    } catch (error) {
      console.log(error.stack);
    }
    return {};
  }
}
