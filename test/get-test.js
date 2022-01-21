const chai = require("chai");
const chaiHttp = require("chai-http");
const { it } = require("mocha");
const { describe } = require("mocha");
const server = require("../index.js");

chai.use(chaiHttp);

// 5. Desarrollar una prueba que verifique que la ruta /deportes devuelve un JSON con la propiedad “deportes” y que esta es un arreglo.


describe("API REST", () => {
  it("Get debe traer JSON con la propiedad deportes y que esta sea un array", () => {
    chai
      .request(server)
      .get("/deportes")
      .end((err, res) => {
        chai.expect(err).to.be.null;
        chai.expect(res).to.have.status(200);
        const data = JSON.parse(res.text);
        chai.expect(data).to.have.property("deportes");
        chai.expect(data.deportes).to.be.an("array");
      });
  });
});
