const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

const rutaPublica = path.resolve(__dirname, "../public");
const port = process.env.PORT || 3002;

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// Enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use( express.static(rutaPublica));

const rutas = require("./rutas");
app.use("/api", rutas);

app.listen(port, error => {
    if( error) throw new Error( error );

    console.log(`Servidor corriendo en el puerto ${port}`);
});

