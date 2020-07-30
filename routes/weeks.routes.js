const express = require("express");

const Week = require("../models/week");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.post("", checkAuth, (req, res, next) => {
    var day = new Date();
    const week = new Week({
        creator: req.userData.userId,
        start: req.body.start,
        end: req.body.end,
        shifts: req.body.shifts,
        remarks: req.body.remarks,
        lastModified: day
    });
    week.save().then((createdWeek) => {
        res.status(201).json({
            message: "week added successfully",
            weekId: createdWeek._id,
        });
    });
});

router.delete("/deleteWeek", checkAuth, (req, res) => {
    Week.deleteOne({
        creator: req.userData.userId
    }).then((result) => {
        if (result) {
            // console.log("Week delete successful!");
            res.status(200).json({
                message: "Week delete successful!"
            });
        } else {
            res.status(200).json({
                message: "Not  Authorized!"
            });
        }
    });
});

// getAllByStartDate
router.get("/getAllByStartDate/:start/:end", (req, res) => {
    var d = new Date(req.params.start);
    console.log(d);
    Week.find({
            start: d
        })
        .populate({
            path: "creator"
        })
        .populate({
            path: "shifts"
        })
        .exec(function (err, weeks) {
            if (err) {
                console.log(weeks);
                // res.json(weeks);
                // return next(err)
            } else {
                // console.log(weeks);
                res.json(weeks);
            }
        });
});


// router.get("/getLastSidur/:start/:end", checkAuth, (req, res) => {
//     var d = new Date(req.params.start);
//     // console.log(d);
//     Sidur.findOne({
//         start: d
//     }).exec(function (err, sidur) {
//         if (err) {
//             res.json({
//                 message: "err" + err
//             })
//         } else {
//             res.json(sidur);
//         }
//     });
// });

// getAllByStartDate
// router.get("/getLastInsert", (req, res) => {
//     Week.find({})
//         .sort({
//             "_id": -1
//         }).limit(1)

//         .populate({
//             path: "creator"
//         })
//         .populate({
//             path: "shifts"
//         })
//         .exec(function (err, weeks) {
//             if (err) {
//                 return next(err)
//             } else {
//                 // console.log(weeks);
//                 res.json(weeks);
//             }
//         });
// });


router.put("/:id", checkAuth, (req, res, next) => {
    var day = new Date();
    const week = new Week({
        _id: req.body.id,
        creator: req.userData.userId,
        start: req.body.start,
        end: req.body.end,
        shifts: req.body.shifts,
        remarks: req.body.remarks,
        lastModified: day
    });
    Week.updateOne({
            _id: req.params.id,
            creator: req.userData.userId
        },
        week
    ).then((result) => {
        if (result.n > 0) {
            res.status(200).json({
                message: "Update successful!"
            });
        } else {
            res.status(200).json({
                message: "Not  Authorized!"
            });
        }
    });
});

router.get("", (req, res, next) => {
    Week.find().then((documents) => {
        res.status(200).json({
            message: "weeks fetched successfully!",
            weeks: documents,
        });
    });
});

router.get("/getWeekByCreator", checkAuth, (req, res) => {
    Week.findOne({
            creator: req.userData.userId
        })
        .populate({
            path: "shifts"
        })
        .then((week) => {
            if (week) {
                res.json({
                    message: "success",
                    data: week
                });
            } else {
                res.json({
                    message: "week not found!",
                    data: ''
                });
            }
        });
});

router.get("/:id", (req, res, next) => {
    Week.findById(req.params.id).then((week) => {
        if (week) {
            res.status(200).json(week);
        } else {
            res.status(404).json({
                message: "week not found!"
            });
        }
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
    Week.deleteOne({
        _id: req.params.id,
        creator: req.userData.userId
    }).then(
        (result) => {
            if (result.n > 0) {
                res.status(200).json({
                    message: "week delete successful!"
                });
            } else {
                res.status(200).json({
                    message: "Not  Authorized!"
                });
            }
        }
    );
});

// Update week
router.put("/update/:id", checkAuth, (req, res, next) => {
    Week.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data)
            console.log('Data updated successfully')
        }
    })
})

module.exports = router;