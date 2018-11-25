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
    urlDataBase = 'mongodb://cafe-user:cafe2018@ds115854.mlab.com:15854/cafe';
}

process.env.URLDB = urlDataBase;