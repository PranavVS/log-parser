import * as fs from "fs";
export class LogFileReader {
  filePath: string;
  constructor(filePath: string) {
    this.filePath = filePath;
  }
  async read() {
    return fs.readFileSync(this.filePath).toString();
  }
}
