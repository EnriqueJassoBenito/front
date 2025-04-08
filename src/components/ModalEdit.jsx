import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../services/axiosInstante"; // importa tu axios con interceptor

export default function ModalEdit({ user, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tel: "",
    age: "",
    surname: "",
    control_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "" ,
        email: user.email || "",
        tel: user.tel || "",
        age: user.age || "",
        surname: user.surname || "",
        control_number: user.control_number || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm("¿Seguro que deseas actualizar al usuario?")) return;

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await axiosInstance.put(
        `http://127.0.0.1:8000/users/api/${user.id}/`,
        formData
      );
      setSuccessMsg("Usuario actualizado con éxito");
      setTimeout(() => {
        onClose(); // Cierra el modal
        window.location.reload(); // Refresca para ver cambios
      }, 1000);
    } catch (err) {
      console.error("Error al actualizar", err);
      setErrorMsg("Hubo un error al actualizar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            minWidth: '300px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
        >
          <h2>Editar Usuario</h2>
          <form onSubmit={handleSubmit}>
            {Object.keys(formData).map((field) => (
              <div key={field} className="mb-3">
                <label className="form-label">{field}</label>
                <input
                  type="text"
                  className="form-control"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  
                />
              </div>
            ))}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
            <button type="button" className="btn btn-secondary ms-2" onClick={onClose}>
              Cancelar
            </button>
          </form>

          {successMsg && <div className="alert alert-success mt-3">{successMsg}</div>}
          {errorMsg && <div className="alert alert-danger mt-3">{errorMsg}</div>}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
