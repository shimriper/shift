const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hash,
            isDisabeld: false,
            role: "user",
        });
        user
            .save()
            .then((result) => {
                res.sendStatus(200).json({
                    message: "User created",
                    result: result,
                });
            })
            .catch((err) => {
                res.status(500).json({
                    error: err,
                });
            });
    });
});

router.post("/login", (req, res, next) => {
    let fetchedUser;
    User.findOne({
            email: req.body.email
        })
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    message: "Auth failed",
                });
            }
            if (user.isDisabeld) {
                return res.status(401).json({
                    message: "user is disabeled",
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then((result) => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed",
                });
            }
            const token = jwt.sign({
                    email: fetchedUser.email,
                    userId: fetchedUser._id
                },
                "secret_this_should_be_longer", {
                    expiresIn: "1h"
                }
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id,
                role: fetchedUser.role,
            });
        })
        .catch((err) => {
            return res.status(401).json({
                message: "Auth failed",
            });
        });
});

// getAllByStartDate
router.get("/getAllUsers", (req, res) => {
    User.find({}).exec(function (err, users) {
        if (err) {
            // res.send(err);
            console.log(err);
        } else {
            console.log(users);
            res.json(users);
        }
    });
});

// getAllByStartDate
router.get("/getUserById", checkAuth, (req, res) => {
    User.find({
        _id: req.userData.userId
    }).exec(function (err, user) {
        if (err) {
            // res.send(err);
            console.log(err);
        } else {
            console.log(user);
            res.json(user);
        }
    });
});

// Update user /update-user/' + id
router.put("/update-user/:id", checkAuth, (req, res, next) => {
    console.log(req.body);
    User.findByIdAndUpdate(
        req.params.id, {
            $set: req.body,
        },
        (error, data) => {
            if (error) {
                return next(error);
                console.log(error);
            } else {
                res.json(data);
                console.log("user disabled successfully!");
            }
        }
    );
});
module.exports = router;