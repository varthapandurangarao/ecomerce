//var now = require("date-now");
var dateTime = require('date-time');
var productsdata = [];

module.exports.list = function(req, res) {

	req.getConnection(function(err,connection){
       
       var query = connection.query('select o.totalprice,orderid as orderid,o.orderstatus,o.orderdate,u.name as user,p.name as product,c.name as Category FROM `order`as o LEFT JOIN user as u on o.userid=u.userid LEFT JOIN product as p on o.productid=p.productid LEFT JOIN Category as c on p.catid=c.catid', function(err, rows)
        {
           if(err)
                console.log("Error Selecting : %s ",err );
              
              res.render('orders',{page_title:"order - Node.js",data:rows}); 
         });
         
    });
}

//add user form//

module.exports.add = function(req, res) {
	req.getConnection(function(err,connection){
  var query = connection.query('select name,price,quantity,productid from product where status = "active"', function(err,rows) 
        {
            
            if(err){
                   console.log("Error Selecting : %s ",err );

            }

            else{
                productsdata = rows;
                
                 var query1 = connection.query('select name, userid from user',function(err,userrows)
                  {
            
                   if(err){
                        console.log("Error Selecting : %s ",err );

                    }
                    else{
                          res.render('addorder',{page_title:" Add orders ",data:rows,data1:userrows});
                    }
                });

            }
  	});
});
}
 
//adding user in database//

module.exports.save = function(req, res) {

	var input = JSON.parse(JSON.stringify(req.body));
    var baseprice={};
    
    req.getConnection(function (err, connection) {

      for (var i = 0; i < productsdata.length; i++) {
        if (productsdata[i].productid == input.productid){
          baseprice ={
             porderid : productsdata[i].productid, 
             pbaseprice : productsdata[i].price,
             pquntity : productsdata[i].quantity

          }
        }
    }
     var status;

     var totalprice = (baseprice.pbaseprice) * input.quantity;
     console.log(totalprice)
    if (input.quantity >= baseprice.pquntity) {
      status = "completed";
    }
    else
    {
      status = "progress"
      req.getConnection(function(err,connection){
          console.log(baseprice.pquntity)
          var  actuallquantity ={
              quantity : baseprice.pquntity - input.quantity 
          } 
       
        var query = connection.query("UPDATE product set ? WHERE productid = ? ",[actuallquantity,baseprice.porderid],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );

     
            console.log('product table updated')
                
           
         });
         
         
    });


    }
      var data = {
        productid :input.productid,
        userid : input.userid,
        baseprice : baseprice.pbaseprice,
        orderstatus : status,
        orderdate : dateTime(new Date(), {local: true}),
         totalprice : totalprice,
        quantity : input.quantity
      }; 
       console.log(data)
        var query = connection.query("INSERT INTO `order` set ? ",data, function(err, rows)
        {
            if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/orders');
          
        });
    
    });
};





//deleting user data//

module.exports.delete = function(req, res) {
	var id  = req.params.id;
	console.log(id);
	req.getConnection(function(err, connection) {
		connection.query("delete from `order` where orderid = ?",[id], function(err, rows) {
			if (err) {
				console.log(err);
			} else {
				res.redirect('/orders');
			}
		});
	});
}