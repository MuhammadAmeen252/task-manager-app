//Initializing mongodb to server command:
//C:\Users\Public\mongodb\bin\mongod.exe --dbpath=C:\Users\Public\mongodb-data
const mongoose=require('mongoose')

mongoose.connect((process.env.MONGODB_URL),{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
})

// add this script in package.json
// "scripts": {
//     "start": "node src/index.js",
//     "dev": "nodemon src/index.js"
//   }

////save nodemon as developement dependencey command
// npm i nodemon --save-dev 
//npm i express
