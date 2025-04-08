import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios"; // Si deseas obtener datos desde una API
import { createPortal } from "react-dom";
import ModalEdit from "./ModalEdit";
import axiosInstance from "../services/axiosInstante";

const UserDataTable = () => {
  const [data, setData] = useState([]); // Datos para la tabla
  const [loading, setLoading] = useState(true); // Estado de carga
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDelete = async (userId, userName) => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseas eliminar a ${userName}? Esta acción no se puede deshacer.`
      )
    )
      return;

    try {
      await axiosInstance.delete(`users/api/${userId}/`);
      alert("Usuario eliminado con éxito.");
      // Puedes volver a cargar la tabla o actualizar el estado localmente
      window.location.reload(); // O mejor: actualiza la data sin reload
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      alert("Error al eliminar. Asegúrate de estar autenticado.");
    }
  };

  // Configuración de columnas
  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.name, // Selector de datos
      sortable: true, // Habilitar ordenamiento
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Teléfono",
      selector: (row) => row.tel,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <span>
          <button
            className="btn btn-warning me-4"
            onClick={() => {
              setSelectedUser(row);
              setShowModal(true);
            }}
          >
            <i className="bi bi-pencil"></i>
          </button>

          {showModal &&
            selectedUser &&
            createPortal(
              <ModalEdit
                user={selectedUser}
                onClose={() => setShowModal(false)}
              />,
              document.body
            )}
          <button
            className="btn btn-danger"
            onClick={() => handleDelete(row.id, row.name)}
          >
            <i className="bi bi-trash"></i>
          </button>
        </span>
      ),
    },
  ];

  // Obtener datos desde una API (puedes cambiar esta parte)
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/users/api/")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar los datos:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h3>Tabla de usuarios</h3>
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        highlightOnHover
        pointerOnHover
      />
    </div>
  );
};

export default UserDataTable;
