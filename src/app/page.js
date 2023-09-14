"use client";

import {
  Card,
  Typography,
  Spinner,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Textarea,
  Select,
  Option,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const TABLA_HEADERS = [
  "ID",
  "Fecha Inicial",
  "Fecha Final",
  "Fondo",
  "Frase",
  "Username",
];

function App() {
  const [data, setData] = useState([]);
  const [dataFiltrada, setDataFiltrada] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [modalNuevaFrase, setModalNuevaFrase] = useState(false);
  const [modalEditarFrase, setModalEditarFrase] = useState(false);

  const [filaSeleccionada, setFilaSeleccionada] = useState({});

  const opcionesFiltro = [
    ...new Set(data.map((item) => item.fondo.toString())),
  ];

  function handleModalNuevaFrase() {
    setModalNuevaFrase(!modalNuevaFrase);
  }

  function handleModalEditarFrase({
    frasesId,
    fechaInicial,
    fechaFinal,
    fondo,
    frase,
    userName,
  }) {
    setFilaSeleccionada({
      frasesId,
      fechaInicial,
      fechaFinal,
      fondo,
      frase,
      userName,
    });
    setModalEditarFrase((cur) => !cur);
  }

  function handleSeleccionFiltro(filtro) {
    if (!filtro || filtro === "todos" || filtro === "") {
      setDataFiltrada(data);
    } else {
      setDataFiltrada(data.filter((item) => item.fondo === filtro));
    }
  }

  // Carga la información en el primer montaje
  useEffect(function () {
    async function fetchData() {
      try {
        setIsLoading(true);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append(
          "Authorization",
          "Basic dGVzdEBsaWZlcmF5LmNvbTpscG9ydGFs"
        );
        myHeaders.append(
          "Cookie",
          "GUEST_LANGUAGE_ID=es_ES; JSESSIONID=AAEA6EFAC94FFB5EDC710A4BFCC38F4B"
        );

        const urlencoded = new URLSearchParams();
        urlencoded.append("groupId", "20119");

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: urlencoded,
          redirect: "follow",
        };

        // Realizar la solicitud GET utilizando la función fetch
        const res = await fetch(
          "http://localhost:8080/api/jsonws/fbec.frases/get-by-group-id",
          requestOptions
        );

        // Verificar si la respuesta es exitosa (código 200)
        if (!res.ok) {
          throw new Error(`Error al realizar la solicitud: ${res.status}`);
        }

        // Convertir la respuesta a JSON
        const data = await res.json();

        // Manipular los datos recibidos
        // console.log("Datos recibidos:", data);
        setData(data);
        setDataFiltrada(data);
      } catch (err) {
        // Manejar cualquier error que ocurra durante la solicitud
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <Layout>
      {isLoading && <Spinner className="h-8 w-8" />}
      {!isLoading && (
        <>
          <SelectFiltro
            opcionesFiltro={opcionesFiltro}
            onHandleSeleccionFiltro={handleSeleccionFiltro}
          />
          <Tabla
            data={dataFiltrada}
            dataFiltrada={dataFiltrada}
            onHandleModalEditarFrase={handleModalEditarFrase}
          />
          <BotonNuevaFrase onHandleModalNuevaFrase={handleModalNuevaFrase} />
        </>
      )}
      <ModalNuevaFrase
        modalNuevaFrase={modalNuevaFrase}
        onHandleModalNuevaFrase={handleModalNuevaFrase}
        data={data}
        onSetData={setData}
        onSetDataFiltrada={setDataFiltrada}
      />
      {modalEditarFrase && (
        <ModalEditarFrase
          modalEditarFrase={modalEditarFrase}
          onSetModalEditarFrase={setModalEditarFrase}
          onHandleModalEditarFrase={handleModalEditarFrase}
          filaSeleccionada={filaSeleccionada}
          onSetData={setData}
          onSetDataFiltrada={setDataFiltrada}
        />
      )}
    </Layout>
  );
}

export default App;

function Tabla({ dataFiltrada, onHandleModalEditarFrase }) {
  Tabla.propTypes = {
    dataFiltrada: PropTypes.array,
    onHandleModalEditarFrase: PropTypes.func,
  };

  console.log(dataFiltrada);
  const dataPorId = dataFiltrada.sort((a, b) => a.frasesId - b.frasesId);

  return (
    <Card className="h-[480px] w-full overflow-scroll">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLA_HEADERS.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataPorId.map(
            (
              { frasesId, fechaInicial, fechaFinal, fondo, frase, userName },
              index
            ) => {
              const isLast = index === dataFiltrada.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr
                  key={frasesId}
                  onClick={() =>
                    onHandleModalEditarFrase({
                      frasesId,
                      fechaInicial,
                      fechaFinal,
                      fondo,
                      frase,
                      userName,
                    })
                  }
                  className="even:bg-blue-gray-50/50 hover:cursor-pointer hover:bg-blue-gray-100/50"
                >
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {frasesId}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {fechaInicial}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {fechaFinal}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {fondo}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {frase}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {userName}
                    </Typography>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </Card>
  );
}

function Layout({ children }) {
  Layout.propTypes = {
    children: PropTypes.any,
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-[1200px] mt-12 bg-slate-400">{children}</div>
    </div>
  );
}

function ModalNuevaFrase({
  modalNuevaFrase,
  onHandleModalNuevaFrase,
  data,
  onSetData,
  onSetDataFiltrada,
}) {
  ModalNuevaFrase.propTypes = {
    modalNuevaFrase: PropTypes.bool,
    onHandleModalNuevaFrase: PropTypes.func,
    data: PropTypes.array,
    onSetData: PropTypes.func,
    onSetDataFiltrada: PropTypes.func,
  };

  const [fechaInicial, setFechaInicial] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [fondo, setFondo] = useState("");
  const [frase, setFrase] = useState("");
  const [userName, setUserName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    // Validar campos
    if (!fechaInicial || !fechaFinal || !fondo || !frase || !userName) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const nuevaFrase = {
      fechaInicial: fechaInicial,
      fechaFinal: fechaFinal,
      fondo: fondo,
      frase: frase,
      userName: userName,
    };

    handleAgregarNuevaFrase(nuevaFrase);

    // Limpiar campos
    setFechaInicial("");
    setFechaFinal("");
    setFondo("");
    setFrase("");
    setUserName("");

    // Cerrar modal
    onHandleModalNuevaFrase();
  }

  function handleAgregarNuevaFrase(nuevaFrase) {
    // Agrega nueva entrada en la parte de usuario
    onSetData([...data, nuevaFrase]);
    onSetDataFiltrada([...data, nuevaFrase]);

    async function sendData() {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append(
          "Authorization",
          "Basic dGVzdEBsaWZlcmF5LmNvbTpscG9ydGFs"
        );
        myHeaders.append(
          "Cookie",
          "GUEST_LANGUAGE_ID=es_ES; JSESSIONID=941BBEDD45FDA5AD756FCCCE32931903"
        );

        const urlencoded = new URLSearchParams();
        urlencoded.append("groupId", "20119");
        urlencoded.append("fechaInicial", fechaInicial);
        urlencoded.append("fechaFinal", fechaFinal);
        urlencoded.append("fondo", fondo);
        urlencoded.append("frase", frase);
        urlencoded.append("terminal", "127.0.0.1");

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: urlencoded,
          redirect: "follow",
        };

        const response = await fetch(
          "http://localhost:8080/api/jsonws/fbec.frases/add-frase",
          requestOptions
        );

        // Verificar si la respuesta es exitosa (código 200)
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }

        // Convertir la respuesta a text
        const result = await response.text();

        console.log(result);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        window.location.reload();
      }
    }
    sendData();
  }

  return (
    <Dialog open={modalNuevaFrase} handler={onHandleModalNuevaFrase}>
      <DialogHeader>Añadir nueva frase</DialogHeader>
      <DialogBody divider>
        <form className="mt-4 mb-2">
          <div className="mb-4 flex flex-col gap-6">
            <div className="flex gap-4">
              <Input
                value={fechaInicial}
                onChange={(e) => setFechaInicial(e.target.value)}
                size="lg"
                type="date"
                label="Fecha Inicial"
                required
              />
              <Input
                value={fechaFinal}
                onChange={(e) => setFechaFinal(e.target.value)}
                size="lg"
                type="date"
                label="Fecha Final"
                required
              />
            </div>
            <div className="flex gap-4">
              <Input
                value={fondo}
                onChange={(e) => setFondo(e.target.value)}
                size="lg"
                type="number"
                label="Fondo"
                required
              />
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                size="lg"
                type="text"
                label="Username"
                required
              />
            </div>
            <Textarea
              value={frase}
              onChange={(e) => setFrase(e.target.value)}
              label="Frase"
              required
            />
          </div>
        </form>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={onHandleModalNuevaFrase}
          className="mr-1"
        >
          <span>Cancelar</span>
        </Button>
        <Button variant="gradient" color="blue" onClick={handleSubmit}>
          <span>Añadir</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function ModalEditarFrase({
  modalEditarFrase,
  onHandleModalEditarFrase,
  onSetModalEditarFrase,
  filaSeleccionada,
  onSetData,
  onSetDataFiltrada,
}) {
  ModalEditarFrase.propTypes = {
    modalEditarFrase: PropTypes.bool,
    onHandleModalEditarFrase: PropTypes.func,
    onSetModalEditarFrase: PropTypes.func,
    filaSeleccionada: PropTypes.object,
    onSetData: PropTypes.func,
    onSetDataFiltrada: PropTypes.func,
  };

  const { frasesId, fechaInicial, fechaFinal, fondo, frase, userName } =
    filaSeleccionada;

  const [fechaInicialEditar, setFechaInicialEditar] = useState(fechaInicial);
  const [fechaFinalEditar, setFechaFinalEditar] = useState(fechaFinal);
  const [fondoEditar, setFondoEditar] = useState(fondo);
  const [fraseEditar, setFraseEditar] = useState(frase);
  const [userNameEditar, setUserNameEditar] = useState(userName);

  function handleSubmit(e) {
    e.preventDefault();

    // Validar campos
    if (
      !fechaInicialEditar ||
      !fechaFinalEditar ||
      !fondoEditar ||
      !fraseEditar ||
      !userNameEditar
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const fraseEditada = {
      fechaInicial: fechaInicialEditar,
      fechaFinal: fechaFinalEditar,
      fondo: fondoEditar,
      frase: fraseEditar,
      userName: userNameEditar,
    };

    handleAgregarFrase(fraseEditada);

    // Limpiar campos
    setFechaInicialEditar("");
    setFechaFinalEditar("");
    setFondoEditar("");
    setFraseEditar("");
    setUserNameEditar("");

    // Cerrar modal
    onSetModalEditarFrase(false);
  }

  function handleAgregarFrase(fraseEditada) {
    // Agrega nueva entrada en la parte de usuario
    onSetData((prevData) =>
      prevData.map((item) =>
        item.frasesId === filaSeleccionada.frasesId ? fraseEditada : item
      )
    );

    onSetDataFiltrada((prevData) =>
      prevData.map((item) =>
        item.frasesId === filaSeleccionada.frasesId ? fraseEditada : item
      )
    );

    /////////////////////////////////////////////////
    // Envío edición entrada a la API
    /////////////////////////////////////////////////

    async function sendData() {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append(
          "Authorization",
          "Basic dGVzdEBsaWZlcmF5LmNvbTpscG9ydGFs"
        );
        myHeaders.append(
          "Cookie",
          "GUEST_LANGUAGE_ID=es_ES; JSESSIONID=4813FC3A66A234C34ED9D6E7608676CF"
        );

        const urlencoded = new URLSearchParams();
        urlencoded.append("fraseId", frasesId);
        urlencoded.append("fechaInicial", fechaInicialEditar);
        urlencoded.append("fechaFinal", fechaFinalEditar);
        urlencoded.append("fondo", fondoEditar);
        urlencoded.append("frase", fraseEditar);
        urlencoded.append("terminal", "127.0.0.1");

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: urlencoded,
          redirect: "follow",
        };

        const response = await fetch(
          "http://localhost:8080/api/jsonws/fbec.frases/update-frase",
          requestOptions
        );

        // Verificar si la respuesta es exitosa (código 200)
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.status}`);
        }

        const result = await response.text();
        // console.log(result);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        window.location.reload();
      }
    }
    sendData();
  }

  return (
    <Dialog open={modalEditarFrase} handler={onHandleModalEditarFrase}>
      <DialogHeader>Editar frase</DialogHeader>
      <DialogBody divider>
        <form className="mt-4 mb-2">
          <div className="mb-4 flex flex-col gap-6">
            <div className="flex gap-4">
              <Input
                value={fechaInicialEditar}
                onChange={(e) => setFechaInicialEditar(e.target.value)}
                size="lg"
                type="date"
                label="Fecha Inicial"
                required
              />
              <Input
                value={fechaFinalEditar}
                onChange={(e) => setFechaFinalEditar(e.target.value)}
                size="lg"
                type="date"
                label="Fecha Final"
                required
              />
            </div>
            <div className="flex gap-4">
              <Input
                value={fondoEditar}
                onChange={(e) => setFondoEditar(e.target.value)}
                size="lg"
                type="number"
                label="Fondo"
                required
              />
              <Input
                value={userNameEditar}
                onChange={(e) => setUserNameEditar(e.target.value)}
                size="lg"
                type="text"
                label="Username"
                required
              />
            </div>
            <Textarea
              value={fraseEditar}
              onChange={(e) => setFraseEditar(e.target.value)}
              label="Frase"
              required
            />
          </div>
        </form>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={onHandleModalEditarFrase}
          className="mr-1"
        >
          <span>Cancelar</span>
        </Button>
        <Button variant="gradient" color="blue" onClick={handleSubmit}>
          <span>Actualizar</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function BotonNuevaFrase({ onHandleModalNuevaFrase }) {
  BotonNuevaFrase.propTypes = {
    onHandleModalNuevaFrase: PropTypes.func,
  };

  return (
    <div className="flex justify-end py-4">
      <Button
        onClick={() => onHandleModalNuevaFrase()}
        color="blue"
        size="sm"
        className="flex items-center gap-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Añadir frase
      </Button>
    </div>
  );
}

function SelectFiltro({ opcionesFiltro, onHandleSeleccionFiltro }) {
  SelectFiltro.propTypes = {
    opcionesFiltro: PropTypes.array,
    onHandleSeleccionFiltro: PropTypes.func,
  };

  return (
    <div className="flex justify-start py-4">
      <div className="w-75">
        <select
          className="bg-white w-full text-[#7c909c] rounded-md p-2 mb-2 focus:outline-1 outline-gray-500 border border-[#b0bec5]"
          id="filtroCampaña"
          onChange={(e) => onHandleSeleccionFiltro(e.target.value)}
        >
          <option value="todos">Todos</option>
          {opcionesFiltro.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
        {/* <Select
          onChange={(filtro) => onHandleSeleccionFiltro(filtro)}
          label="Filtro por fondo"
        >
          <Option value="todos">
            <em>Todos</em>
          </Option>
          {opcionesFiltro.map((opcion) => (
            <Option key={opcion} value={opcion}>
              {opcion}
            </Option>
          ))}
        </Select> */}
      </div>
    </div>
  );
}
