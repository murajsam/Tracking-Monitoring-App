# Tracking Monitoring App

This is a web application that allows users to upload tracking data and view it in a user-friendly interface. The application is built using MERN stack (MongoDB, Express.js, React.js, and Node.js) and uses the `xlsx` and `node-xlsx` libraries to read and write Excel files.

## Features

- Upload tracking data from Excel files
- View tracking data in a user-friendly interface
- Filter tracking data based on carrier, status, shipper, weight, date range, and search
- Display detailed information for each tracking

## User Interface

The user interface consists of three main sections:

1. Upload Section: This section allows users to upload Excel files containing tracking data. The user can select multiple files at once or drag and drop files into the section.

2. Validation Section: This section displays the progress of the validation process for the uploaded files. The user can see the number of files uploaded, the number of files validated, and the percentage of validation completed.

3. Import Section: This section displays the progress of the import process for the validated files. The user can see the number of files imported, the number of files with duplicated rows, and the percentage of import completed.

4. Overview Section: This section displays a table of tracking data. The user can filter the data based on carrier, status, shipper, weight, date range, and search. The table also displays additional information for each tracking, such as the file name, carrier, status, and more.

5. Detail Section: This section displays detailed information for a selected tracking. The user can see the file name, carrier, status, and additional information for each tracking.

## Backend API

The backend API is a Node.js application that handles the file upload and validation process. It uses the `xlsx` and `node-xlsx` libraries to read Excel files. The API also uses the `csv-stringify` library to convert the tracking data to CSV format. The API exposes two endpoints:

- `POST /api/files/upload`: This endpoint is used to upload Excel files. It accepts a multipart/form-data request with a file field containing the Excel file. The API reads the Excel file, validates the data, and returns the validation results.

- `GET /api/trackings/:id`: This endpoint is used to retrieve tracking data for a specific tracking. It accepts a parameter `:id` representing the tracking ID. The API returns the tracking data in JSON format.

- `GET /api/trackings`: This endpoint is used to retrieve all tracking data. It returns a JSON array of tracking data.

## Frontend Application

The frontend application is a React.js application that uses the `axios` library to communicate with the backend API. The application uses the `react-circular-progressbar` library to display the progress of the validation and import processes. The application also uses the `react-router-dom` library to handle routing and navigation between different sections of the application. The application is styled using Tailwind CSS. The application also uses the `lucide-react` library to display icons. The application is hosted on Netlify. The frontend application is deployed on the following URL: `https://tracking-monitoring-app.netlify.app/`. The frontend application is built using the Create React App CLI. The frontend application uses the `axios` library to communicate with the backend API. The frontend application uses the `react-circular-progressbar` library to display the progress of the validation and import processes. The frontend application also uses the `react-router-dom` library to handle routing and navigation between different sections of the application. The frontend application is styled using Tailwind CSS. The frontend application also uses the `lucide-react` library to display icons.

## How to Run the Application

To deploy the application, you need to have Node.js and npm installed on your system. Once you have them installed, follow these steps:

1. Clone the repository to your local machine.

2. Navigate to the `backend` directory and install the dependencies by running `npm install`.

3. Navigate to the `frontend` directory and install the dependencies by running `npm install`.

4. Start the backend API by running `npm run dev` in the `backend` directory.

5. Start the frontend application by running `npm start` in the `frontend` directory.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information.
