import express from "express";

const app = express();
const router = express.Router();

const path = __dirname + "/frontend/";
const port = 8080;

app.use(express.static(path));
app.use('/', router);

app.listen(port, () => {
    console.log(`listening on port ${port} ...`);
});