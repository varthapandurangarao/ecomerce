var dateTime = require('date-time');

exports.list = function(req, res){
  
  req.getConnection(function(err,connection){
       
        var query = connection.query('select p.*, c.name as categoryName from product as p left join Category as c on p.catid = c.catid', function(err, rows)
        {
           if(err)
                console.log("Error Selecting : %s ",err );
              
              res.render('product',{page_title:"product - Node.js",data:rows}); 
         });
         
    });
  
}


exports.add = function(req, res){
 req.getConnection(function(err, connection) {
    var query = connection.query('select name, catid from Category where status = "active"', function(err, rows) {
      if(err) {
        console.log(err);
      } else {
        res.render('add_product.ejs',{page_title:"Add Product - Node.js", data: rows});     
      }
    });
  });
};
exports.edit = function(req, res){
    
    var productid = req.params.id;
    
    req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM product WHERE productid = ?',[productid],function(err,rows)
        
        {
            
        if(err)
            {
                console.log("Error Selecting : %s ",err );
            }else{ 
        var q = connection.query('select name,catid from Category where status = "active"', function(err, catrows) 
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
            res.render('edit_product',{page_title:"Edit product - Node.js",data:rows,data1:catrows});
              
         }); 
         }   
         });

         
    }); 
};

/*Save */

exports.save = function(req,res){
              
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    req.getConnection(function (err, connection) {
        var data;
       if(input.active == 'active'){
       data = {
            
            catid : input.catid,
            name    : input.name,
            description : input.description,
            price : input.price,
            quantity : input.quantity,
            image : input.image,
            status : input.active
          
        
        };
      }
       else{
        data = {
             catid : input.catid,
            name    : input.name,
            description : input.description,
            price : input.price,
            quantity : input.quantity,
            image : input.image
          };
        }
        
        var query = connection.query("INSERT INTO product set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
          res.redirect('/product');
          console.log(data);
          console.log("save successfully " );
        });
    
    });
};

exports.save_edit = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var productid = req.params.id;
    
    req.getConnection(function (err, connection) {
        var data;
        if(input.active == 'active' && input.myimage !=''){
       data = {
            
             catid : input.catid,
            name    : input.name,
            description : input.description,
            price : input.price,
            quantity : input.quantity,
            image : input.myimage,
            status : 'active',
            updatedOn:dateTime(new Date(), {local: true})
        
        };
              console.log('hooooooooooooo');

      }
      else if(input.myimage !=''){
        data = {
          catid : input.catid,
            name    : input.name,
            description : input.description,
            price : input.price,
            quantity : input.quantity,
            image : input.myimage,
            status : 'inactive',
            updatedOn:dateTime(new Date(), {local: true})
        
        };
        console.log('hooohhoooooooooo');
      }
      else if(input.active =='active' && input.myimage ==''){
       data = {
            
             catid : input.catid,
            name    : input.name,
            description : input.description,
            price : input.price,
            quantity : input.quantity,
            status : 'active',
            updatedOn:dateTime(new Date(), {local: true})
        
        };
        console.log('hi');
      }
      else {
        data = {
          catid : input.catid,
            name    : input.name,
            description : input.description,
            price : input.price,
            quantity : input.quantity,
            status : 'inactive',
            updatedOn:dateTime(new Date(), {local: true})
        
        };
                console.log('hiiiii');

      }
        
        connection.query("UPDATE product set ? WHERE productid = ? ",[data,productid], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/product');
          console.log("saved successfully product id " + productid , data.name);
        });
    
    });
};

exports.delete_product = function(req,res){
  var productid = req.params.id;
  req.getConnection(function (err, connection) {
    connection.query("DELETE FROM product  WHERE productid = ? ",[productid], function(err, rows){
      if(err)console.log("Error deleting : %s ",err );
      res.redirect('/product');
      console.log("deleted successfully product id   " +productid);

    });
  });
};