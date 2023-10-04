var blogmodel = require('../model/blogmodel');
var usermodel = require('../model/usermodel');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
const storage = require('node-persist');

// single_blog
var cnt = 0

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'cdmiravinarola@gmail.com',
      pass: 'kgsphynjjwnhwwvm'
    }
  });


// ############################## User Api ##############################

exports.register = async (req,res) => {

    var newemail = req.body.email
    var email = await usermodel.find({email:newemail});

    if(email.length == 0)
    {
        var b_pass = await bcrypt.hash(req.body.password, 10);

        req.body.password = b_pass;
        req.body.image = req.file.originalname;

        var data = await usermodel.create(req.body);

        console.log(data.email);

        var mailOptions = {
            from: 'cdmiravinarola@gmail.com',
            to: data.email,
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });

        res.status(200).json({
            status:"Register Success",
            data
        })
    }
    else
    {
        res.status(200).json({
            status:"Email Is Alredy Register"
        })
    }
}

exports.get_data = async (req,res) => {

    var data = await usermodel.find();

    res.status(200).json({
        data
    })
}

exports.login = async (req,res) => {

    var email = req.body.email;
    var data = await usermodel.find({"email":email});

    await storage.init( /* options ... */ );
    var id = await storage.getItem('user_id');
     
    if(id == undefined)
    {
        if(data.length!=0)
        {
            
                bcrypt.compare(req.body.password, data[0].password, async function(err, result) {

                    if(result==true)
                    {
                        await storage.init( /* options ... */ );
                        await storage.setItem('user_id',data[0].id)

                        var token = jwt.sign({ id:data[0].id}, 'cdmi');
                    
                        res.status(200).json({
                            status:"Login Successful",
                            token
                        })
                    }
                    else
                    {
                        res.status(200).json({
                            status:"Check Your Email And Password"
                        })
                    }
                });
                
        }
        else
        {
            res.status(200).json({
                status:"Check Your Email And Password"
            })
        }
    }
    else
    {
        res.status(200).json({
            status:"Plzz Logout Current User"
        })
    }
}

exports.logout = async (req,res) => {

    var newemail = req.body.email
    var email = await usermodel.find({email:newemail});
 

    if(email.length != 0)
    {
        await storage.init( /* options ... */ );
        await storage.clear();
    
        res.status(200).json({
            status:"User Logout Successful"
        })
    }
    else
    {
        res.status(200).json({
            status:"Check Your Email And Password"
        })

    }
}

// ############################## Blog Api ##############################

exports.add_blog = async (req,res) => {

    await storage.init( /* options ... */ );
    var user_id = await storage.getItem('user_id');

        req.body.postedBy = user_id

    var data = await blogmodel.create(req.body);

    res.status(200).json({
        status:"Data Added",
        data
    })
}
exports.view_blog  = async (req,res) => {

    var data = await blogmodel.find().populate("postedBy");

    res.status(200).json({
        data
    })
}

// manage

exports.manage_blog = async (req,res) => {
    
    var id = req.params.id;
    var data = await blogmodel.findByIdAndUpdate(id,req.body);

    res.status(200).json({
        status:"Update Success"
    })
}

exports.delete_blog = async (req,res) => {

    var id = req.params.id;
    var data = await blogmodel.findByIdAndDelete(id);
    
    res.status(200).json({
        sattus:"Delete Success"
    })
}

// Singale Blog

exports.single_blog  = async (req,res) => {

    id = req.params.id
    var data = await blogmodel.find();

    for (let i=0; i<data.length; i++){
        if(data[i].id==id)
        {
            cnt = 1
        }else
        {
            null
        } 
    }

    if(cnt == 1){
        var newData = await blogmodel.findById(id)
        cnt = 0
        res.status(200).json({
            status: "Find Successful",
            newData
        })
    }
    else{
        res.status(200).json({
            status: "Data Not In Database",
        })
    }
}