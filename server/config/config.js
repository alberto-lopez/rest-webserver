//==========
//  Port
//==========

process.env.PORT = process.env.PORT || 3005;

//==============
//  Environment
//==============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//==============
//  Database
//==============

let urlDataBase = '';

if (process.env.NODE_ENV === 'dev'){
    urlDataBase= 'mongodb://localhost:27017/cafe'
}else{
    urlDataBase = process.env.MONGO_URI;
}

process.env.URLDB = urlDataBase;