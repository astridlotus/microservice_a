SETUP

Run `npm install` to download necessary packages.
To run the service, enter `node app.js`.

COMMUNICATION CONTRACT

Since this Micro service only includes POST requests, each call includes both
requests data and receives it.

1. Create a virtual environment for your code and ensure that requests module
is installed and imported in your file.

HOW TO REQUEST DATA:

The processes of requesting data is made using the requests module, using
a known url (endpoint) and body of request

Example:

url = 'http://localhost:3000/upload-csv'
with open(file_path, 'rb') as file:
        # The file is sent in the 'file' field as a multipart form-data
        files = {'file': file}

        # Send a POST request to the API Gateway with the file
        response = requests.post(url, files=files)


HOW TO RECEIVE DATA:

this is made by inspecting the response of the POST request. Once the request
is made the response can be retrieved as follows.

Example:

if response.status_code == 200:
        print("JSON Response:", response.json())  # Print the JSON response from the server
    else:
        print("Error:", response.status_code, response.text)
        
![image](https://github.com/user-attachments/assets/4ee514df-1e84-4f60-a28d-8ddc721f4eb4)

        


