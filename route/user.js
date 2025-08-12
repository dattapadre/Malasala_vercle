const express=require("express");
const router=express.Router();
const exe = require("../conn");
const nodemailer = require("nodemailer")

router.get("/", async function (req, res) {
  var contactinfo = await exe(`SELECT * FROM contactinfo`);
  var hero_title_rows = await exe(`SELECT * FROM hero_title WHERE status = 'active'`);
  var hero_section = await exe(`SELECT * FROM hero_section WHERE id = 1`);
  var hero_titles = hero_title_rows.map(row => row.title);
    res.render("user/index.ejs",{contactinfo:contactinfo[0],hero_section:hero_section[0],hero_titles});

});

router.get("/about",async function(req,res){
    var about = await exe(`SELECT * FROM about_info`)
    var project = await exe(`SELECT COUNT(*) AS total_projects FROM paintings WHERE status = 'active'`);
    var project_total = await exe(`SELECT COUNT(*) AS total FROM paintings`);
    var contactinfo = await exe(`SELECT * FROM contactinfo`)
    console.log(project)
    res.render("user/About.ejs",{contactinfo:contactinfo[0],about:about[0],project:project[0],project_total:project_total[0]});
})

router.get("/work",async function(req,res){
    var contactinfo = await exe(`SELECT * FROM contactinfo`)
    var paintings = await exe(`SELECT * FROM paintings WHERE status ='active'`)
    res.render("user/work.ejs",{contactinfo:contactinfo[0],paintings});
})

router.get("/contact",async function(req,res){
    var contactinfo = await exe(`SELECT * FROM contactinfo`)
    res.render("user/contact.ejs",{contactinfo:contactinfo[0]});
})
router.get("/login",async function(req,res){
    var contactinfo = await exe(`SELECT * FROM contactinfo`)
    res.render("user/login.ejs",{contactinfo:contactinfo[0]});
})

router.post("/user_contact",async function(req,res){
    var d= req.body;
    var  sql = `INSERT INTO users (user_name, user_email, user_mobile, user_subject, user_message) VALUES (?, ?, ?, ?, ?)`;
    var data = await exe(sql,[d.user_name, d.user_email, d.user_mobile, d.user_subject, d.user_message])
    res.redirect("/contact")
})

router.post("/orders", async function (req, res) {
  const d = req.body;
  let imageFilename = null;

  if (req.files && req.files.image) {
    imageFilename = `${Date.now()}.jpg`;
    await req.files.image.mv(`public/upload/${imageFilename}`);
  }

  const sql =`INSERT INTO orders(userName, mobile, email, type, address, image) VALUES (?, ?, ?, ?, ?, ?)`;
  await exe(sql, [d.userName,d.mobile,d.email,d.type,d.address,imageFilename,]);

  // configure transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "dattapadre7249@gmail.com",
      pass: "ibip cill mvek iypo",
    },
  });

  // send mail
  async function main() {
    const mailOptions = {
      from: '"Datta Padre" <dattapadre7249@gmail.com>',
      to: "dattapadre357@gmail.com",
      subject: "🖌️ New Custom Sketch Order",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #f8f9fa; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">🖌️ New Custom Sketch Order</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px;"><strong>Name:</strong></td>
              <td style="padding: 8px;">${d.userName}</td>
            </tr>
            <tr>
              <td style="padding: 8px;"><strong>Mobile:</strong></td>
              <td style="padding: 8px;">${d.mobile}</td>
            </tr>
            <tr>
              <td style="padding: 8px;"><strong>Email:</strong></td>
              <td style="padding: 8px;">${d.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px;"><strong>Sketch Type:</strong></td>
              <td style="padding: 8px;">${d.type}</td>
            </tr>
            <tr>
              <td style="padding: 8px;"><strong>Address:</strong></td>
              <td style="padding: 8px;">${d.address}</td>
            </tr>
          </table>
          ${imageFilename ? `
          <div style="margin-top: 20px;">
            <strong>Uploaded Image:</strong><br>
            <img src="cid:orderImageCID" style="max-width: 100%; border-radius: 8px; margin-top: 10px;"/>
          </div>` : ''}
          <p style="margin-top: 30px; font-size: 14px; color: #555;">Thank you! This is an automated message.</p>
        </div>
      `,
      attachments: imageFilename
        ? [
            {
              filename: imageFilename,
              path: `public/upload/${imageFilename}`,
              cid: "orderImageCID", // same as in the img src
            },
          ]
        : [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  }

  main().catch(console.error);


  res.redirect("/work");
});


module.exports=router;