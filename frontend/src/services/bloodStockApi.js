import axios from "axios";

//  Base URL for your backend
const API_BASE_URL = "http://localhost:8080/api/bloodstock";

/**
 *  Get all blood requests created by a specific hospital
 * @param {number} hospitalId
 */
export const getBloodStock = async (hospitalId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${hospitalId}`);
        // Ensure data is always returned as an array
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Error fetching hospital bloodStocks:", error);
        throw error;
    }
};



/**
 *  Update the status of a specific blood request
 * @param {number} requestId
 * @param {string} status
 */
export const updateBloodStock = async (hospitalId, bloodGroup,units) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/update`, {
            hospitalId,
            bloodGroup,
            unitsAvailable : units,
        });
        return response.data;
    } catch (error) {
        console.error("Error updating bloodStocks :", error);
        throw error;
    }
};

export  const addBloodStock = async (hospitalId,bloodGroup,units)=>{
    const res = await axios.post(`${API_BASE_URL}/update`,{
        hospitalId,
        bloodGroup,
        unitsAvailable:units,
    });
    return res.data;
}