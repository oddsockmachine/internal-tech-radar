# Technology Radar App

Technology Radar app enables you to have a radar of various technologies used by the Organization.
 It also has an ability to have different groups having their own technology radar and have different Status
  -- Adopt, Trail, Assess and Hold and  different categories -- Tools,Techniques,Platforms and Languages.


# Introduction
The app has a landing page that displays all the groups that belong to the organization and by clicking on the group
 it will take you to the radar for that group. By default this a view only mode, but to have ability to add/edit groups
  and the radar details, there is an admin mode.


**WEB URLs**  :

   **/** or **/#/groups** -- Landing page  with the list of groups
   **/#/radar/<group_name>** -- Technology radar for that group
   **/#/admin** -- Loads the landing page in **Admin mode** -- that enables you to add/edit group from the landing page
   and when navigated to the radar page(**/#/radar/aurora?update=true**) from here it adds a flag **?update** as true
   and the radar is also in edit mode.
  This app is an AngularJS based Flask application running on SQLite DB that can be easily switched to real time DB.


**API URLS**:

**/groups** [**GET**] -- List of Groups in the Organization
**/groups** [**POST**] -- Create groups based on the JSON  ({groups: ["TEST", "TESTGROUP"]}) passed
**/groups/delete** [**POST**] -- Delete groups based on the  group name in JSON  ({groups: "testgroup"}) passed
**/technology?group=<group_name>**[**GET**] -- Get the list of Technologies for that group
**/technology**[**POST**] -- Create a technology for the group based on the JSON
sent({"category":"Tools","status":"Adopt","tech":{"description":""},"group":"cloud","technology":"GIT","description":""})
**/technology?update=true**[**POST**] -- Update a technology for the group based on the JSON
sent({"category":"Tools","status":"Adopt","tech":{"description":""},"group":"cloud","technology":"GIT","description":""})
**/technology/delete**[**POST**] -- Delete a technology for a given group
**/table** -- USED ONLY TO CREATE TABLES FOR THE FIRST TIME. DON'T USE IT ONCE TABLES ARE CREATED.

# Requirements
 For **Build Process**
   [NodeJS] -- For Build Process
   [Grunt] -- Minify and Concat all the assets

Based on the technology used for development
   [Docker] -- For Container based development setup, download **docker**
   [Cloud Foundry] -- For Cloud based PAAS development setup, download **[Cloud Foundry CLI]**, Create an account at the corresponding [Cloud Foundry endpoints @ THD].

# Build Process
Make sure to have [NodeJS] and [Grunt] installed to build all the assets needed for the application. Once you have the above downloaded, do the following

    cd technolody-radar
    npm install
    grunt

This will minify and concat all the css and js needed for the application and place it under **static/assets/**.

# Setup/Installation Instructions

### Using Docker
To have code deployed in container based development use docker.

##### Setup

1. You need to have docker installed if not follow the steps in (https://docs.docker.com/engine/installation/ubuntulinux/) and have the process running.
2. Make sure to have the **Dockerfile, gunicorn.py and requirements.txt** all in level.
3. If you want to use a DB then update the values for the **SQLALCHEMY_DATABASE_URI** in app_config.py with the DB info. For example for a SQL Db it would be of the following format
    **SQLALCHEMY_DATABASE_URI = 'mysql://username:password@ip-address/db_name'**

##### Deployment
1. Use the dockerfile and run the following once inside the deployment folder
      **sudo docker build --tag=tech-radar .**
2. Run docker with
      **sudo docker run -p 80:8080 -d tech-radar**

Once above is completed, you should have your app up and running.

---
### Using Cloud Foundry

##### Setup
 1. You need to have Cloud Foundry CLI installed if not do so from [Cloud Foundry CLI].
 2. Make sure to have an account at one of the [Cloud Foundry endpoints].
 3. Through CF CLI, login into the corresponding endpoint. For example, lets say you have an account for   [Console Non Production]  and want to deploy it to it,then you will have to login into [API Non Production] using

        cf login
        > Enter the API end point here
        > Enter the email and password you have for that account
        > Select space if any

 4. If you want to use a DB then update the values for the **SQLALCHEMY_DATABASE_URI** in app_config.py with the DB info. For example for a SQL Db it would be of the following format
    **SQLALCHEMY_DATABASE_URI = 'mysql://username:password@ip-address/db_name'**
 5. Make sure you have the **procfile, manifest.yml, .cfignore files** under the working directory, copy the files from cloud_foundry folder into the current directory.

        cp cloud_foundry/* .
 6. **NOTE**: For Windows, there is an issue with node_modules folder whenwe deploy the code to Cloud Foundry. MAke sure to remove the node_modules folder once assests folder has all the js and css files. [node_module_issue]

##### Deployment
1. Make sure you are inside the working directory (**technology-radar**)
2. Run the following to push the code to the endpoint

        cf push technology-radar

3. Once above is completed, you should have your app up and running at http://technology-radar.apps-np.homedepot.com/ .

### Local Development using Virtual Environment
You can deploy the code locally and develop it using virtualenv.

##### Setup

1. Make sure to have python installed in your system.
2. Run the following commands to get the app running locally

        cd technology-radar
        virtualenv tech-radar
        pip install -r requirements

3. If you want to use a DB then update the values for the **SQLALCHEMY_DATABASE_URI** in app_config.py with the DB info. For example for a SQL Db it would be of the following format
    **SQLALCHEMY_DATABASE_URI = 'mysql://username:password@ip-address/db_name'**

##### Deployment
1. Run the app locally with
      **python wsgi.py**

Once above is completed, you should have your app up and running.

# Additional Information
### Database Info
There are 2 tables needed for this app to work

 * groups --  This table has information about the different groups in the organization and this group id is used in technology
 * technology -- This is updated through the UI, this table has information about different technologies used in the selected group.

The sql file for updating the DB and schema file is also part of the codebase(**devtools.db**)

### ADMIN Mode
By default the app is visible to all, in order to have the groups/technology entered, there is a admin mode. During this mode you can update the data as needed.

### Technologies
* Python > 2.0
* [Flask-SQLAlchemy] -- Create Models that map to the DB
* [UnderscoreJS] -- For data manipulation
* [AngularJS] -- Front End routing, templating,etc.
* [Twitter Bootstrap] -- For RWD
* [NodeJS] --  For Build Process
* [Grunt] -- Minify and Concat all the assets
* [jQuery] -- For some Js features
* [D3.js] -- Data visualization
* [Flask] -- Render the main page and API calls that make DB calls

### Based On
 Based on basic tech radar app created by [tnunamak/tech-radar].




### License

Open source under Apache License v2.0 (http://www.apache.org/licenses/LICENSE-2.0)




   [NodeJS]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [jQuery]: <http://jquery.com>
   [AngularJS]: <http://angularjs.org>
   [Grunt]: <http://gruntjs.com>
   [D3.js]: <http://d3js.org>
   [UnderscoreJS]:  <http://underscorejs.org/#>
   [Flask]: <flask.pocoo.org>
   [Flask-SQLAlchemy]: <flask-sqlalchemy.pocoo.org/>
   [tnunamak/tech-radar]:<https://github.com/tnunamak/tech-radar.git>
   [Docker]: <https://docs.docker.com/engine/installation/ubuntulinux/>
   [Cloud Foundry]: <http://pivotal.io/platform>
   [Cloud Foundry CLI]: <https://console.run.pivotal.io/tools>
   [Console Non Production]: <https://console.run-np.homedepot.com>
   [API Non Production]: <https://api.run-np.homedepot.com>
   [node_module_issue]:<https://developer.ibm.com/answers/questions/29227/why-is-cf-push-choking-on-a-file-thats-in-cfignore.html>


