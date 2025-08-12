const express = require("express");
const router = express.Router();
const exe = require("../conn");
const nodemailer = require("nodemailer")

router.get("/",async function(req,res){
  res.render("admin/Login.ejs")
})



router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, must-revalidate, private'); // prevent caching
  next();
});

router.post("/login",async function(req,res){
  var d=req.body;
  var data = await exe(`SELECT * FROM admin WHERE email='${d.email}' AND password='${d.password}'`)
  console.log(data)
    if(data.length>0){
        req.session.admin_id= data[0].admin_id;
        res.redirect("/admin/dashbord")
        console.log(req.session.admin_id)
    }else{
        res.redirect("/admin")
    }
  
})

router.get("/logout",function(req,res){
      req.session.destroy(err => {
    if (err) {
      res.send("Logout failed");
    }
      res.redirect("/admin") 
  });
    
})

router.get("/profile",async function(req,res){
  var admin = await exe(`SELECT * FROM admin`);
      if(req.session.admin_id==undefined){
        res.redirect("/admin")
    }else{
         res.render("admin/Profile.ejs",{admin:admin[0]});
    }
  
})

router.post("/update_profile",async function(req,res){
  var d = req.body;
      if (req.files && req.files.image) {
        var image = new Date().getTime() + ".jpg";
        req.files.image.mv("public/upload/" + image);
        await exe(`UPDATE admin SET photo='${image}' WHERE admin_id='1'`);
    }

    var sql=`UPDATE  admin  SET name=?,email=?,mobile=?,password=?`;
    var data = await exe(sql,[d.name,d.email,d.mobile,d.password])
  res.redirect("/admin/profile")
})

router.get("/dashbord",async function(req,res){
    var orders= await exe(`SELECT * FROM orders`);
    var comp_orders =  await exe(`SELECT * FROM orders WHERE order_status = 'completed'`)
    var visit = await exe(`SELECT * FROM users`)
    var projects = await exe("SELECT *  FROM paintings WHERE status='active'")
    var admin = await exe(`SELECT * FROM admin`);

    if(req.session.admin_id==undefined){
        res.redirect("/admin")
    }else{
         res.render("admin/index.ejs",{orders:orders.length,comp_orders:comp_orders.length,visit:visit.length,projects:projects.length,admin:admin[0]});
    }
})

router.get("/home",async function(req,res){
    var title = await exe(`SELECT * FROM hero_title WHERE status = 'active'`)
    var admin = await exe(`SELECT * FROM admin`);
    var hero_section= await exe(`SELECT * FROM hero_section`)
    if(req.session.admin_id==undefined){
        res.redirect("/admin")
    }else{
         res.render("admin/Hero.ejs",{title,hero_section:hero_section[0],admin:admin[0]});
    }
    
})

router.get("/delete_title/:id",async function(req,res){
    await exe(`UPDATE hero_title SET status='deleted' WHERE title_id = '${req.params.id}' `)
    if(req.session.admin_id==undefined){
        res.redirect("/admin")
    }else{
        res.redirect("/admin/home")
    }
    
})

router.post("/save_hero_section",async function(req,res){
    var d = req.body;
        if (req.files && req.files.image1) {
        var image1 = new Date().getTime() + ".jpg";
        req.files.image1.mv("public/upload/" + image1);
        await exe(`UPDATE hero_section SET image1='${image1}' WHERE id='1'`);
    }

        if (req.files && req.files.image2) {
        var image2 = new Date().getTime() + ".jpg";
        req.files.image2.mv("public/upload/" + image2);
        await exe(`UPDATE hero_section SET image2='${image2}' WHERE id='1'`);
    }

        if (req.files && req.files.image3) {
        var image3 = new Date().getTime() + ".jpg";
        req.files.image3.mv("public/upload/" + image3);
        await exe(`UPDATE hero_section SET image3='${image3}' WHERE id='1'`);
    }


        if (req.files && req.files.image4) {
        var image4 = new Date().getTime() + ".jpg";
        req.files.image4.mv("public/upload/" + image4);
        await exe(`UPDATE hero_section SET image4='${image4}' WHERE id='1'`);
    }


        if (req.files && req.files.image5) {
        var image5 = new Date().getTime() + ".jpg";
        req.files.image5.mv("public/upload/" + image5);
        await exe(`UPDATE hero_section SET image5='${image5}' WHERE id='1'`);
    }


        if (req.files && req.files.image6) {
        var image6 = new Date().getTime() + ".jpg";
        req.files.image6.mv("public/upload/" + image6);
        await exe(`UPDATE hero_section SET image6='${image6}' WHERE id='1'`);
    }

    var sql =` UPDATE hero_section SET description=? ,button_text =? WHERE id='1'`;
    await exe(sql,[d.description,d.button_text]);
    res.redirect("/admin/home")
})

