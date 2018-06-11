# nodejs-blog

#### Features atm:
* Login/Registration
* User roles
* Add post
* API Authentication
* Pagination
* Add comments if you are logged
* Edit/Delete posts if admin
* ???

#### Libs used
* passpost.js
* body-parser
* bcrypt
* express
* express-session
* ejs (view engine)
* mongoose

#### Still needs to be done
* Post/Comment votes
* Admin dashboard
  * edit user permissions
  * ban users
  * ???
* Profile
* Live chat
* Code/folder refactor

#### For the FE
* Bootstrap
* Material-bootstrap design
* jQuery
* Font-Awesome

The blog is written to be used from me. Still if you want to try it the steps are:

1. Download the zip or clone the repo
1. (If you don't have Nodejs you have to install it) open nodejs command promt and change the directory to the folder containing the repo
1. run *npm install* and wait
1. open configurations/app_config.js and change the *dbUrl* value to your **mongo db**
1. run *npm start* open the browser and head to **localhost:3000**

Since not everyting is ready, when you register your user you have to open the db and manually update the user role to **admin**. By default new users have role *member*.

A lot of work has to be done/changed so its way ahead of perfect.

### You can use the db provided in the app_config, its just for the tests.

Site Demo at [Heroku](http://denisx.herokuapp.com/)
