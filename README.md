# aswar-task-server
Aswar task done using Nodejs + Express Backend that talks to a MySQL database on the cloud.
The host site for my database is clever-cloud. I got tired of finding a free host. This youtube helped me with that: https://www.youtube.com/watch?v=cjkksEmH9Ig .
Also I had to create the database and its tables though a cli, this video helped me with that: https://www.youtube.com/watch?v=CYK-ywqobyA .

In this project, I have 3 routes only: products, users, and logins.

products route: all CRUD operations with joi validation for the request body.

users route: only post with joi validation for the request body.

logins route: only post with joi validation for the request body.

In both posts (in users and logins) The json web token is put in the header of the response 
to make the user be logged in upon registering or lgging in.

Published to heroku: https://aswar-task.herokuapp.com / | https://git.heroku.com/aswar-task.git
so you can make GET, POST, PUT, and DELETE requests using Postman to endpoints like https://aswar-task.herokuapp.com/api/products or .../api/users or .../api/logins
