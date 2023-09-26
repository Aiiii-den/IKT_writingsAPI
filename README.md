# IKT_writingsAPI

### Second REST-API for my final PWA project

__1. Prompt API :__ https://github.com/Aiiii-den/IKT_promptAPI

__2. Writings API :__ enables post, get all, update and delete writings 
```
Local Endpoints:
POST writing: https://localhost:3000/writing
GET ALL writings: https://localhost:3000/writing
PATCH writing: https://localhost:3000/writing/:id
DELETE writing: https://localhost:3000/writing/:id
```
```
Deployed Endpoints: 
POST writing: https://ikt-writingsapi.onrender.com/writing
GET ALL writings: https://ikt-writingsapi.onrender.com/writing
PATCH writing: https://ikt-writingsapi.onrender.com/writing/:id
DELETE writing: https://ikt-writingsapi.onrender.com/writing/:id
```
_For a more detailed representation of the possible requests please refer to the accompanying yaml: [writingsAPI.yaml](https://github.com/Aiiii-den/IKT_writingsAPI/blob/main/writingsAPI.yaml)_

__3. Images API:__ https://github.com/Aiiii-den/IKT_imagesAPI  


### How to install:
1. Clone repository locally
2. Run `npm i`
3. Set up MongoDB (https://www.mongodb.com/de-de)
4. Create a .env file with the following structure and add your database, web push and web push subscription credentials
    ``` .env
   DB_CONNECTION: mongodb+srv://<user>:<password>@<collectionId>.mongodb.net/?retryWrites=true&w=majority
   DATABASE: <database>
   
   PUBLIC_KEY = <public web push subscription key>
   PRIVATE_KEY = <private web push subscription key>
   
   ENDPOINT = <subscription endpoint>
   P256DH_KEY = <subscription p256dh>
   AUTH_KEY = <subscription auth>
   ```
5. Run with `npm run watch`
6. Stop with `ctrl-c`


### Frontend:
Frontend repository can be found at the following URL: https://github.com/aiiii-den/IKT_frontendNew  
Or deployed at: https://ikt-frontend-new.vercel.app/
