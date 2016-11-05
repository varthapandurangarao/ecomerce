
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

//load customers route
var category = require('./routes/category'); 
var product = require('./routes/product'); 
var users = require('./routes/users');
var orders = require('./routes/orders');

var app = express();

var connection  = require('express-myconnection'); 
var mysql = require('mysql');

// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());


app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/

app.use(
    
    connection(mysql,{
        
        host: 'localhost',
        user: 'root',
        password : '123',
        port : 3306, //port mysql
        database:'Nodejs'

    },'pool') //or single

);

app.get('/users', users.list);
app.get('/users/add', users.add);
app.post('/users/add', users.save);
app.get('/users/delete/:id', users.delete);
app.get('/users/edit/:id', users.edit);
app.post('/users/edit/:id', users.save_edit);

app.get('/', routes.index);
app.get('/category', category.list);
app.get('/category/add', category.add);
app.post('/category/add', category.save);
app.get('/category/delete/:id', category.delete_category);
app.get('/category/edit/:id', category.edit);
app.post('/category/edit/:id',category.save_edit);

app.get('/', routes.index);
app.get('/product', product.list);
app.get('/product/add', product.add);
app.post('/product/add', product.save);
app.get('/product/delete/:id', product.delete_product);
app.get('/product/edit/:id', product.edit);
app.post('/product/edit/:id',product.save_edit);

app.get('/orders', orders.list);
app.get('/orders/add',orders.add);
app.post('/orders/add',orders.save);
app.get('/orders/delete/:id',orders.delete);




app.use(app.router);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
