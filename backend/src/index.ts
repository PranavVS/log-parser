import express from "express";
import { urlencoded } from "body-parser";
import { parseLogsRouter } from "./routes/parse-logs";
import cors from "cors";
const app = express();
app.use(cors());
app.use(
  urlencoded({
    // extended: true,
  })
);
app.use(parseLogsRouter);
app.listen(5000, () => {
  console.log(`Node Server Listening at 5000`);
});
