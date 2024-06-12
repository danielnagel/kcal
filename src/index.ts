import express from "express";
import bodyParser from "body-parser";
import { router } from "./routes";
import { createOrUpdateDataJson } from "./controller";

(async () => {
    const port = 8080;
    const staticPath = __dirname + "/public";

    await createOrUpdateDataJson();

    const app = express();

    app.use(express.static(staticPath));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use('/', router);


    app.listen(port, () => {
        console.log(`listening on port ${port} ...`);
    });
})();