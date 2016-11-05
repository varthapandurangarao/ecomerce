
/*
 * GET users listing.
 */
var dateTime = require('date-time');
exports.list = function(req, res){
  
  req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM Category',function(err,rows)
        {
           if(err)
                console.log("Error Selecting : %s ",err );
              
              res.render('category',{page_title:"category - Node.js",data:rows}); 
         });
         
         //console.log(query.sql);
    });
  
}


exports.add = function(req, res){
  res.render('add_category',{page_title:"Add category - Node.js"});
};

exports.edit = function(req, res){
    
    var catid = req.params.id;
    
    req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM Category WHERE catid = ?',[catid],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
            res.render('edit_category',{page_title:"Edit category - Node.js",data:rows});
                
           
         })
         
         //console.log(query.sql);
    }); 
};

/*Save the customer*/

exports.save = function(req,res){
              
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    req.getConnection(function (err, connection) {
        var data;
      if(input.active == 'active'){
         data = {
            
            name    : input.name,
            description : input.description,
            status:input.active
        };
      }
      else{
        data = {
            
            name    : input.name,
            description : input.description
          
        };
      }

        
        var query = connection.query("INSERT INTO Category set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );

              console.log(rows);
         
          res.redirect('/category');
          
        });
        
       // console.log(query.sql); get raw query
    
    });
};

exports.save_edit = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var catid = req.params.id;
    
    req.getConnection(function (err, connection) {
        
        var data;
     
      if(input.active == 'active'){
         data = {
            
            name    : input.name,
            description : input.description,
            updatedOn:dateTime(new Date(), {local: true}),
            status:'active'
        };
      }
      else{
        data = {
            
            name    : input.name,
            description : input.description,
            updatedOn:dateTime(new Date(), {local: true}),
            status:'inactive'
        };
      }
        
        connection.query("UPDATE Category set ? WHERE catid = ? ",[data,catid], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/category');
          
        });
    
    });
};

exports.delete_category = function(req,res){
  var catid = req.params.id;
  req.getConnection(function (err, connection) {
    connection.query("DELETE FROM Category  WHERE catid = ? ",[catid], function(err, rows){
      if(err)console.log("Error deleting : %s ",err );
      console.log(rows);
      res.redirect('/category');
      console.log(rows);

    });
  });
};