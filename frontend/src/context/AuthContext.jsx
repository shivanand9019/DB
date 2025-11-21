
import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load stored user ONCE on mount
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            setUser(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    // Normalize backend response
    const normalize = (data = {}) => {
        const userId = data.userId ?? data.userID ?? data.id ?? null;
        const role = data.role ?? data.Role ?? null;

        const donorId =
            data.donorId ??
            data.donor_id ??
            data.donor?.donorId ??
            data.donor?.donor_id ??
            null;

        const hospitalId =
            data.hospitalId ??
            data.hospital_id ??
            data.hospital?.hospitalId ??
            data.hospital?.hospital_id ??
            null;

        return { ...data, userId, role, donorId, hospitalId };
    };

    // Login
    const login = async (backendUser) => {
        let normalized = normalize(backendUser);

        // Try fetching donor info if missing
        if (normalized.role === "DONOR" && !normalized.donorId && normalized.userId) {
            try {
                const res = await api.get(`/donors/user/${normalized.userId}`);
                if (res?.data?.donorId) normalized.donorId = res.data.donorId;
            } catch {}
        }

        // Try fetching hospital info if missing
        if (normalized.role === "HOSPITAL" && !normalized.hospitalId && normalized.userId) {
            try {
                const res = await api.get(`/hospitals/user/${normalized.userId}`);
                if (res?.data?.hospitalId) normalized.hospitalId = res.data.hospitalId;
            } catch {}
        }

        // Save IDs separately
        if (normalized.donorId) localStorage.setItem("donorId", normalized.donorId);
        if (normalized.hospitalId) localStorage.setItem("hospitalId", normalized.hospitalId);

        setUser(normalized);
        localStorage.setItem("user", JSON.stringify(normalized));
    };

    // Logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("donorId");
        localStorage.removeItem("hospitalId");
        localStorage.clear();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

// import React, { createContext, useState, useContext, useEffect } from "react";
//
// import api from "../services/api.js"; // your axios instance
//
// const AuthContext = createContext(null);
//
// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null); // full user object
//     const [loading, setLoading] = useState(true);
//
//     useEffect(() => {
//         const stored = localStorage.getItem("user");
//         if (stored) {
//             setUser(JSON.parse(stored));
//
//             const AuthContext = createContext();
//
//             export const AuthProvider = ({children}) => {
//                 const [user, setUser] = useState(null);
//                 const [loading, setLoading] = useState(true);
//                 // Load user from localStorage on app load
//                 useEffect(() => {
//                     const storedUser = localStorage.getItem("user");
//                     if (storedUser) {
//                         setUser(JSON.parse(storedUser));
//
//                     }
//                     setLoading(false);
//                 }, []);
//
//
//                 const normalize = (data = {}) => {
//                     // backend might return different keys: userId / userID / id
//                     const userId = data.userId ?? data.userID ?? data.id ?? null;
//                     const role = data.role ?? data.Role ?? null;
//                     // backend might include donor/hospital objects or ids
//                     const donorId = data.donorId ?? data.donor_id ?? data.donor?.donorId ?? data.donor?.donor_id ?? null;
//                     const hospitalId = data.hospitalId ?? data.hospital_id ?? data.hospital?.hospitalId ?? data.hospital?.hospital_id ?? null;
//
//                     return {
//                         ...data,
//                         userId,
//                         role,
//                         donorId,
//                         hospitalId,
//                     };
//                 };
//
//                 // login receives backend response object
//                 const login = async (backendUser) => {
//                     const normalized = normalize(backendUser);
//
//                     // if donorId or hospitalId missing, try to fetch from userId
//                     if (!normalized.donorId && normalized.userId && normalized.role === "DONOR") {
//                         try {
//                             const res = await api.get(`/donors/user/${normalized.userId}`); // assumes endpoint exists
//                             if (res?.data?.donorId) normalized.donorId = res.data.donorId;
//                         } catch (e) {
//                             // silently ignore — not all backends have this endpoint
//                             // console.warn("donor lookup failed", e);
//                         }
//                     }
//
//                     if (!normalized.hospitalId && normalized.userId && normalized.role === "HOSPITAL") {
//                         try {
//                             const res = await api.get(`/hospitals/user/${normalized.userId}`); // assumes endpoint exists
//                             if (res?.data?.hospitalId) normalized.hospitalId = res.data.hospitalId;
//                         } catch (e) {
//                             // ignore
//                         }
//                     }
//
//                     // save ids separately for convenience
//                     if (normalized.donorId) localStorage.setItem("donorId", normalized.donorId);
//                     if (normalized.hospitalId) localStorage.setItem("hospitalId", normalized.hospitalId);
//
//                     setUser(normalized);
//                     localStorage.setItem("user", JSON.stringify(normalized));
//                 };
//
//
//                 // // ✅ Login — store full user details + role-based ID
//                 // const login = (userData) => {
//                 //     let storedUser = {...userData};
//                 //
//                 //     // If backend response includes user role and IDs, store accordingly
//                 //     if (userData.role === "DONOR" && userData.donorId) {
//                 //         storedUser = {...userData, donorId: userData.donorId};
//                 //         localStorage.setItem("donorId", userData.donorId);
//                 //     } else if (userData.role === "HOSPITAL" && userData.hospitalId) {
//                 //         storedUser = {...userData, hospitalId: userData.hospitalId};
//                 //         localStorage.setItem("hospitalId", userData.hospitalId);
//                 //     }
//                 //
//                 //     setUser(storedUser);
//                 //     localStorage.setItem("user", JSON.stringify(storedUser));
//                 // };
//
//                 // ✅ Logout — clear everything
//
//                 const logout = () => {
//                     setUser(null);
//                     localStorage.removeItem("user");
//                     localStorage.removeItem("donorId");
//                     localStorage.removeItem("hospitalId");
//                 };
//
//                 if (loading) return <div>Loading...</div>;
//
//
//                 return (
//                     <AuthContext.Provider value={{user, login, logout}}>
//                         {children}
//                     </AuthContext.Provider>
//                 );
//
//             };
//
//             export const useAuth = () => useContext(AuthContext);
//
//
