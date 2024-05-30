const User = require('../models/users');
const Student = require('../models/students');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
// const sendSMS = require('../sendOTP');
const axios = require('axios');

const test = (req, res) => {
    res.json('test is working');
}

const hashPassword = async (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(12, (err, salt) => {
            if(err){
                return reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if(err){
                    return reject(err);
                }
                return resolve(hash);
            })
        })
    })
}

const registerUser = async (req, res) => {
    try {
        const {name, email, password, phone} = req.body;

        //Check if password meets the requirements
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[^a-zA-Z\d]/.test(password);
        const isLongEnough = password.length >= 6;

        if (!hasUpper) {
            return res.json({ error: 'Password must contain at least one uppercase letter' });
        }
        if (!hasLower) {
            return res.json({ error: 'Password must contain at least one lowercase letter' });
        }
        if (!hasNumber) {
            return res.json({ error: 'Password must contain at least one number' });
        }
        if (!hasSpecial) {
            return res.json({ error: 'Password must contain at least one special character' });
        }
        if (!isLongEnough) {
            return res.json({ error: 'Password must be at least 6 characters long' });
        }
        const regex = /\b\d{10}\b/;
        if(!regex.test(phone)) {
            return res.json({ error: 'Please enter valid phone number'});
        }


        //Check if email entered
        const exist = await User.findOne({email});
        if(exist){
            return res.json({
                error: 'Email already exist'
            })
        };
        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone
        })
            

        const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL,
            pass: process.env.MAIL_PASS,
        }
        });

        const mailOptions = {
        from:{
            name: 'UDAAN VR-LLM',
            address: process.env.MAIL
        },
        to: email,
        subject: 'Verification of Email for VR-LLM',
        text: `Please click the link below to verify your email address:\nhttp://localhost:5173/verify/${user._id}`
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        });

        return res.json(User)
    } catch (error) {
        console.log(error);}
}

const verified = async (req, res) => {
    const id  = req.params.id;
    const user  = await User.findByIdAndUpdate({_id:id}, {verified: true})
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
}

// const sendOTP = async (req, res) => {
//     const {email, phone, otp} = req.body;
//     const user = await User.findOne({email});

//     console.log('request sent')
//     try{
//         if(!user){
//             return res.json({
//                 error: 'User does not exist'
//             })
//         }
//         if(phone != user.phone){
//             return res.json({
//                 error: 'Incorrect phone number'
//             })
//         }
//         user.otp = otp;
//         await user.save();
//         sendSMS(user.phone, "Your verification code is:\n"+otp);
//         console.log("OTP sent")
//         return res.json(User)
//     }
//     catch (error) {
//         console.log(error)}
// }

// const verifyOTP = async (req, res) => {
//     const {email, phone,otp} = req.body;
//     const user = await User.findOne({email});
//     try{
//         if(!user){
//             return res.json({
//                 error: 'User does not exist'
//             })
//         }
//         if(otp == user.otp){
//             await User.updateOne({ email: email }, { $unset: { otp: 1 } })
//             console.log("Verified")
//             return res.json({
//                 success: 'Verified'
//             })
//         }
//         else{
//             return res.json({
//                 error: 'Incorrect OTP'
//             })
//         }
//     }
//     catch (error) {
//         console.log(error)}
// }

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body; 
        const user = await User.findOne({email});

        if(!user){
            return res.json({
                error: 'User does not exist'
            })
        }

        const isVerified = user.verified;
        if(!isVerified){
            return res.json({
                error: 'Please verify your email'
            })
        }

        const comparedPassword = await bcrypt.compare(password, user.password);
        if(!comparedPassword){
            return res.json({
                error: 'Incorrect password'
            })
        }
        else{
            return res.json(User)
        }
    }
    catch (error) {
        console.log(error)}
}

const createStudent = async (req, res) => {
    console.log(req.body)
    const {name, email, rollno} = req.body;
    const exist = await Student.findOne({rollno});
    if(exist){
        return res.json({
            error: 'Roll No already exist'
        })
    };
    const student = await Student.create({
        name,
        email,
        rollno
    })
    .then(students => res.json(students))
    .catch(err => console.log(err));
}

const getStudents = async (req, res) => {
    const students  = await Student.find({})
    .then(students => res.json(students))
    .catch(err => res.status(400).json('Error: ' + err));
}

const findStudent = async (req, res) => {
    const id  = req.params.id;
    const student  = await Student.findOne({rollno:id})
    .then(student => res.json(student))
    .catch(err => res.status(400).json('Error: ' + err));
}

const updateStudent = async (req, res) => {
    const id  = req.params.id;
    const student  = await Student.findOneAndUpdate({rollno:id}, req.body)
    .then(student => res.json(student))
    .catch(err => res.status(400).json('Error: ' + err));
}

const deleteStudent = async (req, res) => {
    const id  = req.params.id;
    const student  = await Student.findOneAndDelete({rollno:id})
    .then(student => res.json(student))
    .catch(err => res.status(400).json('Error: ' + err));
}

const deleteAll = async (req, res) => {
    const student  = await Student.deleteMany({})
    .then(student => res.json(student))
    .catch(err => res.status(400).json('Error: ' + err));
}



module.exports = {
    test,
    registerUser,
    loginUser,
    createStudent,
    getStudents,
    findStudent,
    updateStudent,
    deleteStudent,
    deleteAll,
    verified,
    // sendOTP,
    // verifyOTP,
}
