import axios from "axios";

//URL de inicio de sesión (JWT)
const API_URL = "http://127.0.0.1:8000/users/token/"

export const login = async (email, password) => {
    const response = await axios.post(API_URL, {email,password});
    if(response.data.access){
        //Guardar el token en React
        localStorage.setItem("accessToken",response.data.access);
        localStorage.setItem("refreshToken",response.data.refresh);
    }
    return response.data;
}

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.reload(); // Recargar para actualizar estado
}