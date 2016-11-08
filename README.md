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

1. You need to have docker installed and have the process running.
2. Make sure to have the **Dockerfile, gunicorn.py and requirements.txt** all in level.
3. If you want to use a DB then update the values for the **SQLALCHEMY_DATABASE_URI** in app_config.py with the DB info. For example for a SQL Db it would be of the following format
    **SQLALCHEMY_DATABASE_URI = 'mysql://username:password@ip-address/db_name'**

##### Deployment
1. Use the dockerfile and run the following once inside the deployment folder
      **docker build --tag=tech-radar .**
2. Run docker with
      **sudo docker run -p 80:8080 -d tech-radar**

Once above is completed, you should have your app up and running.


### Based On
 Based on basic tech radar app created by [tnunamak/tech-radar].




### License

Open source under Apache License v2.0 (http://www.apache.org/licenses/LICENSE-2.0)



