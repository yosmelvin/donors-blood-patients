# Blood Donation Management System

## Installation

1. Unzip
2. Set up server port in `package.json` or use `npm config set bdms:port PORT`
3. Set up MongoDB connection url in `package.json` or use `npm config set bdms:db URL`
4. Run `npm start`

## Demo
 
https://donors-blood-patients.herokuapp.com/

## Dependencies

1. Angular1.
2. jQuery in one line of code `loadScript`. It would be replaced by vanila JS at refactoring time
3. Bootstrap for prototyping
4. Express
5. Socket.io
6. MongoDB
7. Google Maps

## Design

### Backend

Single collection Donator. Simple CRUD REST API as Express controller. After create, update and delete Socket.io emits event for all. Find query allow bound rect conditions.

Client controller deliver static files (js, css), and index.html at any other requests.

### Frontend

Map is a directive, becouse I need element access for Google Maps API. Displaing pins on map idle after bounds change inside map directive. Donator pins inside map directive is bad architecture. I thought for a `layer` directive for it, but mark it task with low priority.

All UI switching using ngRoute. It best for having no cost permanent links for all app points, e.g. `/become`, `/view/:donator`, `/manage/:donator`.

Single data-service `Donators` work with REST API and using ngResource. It has two templates: form mode and view mode.

# Task

Develop a single page blood donation management system to facilitate the patients from all around the world, find blood donors near them.

##Functional Specifications:

The app will provide a bridge between the patients and the volunteer blood donors.

The index page of application would load a map. Preferably it should be navigated to visitors’ location or the user can use search to navigate.

###For Donors:

Donors can find their location and tap/click on it. On clicking it should open a form in popup, where the donor can add the following information:

* First Name
* Last Name
* Contact Number
* Email Address 
* Blood Group

All these fields should have proper validation i.e. proper email address and a proper telephone number (+xx xxx xxxx xxx | 00xx xxx xxxx xxx).

On submitting the form a success message should be shown to user and his information along with his address, ip and geographical coordinates should be saved in database. 
A unique private link should be generated and displayed to him, from where he can edit or delete his posting.

###For Patients:

The map on index page should show all the posts in database as small pins at their respective coordinates. These pins should be lazy loaded, so only the pins that belong to the visible area of map should be loaded. As the user navigates the map, more pins should load accordingly.

On clicking any pin, a popup should appear displaying the donor’s information. In place of email and phone number, there should be a text (click to show). When the user clicks on this text, it should replace with the respective information. (This is to avoid bots from reading donor’s email address and contact information)

If any pin changes (a user made change to his post or deleted it) The change should be visible real time to other users.

