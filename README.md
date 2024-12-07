# CMU-SE-403-AIS-Room-Booking-Management

Group Project for major Software Architecture &amp; Design, class CMU-SE 403 AIS

## Project Overview  

This project is a web application powered by a **Node.js** backend and a **React** frontend. The application allows users to interact with the system through an intuitive UI built with React while leveraging Node.js for the server-side logic and API functionality. The database used for this project is **SQLite3**, a lightweight, serverless database.  

### Backend: Node.js  

The backend is built using **Node.js** with the following features:  

- **Express.js**: A web framework for handling HTTP requests and routing.
- **Database**: **SQLite3** is used for data storage and retrieval. Its lightweight nature makes it ideal for local or small-scale applications.
- **Middleware**: Various middleware functions are used for logging, error handling, and validating requests.  

### Frontend: React  

The frontend is built with **React** and communicates with the Node.js backend via the REST APIs. Key features include:  

- **State Management**: React's built-in state management, or libraries like Redux or Context API, are used to manage app state.  
- **Component-Based Structure**: The UI is built with reusable components that represent different parts of the user interface.  
- **Routing**: React Router is used for navigating between pages and handling different views.  
- **HTTP Requests**: Axios or Fetch API is used to make HTTP requests to the backend for data operations.  
- **Responsive Design**: The application is designed to be fully responsive, providing a smooth user experience across various devices.
