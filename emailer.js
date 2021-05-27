const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const User =  require('./models/user');
class emailer{


    sendEmail(email, id){
        // create reusable transporter object using the default SMTP transport
        nodemailer.createTestAccount((err, account) => {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                auth: {
                    user: process.env.GMAIL_USER, 
                    pass: process.env.GMAIL_PASS, 
                },
            });
            jwt.sign(
                {
                    id
                },
                process.env.EMAIL_SECRET,
                {
                expiresIn: '1d',
                },
                async (err, token) => {
                    const url = `http://localhost:5000/confirmation/${token}`;
                    let info = await transporter.sendMail({
                        from: '"Clarity Blog" <claritybotconfirm@gmail.com>', // sender address
                        to: email, // list of receivers
                        subject: "Please confirm your account with Clarity", // Subject line
                        html: `Please click this link to confirm your email: <a href="${url}">link</a>`
                    });
                }
            )
                
            
        })
    
    
    }
}

module.exports = emailer