import axios from "axios";

// Axios instance
const api = axios.create({
    baseURL: "http://localhost:8080/api",
});
const BASE_URL = "http://localhost:8080/api/hospitals";

// Fetch blood requests for a specific hospital
export const getBloodRequests = async (hospitalId) => {
    const res = await api.get(`/requests/hospital/${hospitalId}`);
    return res.data; // returns array of blood requests
};

export const getAllHospitals = async ()=>
{
    const response = await axios.get(`${BASE_URL}/all`);
    return response.data;

}
export const getDonationHistory = async (hospitalId)=>{
    const res = await
        fetch(`${api}/donation/history/${hospitalId}`);
    if(!res.ok) throw new Error("failed to fetch donation history");

    return await res.json();
}

// Update status of a blood request
export const updateStatus = async (requestId, status) => {
    const res = await api.put(`/requests/${requestId}/status/${status}`);
    return res.data;
};


export default api;
