# BloodLink – Blood Donation Management System

 ## A full-stack web application that connects donors and hospitals for efficient blood donation booking, request management, and blood stock monitoring.Built using React, Spring Boot, and MySQL.

### Project Overview

BloodLink aims to simplify and digitize the process of blood donation management in hospitals.
The platform allows:

 ### Key Objectives

1. Donors can register, log in, book donations, and track their donation history.

2. Hospitals can manage donation requests (Approve / Reject / Complete).

3. Maintain hospital-specific blood stock.

4. View available donors & send emergency messages.

5. Provide donors with detailed donation statistics using charts.

6. Secure user login with role-based access (Donor / Hospital).

**Technologies Used
Frontend (React)**

| Tool             | Purpose                           |
| ---------------- | --------------------------------- |
| **React.js**     | UI Framework                      |
| **Axios**        | API Communication                 |
| **Tailwind CSS** | UI Styling                        |
| **Recharts**     | Charts & Statistics Visualization |
| **React Router** | Routing                           |

**Backend (Spring Boot)**

| Tool                | Purpose                   |
| ------------------- | ------------------------- |
| **Spring Boot**     | REST APIs                 |
| **Spring Data JPA** | ORM & Database Handling   |
| **MySQL**           | Primary Database          |
| **Hibernate**       | Object-Relational Mapping |
| **BCrypt**          | Password Encryption       |

Database Entities

* User (common login table)

* Donor

* Hospital

* Donation

* BloodStock

Each hospital maintains its own blood stock — not shared globally.

**Data Flow / Architecture**
**Donor Side**

> Register → Login → Book Donation → Hospital Reviews → Status Updates → Statistics Dashboard
**Hospital Side**
> Login → View Donation Requests → Approve/Reject/Complete → Update Blood Stock → View Donors

**Backend API Endpoints**
* User Authentication
  POST /api/users/register
  POST /api/users/login
  
* Donation Management
  POST /api/donations/book
  GET  /api/donations/byHospital/{hospitalId}
  PUT  /api/donations/{donationId}/status

* Donation Stats (Donor)
    GET /api/donations/stats/donor/{donorId}
  
* Blood Stock
    GET /api/bloodstock/{hospitalId}

