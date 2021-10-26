const { response } = require('express');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');

var Product = require('./model/product');
var WishList = require('./model/wishlist');

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/product',function(request,response){
    newTitle = request.body.title;
    if(!newTitle || newTitle ===""){
        Product.find({},function(err,findProduct){
            if(err){
                response.status(500).send({error:"Couldn't find the product"});
            }else{
                response.send(findProduct);
            }
        });
    }else{
        Product.find({title:newTitle},function(err,findProduct){
            if(err){
                response.status(500).send({error:"Couldn't find the product"});
            }else{
                response.send(findProduct);
            }
        });
    }
});
app.post('/product',function(request,response){
   // var product = new Product(request.body);//option 1
    //var product = new Product({title:request.body.title,price:request.body.price})//option 2;
    var product = new Product();//option 3
    product.title = request.body.title;//option 3
    product.price = request.body.price;//option 3
    product.save(function(err, savedProduct){
        if(err){
            response.status(500).send({error:"Couldn't save the product"});
        }else{
            response.send(savedProduct);
        }
    });
});

app.get('/wishlist',function(request,response){
    var wishListTitle = request.body.title;
    if(!wishListTitle || wishListTitle ===""){
        WishList.find({}).populate({path:'products',model:'Product'}).exec(function(err,findWishList){
            if(err){
                response.status(500).send({error:"Couldn't find the wishlist" });
            }else{
                response.send(findWishList);
            }
        });
    }else{
        WishList.find({title:wishListTitle},function(err,findWishList){
            if(err){
                response.status(500).send({error:"Couldn't find the wishlist" });
            }else{
                response.send(findWishList);
            }
        });
    }
});

app.post('/wishlist',function(request,response){
    var wishList = new WishList();
    wishList.title = request.body.title;
    wishList.save(function(err, saveWishList){
        if(err){
            response.status(500).send({error:"Couldn't create the wishlist"});
        }else{
            response.send(saveWishList);
        }
    });
});

app.put('/wishlist/product/add',function(request,response){
    Product.findOne({_id:request.body.productId},(err, product) => {
            if (err) {
                response.status(500).send({ error: "Couldn't add item to wishlist" });
            } else {
                WishList.updateOne({ _id: request.body.wishListId }, { $addToSet: { products: product._id } }, function (err, wishList) {
                    if (err) {
                        response.status(500).send({ error: "Couldn't add item to wishlist" });
                    } else {
                        response.send(wishList);
                    }
                });
            }
        });
});
// app.put('/product',function(request,response){
//     var title = request.body.title;
//     var ObjectId = request.body;
//     Product.find({"title":request.body.title},function(request,findProduct){
//         if(err){
//             response.status(500).send({error:"Couldn't find the product"});
//         }else{
//             response.send(findProduct);
//             var question = input("would you like edit this product");
//             if(question === si){
//                 Product.updateOne({ObjectId},{$set:{request.body}},function(err,editProduct){
//                     if(err){
//                         response.status(500).send({error:"Couldn't find the product"});
//                     }else{
//                         response.send(editProduct);
//                     }
//                 });
//             }else{
//                 response.status(500).send({error:"Couldn't find the product"});
//             }
//         }
//     });
// });

app.listen(3000,function(){
    console.log("Swag Shop API running on port 3000...");
});