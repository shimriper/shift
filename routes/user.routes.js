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
            .then((response) => {
                res.status(201).json({
                    success: true,
                    message: "User successfully created!",
                    result: response
                });
            })
            .catch((err) => {
                res.status(500).json({
                    success: false,
                    message: "User not created!",
                    result: err
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
                    success: false,
                    message: "Auth failed"
                });
            }
            if (user.isDisabeld) {
                return res.status(401).json({
                    success: false,
                    message: "user is disabeled"
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then((result) => {
            if (!result) {
                return res.status(401).json({
                    success: false,
                    message: "Auth failed",
                    result: result
                });
            }
            const token = jwt.sign({
                    email: fetchedUser.email,
                    userId: fetchedUser._id
                },
                process.env.JWT, {
                    expiresIn: "1h"
                }
            );
            res.status(200).json({
                success: true,
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id,
                role: fetchedUser.role,
            });
        })
        .catch((err) => {
            return res.status(401).json({
                success: false,
                message: "Auth failed",
                result: err
            });
        });
});



// getAllByStartDate
router.get("/getAllUsers", (req, res) => {
    User.find({})
        .sort({
            priority: 1
        }).exec(function (err, users) {
            if (err) {
                console.log(err);
            } else {
                console.log(users);
                res.json(users);
            }
        });
});


// Get single user
router.get('/read/:id', checkAuth, (req, res) => {
    User.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

// Update User
router.put('/update/:id', checkAuth, (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
            console.log(error)
        } else {
            res.json(data)
            console.log('Data updated successfully')
        }
    })
})

// getAllByStartDate
router.get("/getUserById", checkAuth, (req, res) => {
    User.find({
            _id: req.userData.userId
        })
        .exec(function (err, user) {
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
            } else {
                res.json(data);
            }
        }
    );
});
module.exports = router;