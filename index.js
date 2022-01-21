const http = require("http");
const url = require("url");
const fs = require("fs");

const server = http
  .createServer((req, res) => {
    let deportesData = JSON.parse(fs.readFileSync("Deportes.json", "utf-8"));
    let deportes = deportesData.deportes;

    if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      fs.readFile("index.html", "utf8", (err, data) => {
        res.end(data);
      });
    }

    //     1. Crear una ruta GET que al consultarse devuelva en formato JSON todos los deportes registrados.
    if (req.url === "/deportes" && req.method == "GET") {
      res.end(JSON.stringify(deportesData));
    }

    // 2. Crear una ruta POST que reciba el nombre y precio de un nuevo deporte, lo persista en un archivo JSON. Debe generarse una respuesta en caso de no recibir ambos valores en la consulta

    if (req.url.includes("/agregar") && req.method == "POST") {
      let body;
      req.on("data", (payload) => {
        body = JSON.parse(payload);
      });
      req.on("end", () => {
        if (body.nombre === "" || body.precio === "")
          return res.end("Debes indicar nombre y precio.");
        const deporte = {
          nombre: body.nombre,
          precio: body.precio,
        };
        deportesData.deportes.push(deporte);
        fs.writeFile("Deportes.json", JSON.stringify(deportesData), (err) => {
          if (err) return res.end("Falla al crear deporte.");
          return res.end("Deporte creado.");
        });
      });
    }

    // 3. Crear una ruta PUT que actualice el precio de alguno de los deportes registrados y lo persista en un archivo JSON. Debe generarse una respuesta en caso de no recibir ambos valores en la consulta

    if (req.url.includes("/editar") && req.method == "PUT") {
      let body;
      req.on("data", (payload) => {
        body = JSON.parse(payload);
      });
      req.on("end", () => {
        if (body.nombre === "" || body.precio === "")
          return res.end("El precio no puede estar en blanco.");
        deportesData.deportes = deportes.map((d) => {
          if (d.nombre == body.nombre) return body;
          return d;
        });
        fs.writeFile("Deportes.json", JSON.stringify(deportesData), (err) => {
          if (err) return res.end("Falla al editar deporte.");
          return res.end("Deporte editado.");
        });
      });
    }

    // 4. Crear una ruta DELETE que elimine un deporte basado en su nombre solicitado desde el cliente.

    if (req.url.includes("/eliminar") && req.method == "DELETE") {
      const { nombre } = url.parse(req.url, true).query;
      deportesData.deportes = deportes.filter((d) => d.nombre !== nombre);
      fs.writeFile("Deportes.json", JSON.stringify(deportesData), (err) => {
        if (err) return res.end("Falla al eliminar deporte.");
        return res.end("Deporte eliminado");
      });
    }
  })
  .listen(3000, () => {
    console.log("Server ON");
  });

module.exports = server;
