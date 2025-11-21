import axios from "axios";

//  Base URL for your backend
const API_BASE_URL = "http://localhost:8080/api/blood-requests";

/**
 *  Get all blood requests created by a specific hospital
 * @param {number} hospitalId
 */
export const getHospitalRequests = async (hospitalId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/hospital/${hospitalId}`);
        // Ensure data is always returned as an array
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Error fetching hospital requests:", error);
        throw error;
    }
};

/**
 *  Create a new blood request by a hospital
 * @param {object} requestData
 */
export const createBloodRequest = async (requestData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/create`, requestData);
        return response.data;
    } catch (error) {
        console.error("Error creating blood request:", error);
        throw error;
    }
};

/**
 *  Update the status of a specific blood request
 * @param {number} requestId
 * @param {string} status
 */
export const updateStatus = async (requestId, status) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${requestId}/status`, null, {
            params: { status },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating request status:", error);
        throw error;
    }
};

/**
 *  Get all pending blood requests (optional helper)
 */
export const getPendingRequests = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/pending`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Error fetching pending requests:", error);
        throw error;
    }
};
