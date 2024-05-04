import express from "express";
import bodyParser from "body-parser";

const app = express();
const router = express.Router();

const path = __dirname + "/frontend/";
const port = 8080;

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.post('/kcal_input', (req, res) => {
    console.log(req.body.time, req.body.what, req.body.kcal)
    res.redirect('/kcal_input?status=200');
})

app.use(express.static(path));
app.use('/', router);


app.listen(port, () => {
    console.log(`listening on port ${port} ...`);
});