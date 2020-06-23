const express = require("express");

const checkAuth = require("../middleware/check-auth");
const router = express.Router();

const env = require('../env');

const Nexmo = require('nexmo');
const {
    response
} = require("express");
const nexmo = new Nexmo({
    apiKey: process.env.apiKey,
    apiSecret: process.env.apiSecret,
});


router.post("/sendSms", checkAuth, (req, res) => {

    let sms = req.body;
    let phoneNum = req.body.phone;
    let name = req.body.name;
    console.log(req.body.phone);
    const from = 'ShiftBoi';
    const to = phoneNum;
    const text = name + ',you are forget send request shifts';
    nexmo.message.sendSms(from, to, text, {
            type: 'unicode'
        },
        (err, responseData) => {
            if (err) {
                console.log(err);
            } else {
                console.dir(responseData);
            }
        });
});

module.exports = router;