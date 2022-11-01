import { Router, Request, Response } from "express";
import multer from "multer";
import { LogFileReader } from "../util/log-file-reader";
import { LogParser } from "../util/log-parser";
const upload = multer({ dest: "/tmp/" });
const router = Router();

router.post(
  "/logs/parse",
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).send({
        errors: [{ message: "Could Not Upload File." }],
      });
    }
    const logFileReader = new LogFileReader(req.file.path!);
    const fileContent = await logFileReader.read();
    const logParser = new LogParser();
    const logs = await logParser.parse(fileContent);
    return res.status(200).send({ message: "Success.", logs });
  }
);

export { router as parseLogsRouter };
