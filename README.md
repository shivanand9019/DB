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

**User Authentication*
```bash
POST /api/users/register
POST /api/users/login
  ```
**Donation Management*
```bash
POST /api/donations/book
GET  /api/donations/byHospital/{hospitalId}
PUT  /api/donations/{donationId}/status
```
**Donation Stats (Donor)*
```bash
GET /api/donations/stats/donor/{donorId}
```
  
**Blood Stock*
```bash 
GET /api/bloodstock/{hospitalId}
```
**Key Features Implemented**

**For Donors*

* Book donation for any hospital

* Track current request status

* View history of past donations

* View charts:

* Monthly donation trend

* Blood group frequency

* Recent donations table

 **For Hospitals*

* View all donation requests

* Approve, Reject, or Complete

* Auto-update blood stock on completion

* View available donors

* WhatsApp / Call donors in emergency

* View blood stock of only their hospital

 **Donation Stats Features**

* Total donations

* Blood type frequency (Pie Chart)

* Monthly donations bar graph

* Recent donation logs

## Project Structure
```
bloodlink/
│
├── backend/
│   ├── src/main/java/com/bloodlink/backend/
│   ├── resources/application.properties
│   └── pom.xml
│
├── frontend/
│   ├── src/components/
│   ├── src/pages/
│   ├── src/context/AuthContext.jsx
│   └── package.json
│
└── README.md
```


## Key Insights

* Each hospital gets its own blood stock.

* Donor statistics exclude rejected donations.

* Only users with correct role can access the correct dashboard.

* Secure password storage using BCrypt.


## How to Run the Project   

**Backend**
```bash 
cd backend
mvn clean install
mvn spring-boot:run
```
**Update DB config in application.properties.**
```bash
spring.datasource.url=jdbc:mysql://localhost:3306/bloodlink
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
```
**Frontend**
```bash
cd frontend
npm install
npm run dev
```




 

