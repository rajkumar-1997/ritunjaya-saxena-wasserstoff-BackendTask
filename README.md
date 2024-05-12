# ritunjaya-saxena-wasserstoff-BackendTask

#local installation
1.to install this project locally we required to get clone url from github from projects repository then 2.2.running git clone url command in vs code.
3.use npm i command to install all dependencies
4.use npm run start:dev commnad to run the application
5.person who is installing this application locally must use his own .env keys

#Database
1.used postgreSQL for storing the data. which having 2 tables Users and Images
2.Users table having any user's id ,name, email id, encrypted password, role
3.Images table having column as id, path , annotations, userId,status
4.relation between Users table and Images table is one to many
5.used sequelize orm to store and update data in db

#services
1.used aws s3 service for storing images in cloud and getting path url
2.used google cloudvision api for getting automatic annotations for images

#middlewares
1.having 2 middleware files. one as authMiddleware.js for cheking authentication for users and checking 2.2.2.admin roles and another fileMiddleware.js for processing data of upload images

#utilities
1.used json2csv package for converting json data to csv and used js2xmlparser package for converting json 2.data to xml formate in utils/converter.js

#apis
1.http://localhost:3000/user/signup api for doing signup for both user and admin
2.http://localhost:3000/user/login api for doing login by both admin and user
3.http://localhost:3000/image/uploadImage api for uploading images to aws s3 and getting image path then getting annotations using cloudvision api
4.http://localhost:3000/image/submitAnnotations api for updating annotations by user
5.http://localhost:3000/admin/getPendingList api for getting all image list which having status pending
6.http://localhost:3000/admin/updateImageStatus api for update status of image as approved or rejected
7.http://localhost:3000/admin/exportAnnotations api for exporting annotations of images which having status approved