router.post("/save_hero_title",async function(req,res){
     var  title = req.body.title;
     var sql = `INSERT INTO hero_title (title) VALUES (?)`;
     var data = await exe(sql,[title]);
    res.redirect("/admin/home")
})



router.get("/orders",async function(req,res){
    var orders = await exe(`SELECT * FROM orders ORDER BY id DESC`);
    var admin = await exe(`SELECT * FROM admin`);
    if(req.session.admin_id==undefined){
        res.redirect("/admin")
    }else{
        res.render("admin/Orders.ejs",{orders,admin:admin[0]});
    }
    
})

router.get("/updatestart/:id",async function(req,res){

    await exe(`UPDATE orders SET order_status ='working' WHERE id='${req.params.id}'`);

            const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
              user: "dattapadre7249@gmail.com",
              pass: "ibip cill mvek iypo",
            },
          });


          var OTP=Math.floor(Math.random() * 9000) + 1000;
          req.session.otp = OTP;
          
          // async..await is not allowed in global scope, must use a wrapper
          async function main() {
            // send mail with defined transport object
            const info = await transporter.sendMail({
              from: 'Dattapadre', // sender address
              to: `${req.query.email}`, // list of receivers
              subject: `Visit new user on site`, // Subject line
              text: "Hello world?", // plain text body
              html: `your Work Start`, // html body
            });
          
            console.log("Message sent: %s", info.messageId);
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
          }

            main().catch(console.error);

    if(req.session.admin_id==undefined){
        res.redirect("/admin")
    }else{
        res.redirect("/admin/orders")
    }

    
})




router.get("/updateworking/:id",async function(req,res){

        await exe(`UPDATE orders SET order_status ='done' WHERE id='${req.params.id}'`);

            const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
              user: "dattapadre7249@gmail.com",
              pass: "ibip cill mvek iypo",
            },
          });


          var OTP=Math.floor(Math.random() * 9000) + 1000;
          req.session.otp = OTP;
          
          // async..await is not allowed in global scope, must use a wrapper
          async function main() {
            // send mail with defined transport object
            const info = await transporter.sendMail({
              from: 'Dattapadre', // sender address
              to: `${req.query.email}`, // list of receivers
              subject: `Visit new user on site`, // Subject line
              text: "Hello world?", // plain text body
              html: `your Work working`, // html body
            });
          
            console.log("Message sent: %s", info.messageId);
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
          }

            main().catch(console.error);

    if(req.session.admin_id==undefined){
        res.redirect("/admin")
    }else{
         res.redirect("/admin/orders")
    }

   
})

router.get("/updatedone/:id",async function(req,res){

        await exe(`UPDATE orders SET order_status ='completed' WHERE id='${req.params.id}'`);

            const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
              user: "dattapadre7249@gmail.com",
              pass: "ibip cill mvek iypo",
            },
          });


          var OTP=Math.floor(Math.random() * 9000) + 1000;
          req.session.otp = OTP;
          
          // async..await is not allowed in global scope, must use a wrapper
          async function main() {
            // send mail with defined transport object
            const info = await transporter.sendMail({
              from: 'Dattapadre', // sender address
              to: `${req.query.email}`, // list of receivers
              subject: `Visit new user on site`, // Subject line
              text: "Hello world?", // plain text body
              html: `your Work Done`, // html body
            });
          
            console.log("Message sent: %s", info.messageId);
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
          }

            main().catch(console.error);

    if(req.session.admin_id==undefined){
        res.redirect("/admin")
    }else{
        res.redirect("/admin/orders")
    }

    
})

