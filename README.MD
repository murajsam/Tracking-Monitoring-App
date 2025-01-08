# Tracking Monitoring App

This is a web application that allows users to upload tracking data and view it in a user-friendly interface. The application is built using MERN stack (MongoDB, Express.js, React.js, and Node.js) and uses the `xlsx` and `node-xlsx` libraries to read from Excel files. Database stores tracking data from 3 different carriers: DHL, Hellman, and Logwin. Tracking data is stored in predefined format by performing specific mapping rules for each carrier. Mapping rules can be found in `mapping.csv` file.

## Features

- Upload tracking data from Excel files (.xlsx, .xls)
- Validate tracking data and import it into the database (DHL, Hellman, Logwin)
- Error handling for failed validation
- View tracking data in a user-friendly interface
- Filter tracking data based on carrier, status, shipper, weight, date range, and search
- Display detailed information for each tracking
- Mobile view support (responsive design)

## Pages

The application has three main pages:

1. Upload Page / Home Page: This page allows users to upload Excel files containing tracking data. There are three steps in the upload process: File Upload, Validation, and Import. The user can see the progress of each step. On the first step, the user can select multiple files at once or drag and drop files into the page and can also delete or add more files. On the second step, the user can no longer add or delete files. Lastly, on the third step, the files are being validated and tracking data is being imported into the database. Once the import is complete, the user can see the results of the imported files (each file shows the indentified carrier, number of imported rows, duplicated rows, and success rate).

2. Overview Page: This page displays a table of all imported tracking data from files. The user can filter the data based on carrier, status, shipper, weight, date range, and search. The table also provides links to the Detail Page for each tracking.

3. Detail Page: This page displays detailed information for a selected tracking. The user can see the file name, carrier, status, and additional information. The user can also see the tracking data in a table format.

## Backend API

The backend API is a Node.js application that handles the file upload and import. It uses the `xlsx` and `node-xlsx` libraries to read Excel files.

The API exposes three endpoints:

- `POST /api/files/upload`: This endpoint is used to upload Excel file and store it and it's tracking data in the database.

- `GET /api/trackings/:id`: This endpoint is used to retrieve tracking data for a specific tracking. It accepts a parameter `:id` representing the tracking ID. The API returns the tracking data in JSON format.

- `GET /api/trackings/all`: This endpoint is used to retrieve all tracking data. It returns a JSON array of tracking data.

## How to Run the Application

To deploy the application, you need to have Node.js and npm installed on your system. Once you have them installed, follow these steps:

1. Clone the repository to your local machine.

2. Navigate to the `backend` directory and install the dependencies by running `npm install`.

3. Navigate to the `frontend` directory and install the dependencies by running `npm install`.

4. Start the backend API by running `npm run dev` in the `backend` directory.

5. Start the frontend application by running `npm start` in the `frontend` directory.

## Screenshots

![Screenshot 1](screenshots/UploadPageStart.png)

![Screenshot 1](screenshots/UploadPageStep1.png)

![Screenshot 3](screenshots/UploadPageStep2.png)

![Screenshot 4](screenshots/UploadPageStep2Loading.png)

![Screenshot 5](screenshots/UploadPageStep3.png)

![Screenshot 6](screenshots/OverviewPage.png)

![Screenshot 7](screenshots/DetailPage.png)

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.
