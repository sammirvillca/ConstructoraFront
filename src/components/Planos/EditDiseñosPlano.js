import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CloseIcon from "@rsuite/icons/Close";
import CheckIcon from "@rsuite/icons/Check";
import { Button, ButtonToolbar } from "rsuite";
import axios from "axios";

const EditDiseñosPlano = () => {
  let navigate = useNavigate();
  const { id } = useParams();

  const [dibujoPlano, setDibujoPlano] = useState({
    atmosphere: "",
    circulationFlow: "",
    funcionality: "",
    dimensions: "",
    prerequisitoPlanoId: "",
    prerequisitoCodReq: "",
    numero: "",
  });

  const [prerequisitosPlano, setPrerequisitosPlano] = useState([]);
  const [clienteName, setClienteName] = useState("");

  useEffect(() => {
    fetchDibujoPlano();
    fetchPrerequisitosPlano();
  }, []);

  const fetchDibujoPlano = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v2/dibujo-plano/${id}`
      );
      setDibujoPlano(response.data);
      setClienteName(response.data.prerequisitoPlano.cliente.fullName || "");

      // Obtener el código del prerequisito vinculado
      const prerequisitoCodReq = response.data.prerequisitoPlano.codReq || "";
      setDibujoPlano((prevDibujoPlano) => ({
        ...prevDibujoPlano,
        prerequisitoPlanoId: response.data.prerequisitoPlano.id,
        prerequisitoCodReq: prerequisitoCodReq,
      }));
    } catch (error) {
      console.error("Error fetching dibujo plano:", error);
    }
  };

  const fetchPrerequisitosPlano = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v2/prerequisitos-no-vinculados"
      );
      setPrerequisitosPlano(response.data);
    } catch (error) {
      console.error("Error fetching prerequisitos plano no vinculados:", error);
    }
  };

  const {
    atmosphere,
    circulationFlow,
    funcionality,
    dimensions,
    prerequisitoPlanoId,
    numero,
  } = dibujoPlano;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDibujoPlano((prevDibujoPlano) => ({
      ...prevDibujoPlano,
      [name]: value,
    }));
  };

  const handlePrerequisitoChange = (e) => {
    const prerequisitoId = e.target.value;
    setDibujoPlano((prevDibujoPlano) => ({
      ...prevDibujoPlano,
      prerequisitoPlanoId: prerequisitoId,
    }));

    const selectedPrerequisito = prerequisitosPlano.find(
      (prerequisito) => prerequisito.id === parseInt(prerequisitoId)
    );
    if (selectedPrerequisito) {
      setClienteName(selectedPrerequisito.clienteFullName || "");
    } else {
      setClienteName("");
    }
  };

  const updateDibujoPlano = async (e) => {
    e.preventDefault();
    console.log("Actualizando dibujo plano...");
    await axios.put(
      `http://localhost:8080/api/v2/dibujo-planos/${id}`,
      dibujoPlano
    );
    navigate("/planos");
  };

  return (
    <div className="container" style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Editar Diseño de Plano</h2>
      </div>

      <div className="py-4">
        <form onSubmit={updateDibujoPlano}>
          {/* ... */}
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="atmosphere">
              Atmósfera
            </label>
            <div className="col-sm-4">
              <textarea
                className="form-control"
                rows={3}
                name="atmosphere"
                id="atmosphere"
                value={atmosphere}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label
              className="col-sm-2 col-form-label"
              htmlFor="circulationFlow"
            >
              Flujo de Circulación
            </label>
            <div className="col-sm-4">
              <textarea
                className="form-control"
                rows={3}
                name="circulationFlow"
                id="circulationFlow"
                value={circulationFlow}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="funcionality">
              Funcionalidad
            </label>
            <div className="col-sm-4">
              <textarea
                className="form-control"
                rows={3}
                name="funcionality"
                id="funcionality"
                value={funcionality}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="dimensions">
              Dimensiones
            </label>
            <div className="col-sm-4">
              <textarea
                className="form-control"
                rows={3}
                name="dimensions"
                id="dimensions"
                value={dimensions}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label
              className="col-sm-2 col-form-label"
              htmlFor="prerequisitoPlanoId"
            >
              Prerequisito de Plano
            </label>
            <div className="col-sm-4">
              <select
                className="form-control"
                name="prerequisitoPlanoId"
                id="prerequisitoPlanoId"
                value={prerequisitoPlanoId}
                onChange={handlePrerequisitoChange}
              >
                {dibujoPlano.prerequisitoCodReq ? (
                  <option value={prerequisitoPlanoId}>
                    {dibujoPlano.prerequisitoCodReq}
                  </option>
                ) : (
                  <option value="">Seleccionar Prerequisito</option>
                )}
                {prerequisitosPlano.map((prerequisito) => (
                  <option key={prerequisito.id} value={prerequisito.id}>
                    {prerequisito.codReq}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label">Cliente</label>
            <div className="col-sm-4">
              <input
                type="text"
                className="form-control"
                readOnly
                value={clienteName}
              />
            </div>
          </div>
          <div className="mb-4 row">
            <label className="col-sm-2 col-form-label" htmlFor="numero">
              Codigo de Diseño
            </label>
            <div className="col-sm-4">
              <input
                type="number"
                className="form-control"
                name="numero"
                id="numero"
                value={numero || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="row mb-5">
            <ButtonToolbar>
              <Button
                color="green"
                appearance="primary"
                startIcon={<CheckIcon />}
                type="submit"
              >
                Guardar
              </Button>
              <Button
                color="red"
                appearance="primary"
                startIcon={<CloseIcon />}
                as={Link}
                to="/planos"
              >
                Cancelar
              </Button>
            </ButtonToolbar>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDiseñosPlano;