router.get("/aboutInfo",async function(req,res){
    var data = await exe(`SELECT  * FROM contactinfo WHERE status = 'active'`);
    var admin = await exe(`SELECT * FROM admin`);
    if(req.session.admin_id==undefined){
        res.redirect("/admin")
    }else{
        res.render("admin/AboutInfo.ejs",{data:data[0],admin:admin[0]});
    }
    
})




router.post("/save_aboutInfo",async function(req,res){
    var d = req.body;

    if (req.files && req.files.logo) {
        var logo = new Date().getTime() + ".jpg";
        req.files.logo.mv("public/upload/" + logo);
        await exe(`UPDATE contactinfo SET logo='${logo}' WHERE contactinfo_id='1'`);
    }

    var  sql = `UPDATE contactinfo SET email = ?, Mobile = ?, Whatsapp = ?, Facebook = ?, Instagram = ?, Twitter = ?, Linkedin = ?, Address = ? WHERE contactinfo_id='1'`;
    var data =await exe(sql,[d.Email,d.mobile,d.Whatsapp,d.facebook,d.instagram,d.twitter,d.linkedin,d.address]);
    res.redirect("/admin/aboutInfo");
 })

 router.get("/about",async function(req,res){
    var about = await exe(`SELECT * FROM about_info`)
    var admin = await exe(`SELECT * FROM admin`);
    if(req.session.admin_id==undefined){
        res.redirect("/admin")
    }else{
        res.render("admin/About.ejs",{about:about[0],admin:admin[0]});
    }
    
 })

 router.post("/save_about",async function(req,res){
    var d = req.body;
        if (req.files && req.files.image) {
        var image = new Date().getTime() + ".jpg";
        req.files.image.mv("public/upload/" + image);
        await exe(`UPDATE about_info SET image='${image}' WHERE about_id='1'`);
    }
      var  sql = `UPDATE about_info SET title = ?, sub_title = ?, details = ? WHERE about_id = 1`;
      var data = await exe(sql,[d.title,d.subtitle,d.details])
      res.redirect("/admin/about")
})


 router.get("/add_project", async function(req,res){
  var admin = await exe(`SELECT * FROM admin`);
  if(req.session.admin_id==undefined){
        res.redirect("/admin")
    }else{
       res.render("admin/add_project.ejs",{admin:admin[0]});
    }
    
 })

 router.post("/save_painting",async function(req,res){
    var d = req.body;

        if (req.files && req.files.image1) {
        var image1 = new Date().getTime() + ".jpg";
        req.files.image1.mv("public/upload/" + image1);
        }

        if (req.files && req.files.image2) {
        var image2 = new Date().getTime() + ".jpg";
        req.files.image2.mv("public/upload/" + image2);
        }

    var sql = `INSERT INTO paintings (painting_type, size, without_frame_price, with_frame_price, image1, image2) VALUES (?, ?, ?, ?, ?, ?)`
    var data = await exe(sql,[d.painting_type,d.size,d.without_frame_price,d.with_frame_price,image1,image2])
    res.redirect("/admin/add_project")
 })
 
router.get("/all_project", async function (req, res) {
  let page = parseInt(req.query.page) || 1;
  let limit = 10;
  let offset = (page - 1) * limit;

  let countResult = await exe("SELECT COUNT(*) as total FROM paintings");
  let totalRecords = countResult[0].total;
  let totalPages = Math.ceil(totalRecords / limit);

  let data = await exe(`SELECT * FROM paintings ORDER BY painting_id DESC LIMIT ${limit} OFFSET ${offset}`);
  var admin = await exe(`SELECT * FROM admin`);

  if(req.session.admin_id==undefined){
        res.redirect("/admin")
    }else{
       res.render("admin/all_project.ejs", {data,currentPage: page,totalPages,admin:admin[0]});
    }

  
});

router.get("/projects_delete/:id",async function(req,res){
  var data = await exe(`UPDATE paintings SET status='deleted' WHERE painting_id='${req.params.id}'`);
  res.send("/admin/all_project")
})



 router.get("/contact",async function(req,res){
    var data = await exe(`SELECT * FROM users ORDER BY user_id DESC`)
    var admin = await exe(`SELECT * FROM admin`);
    if(req.session.admin_id==undefined){
        res.redirect("/admin")
    }else{
       res.render("admin/contact.ejs",{data,admin:admin[0]})
    }
    
 })


module.exports=router;