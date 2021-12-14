# fullstack-mini-project
This repo is intended to be forked by applicants to validate Fullstack knowledge using MERN Stack technologies

# Create a MERN Application

During the development of most web applications, there are common tasks, basic features, and implementation code repeated across the process. The same is true for the MERN applications. 

Please cover the following requirements and start with the backend implementation of a MERN skeleton, using Node, Express, and MongoDB (MySQL or Postgres if you prefer):

* User CRUD and auth in a MERN application
* Handling HTTP requests with an Express server 
* Using a Mongoose schema for a user model 
* APIs for user CRUD and auth
* Auth with JWT for protected routes Running backend code and checking APIs 

## Feature breakdown 

In the skeleton application, add the following use cases with user CRUD and auth functionality implementations: 

* __Sign up:__ Users can register by creating a new account using an email address 
* __User list:__ Any visitor can see the list of all registered users 
* __Authentication:__ Registered users can sign in and sign out 
* __Protected user profile:__ Only registered users can view individual user details after signing in 
* __Authorized user edit and delete:__ Only a registered and authenticated user can edit or remove their own user account details 

## User model

The user model will define user details to be stored in the MongoDB database, and also handle user-related business logic such as password encryption and user data validation. The user model for this skeletal version will be basic with support for the following attributes: 

Field&nbsp;name | Type | Description
---------- | ---- | -----------
name | String | Required field to store user's name
email | String | Required unique field to store user's email and identify each account (only one account allowed per unique email) 
password | String | Required field for authentication, the database will store the encrypted password and not the actual string for security purposes 
created | Date | Automatically generated timestamp when a new user account is created 
updated | Date | Automatically generated timestamp when existing user details are updated

## API Endpoints for user CRUD

To enable and handle user CRUD operations on the user database, the backend will implement and expose API endpoints that the frontend can utilize in the views, as follows: 

Operation | API route | HTTP method
--------- | --------- | -----------
Create a user | /api/users | POST
List all users| /api/users | GET
Fetch a user | /api/users/:userId | GET
Update a user | /api/users/:userId | PUT
Delete a user | /api/users/:userId | DELETE
User sign-in | /auth/signin | POST 
User sign-out (optional) | /auth/signout | GET 

Some of these user CRUD operations will have protected access, which will require the requesting client to be either authenticated, authorized, or both.  The last two routes are for authentication and will allow the user to sign in and sign out. 

## Auth with JSON Web Tokens 

To restrict and protect access to the user API endpoints according to the skeleton features, the backend will need to incorporate authentication and authorization mechanisms. There are a number of options when it comes to implementing user auth for web applications. The most common and time tested option is the use of sessions to store user state on both the client and server side. But a newer approach is the use of JSON Web Token  ( JWT ) as a stateless authentication mechanism that does not require storing user state on the server side. 

Both approaches have strengths for relevant real-world use cases. However, for the purpose of keeping the code simple, and because it pairs well with the MERN stack, please use JWT for auth implementation.

## Add a React Frontend

A web application is incomplete without a frontend. It is the part that users interact with and it is crucial to any web experience. For that matter, please use React to add an interactive user interface to the basic user and auth features implemented for the backend of the MERN application that you started building in the previous steps. 

## Skeleton frontend 

In order to fully implement the application features discussed in the Feature breakdown section, please add the following user interface components to your base application: 

* __Home page:__ A view that renders at the root URL to welcome users to the web application 
* __User list page :__ A view that fetches and shows a list of all the users in the database, and also links to individual user profiles 
* __Sign-up page:__ A view with a form for user sign-up, allowing new users to create a user account and redirecting them to a sign in page when successfully created 
* __Sign-in page:__ A view with a sign-in form that allows existing users to sign in so they have access to protected views and actions 
* __Profile page:__ A component that fetches and displays an individual user's information, is only accessible by signed-in users, and also contains edit and delete options, which are visible only if the signed-in user is looking at their own profile 
* __Edit profile page:__ A form that fetches the user's information in the form, allows them to edit the information, and is accessible only if the logged-in user is trying to edit their own profile 
* __Delete user component:__ An option that allows the signed-in user to delete only their own profile after confirming their intent 
* __Menu navigation bar:__ A component that lists all the available and relevant views to the user, and also helps to indicate the user's current location in the application

The following React component tree diagram shows all the React components you need to develop to build out the views for this application:

![React Tree](https://github.com/ulfix/fullstack-mini-project/blob/master/dbd95d4d-c412-47f9-af09-4e8e52f511aa.png)

## Feel free to use tools such as

* express-generator
* create-react-app
* mongoose or sequelize
* react-bootstrap
* whatever makes you more efficient

## We expect to run your code with the following steps

* Clone your repository
* Open command line in the cloned folder,
* To install dependencies, run npm install or yarn
* To run the application for development, run npm run development or yarn development
* Open localhost:3000 in the browser

## Extra points

* Deploy your app to AWS, Azure or Heroku and send your link to view it running
* Use Docker to containerize the application
