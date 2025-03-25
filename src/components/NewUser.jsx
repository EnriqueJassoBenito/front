import React, { useState, useEffect } from "react";
import axios from "axios";
const CustomUserForm = () => {
    const [formFields, setFormFields] = useState([]);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        surname: "",
        control_number: "",
        age: "",
        tel: "",
    });
    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/users/form/")
            .then((response) => {
                console.log(response.data); // Verifica que los datos se reciban
                correctamente
                setFormFields(response.data);
            })
            .catch((error) => console.error("Error al obtener los datos",
                error));
    }, []);
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        // Enviar la solicitud POST para registrar el usuario
        axios
            .post("http://127.0.0.1:8000/users/form/", formData)
            .then((response) => {
                alert(response.data.message); // Mensaje de éxito
            })
            .catch((error) => {
                alert("Hubo un error al crear el usuario.");
                console.error("Error al enviar el formulario", error);
            });
    };
    return (
        <div>
            <h1>Nuevo Usuario</h1>
            <form onSubmit={handleSubmit}>
                {formFields &&
                    Object.keys(formFields).map((field) => {
                        const { label, input, type } = formFields[field];

                        return (

                            <div key={field}>
                                <label htmlFor={input.id}>{label}</label>

                                <input
                                    {...input}

                                    value={formData[field] || ""}
                                    onChange={handleInputChange}
                                    name={field} // Asegúrate de incluir el

                                    nombre del campo
                                    type={type || "text"} // Usa 'type' de larespuesta o 'text' como predeterminado
                                />
                                {/* Mostrar las condiciones si el campo es password */}
                                {field === "password" && (
                                    <div>
                                        <p>Al menos un número.</p>
                                        <p>Al menos una letra mayúscula.</p>
                                        <p>Al menos un carácter especial
                                            (!#$%&?).</p>
                                        <p>Mínimo de 8 caracteres en total.</p>
                                    </div>
                                )}
                                <br />
                            </div>
                        );
                    })}
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};
export default CustomUserForm;