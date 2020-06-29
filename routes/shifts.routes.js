const express = require("express");

const Shift = require("../models/shift");
const Week = require("../models/week");

const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.post("", checkAuth, (req, res) => {
    let shifts = req.body;
    for (key in shifts) {
        shifts[key].creator = req.userData.userId;
    }
    let ids = [];
    // Function call
    Shift.insertMany(shifts)
        .then((result) => {
            for (var key in result) {
                ids[key] = result[key]._id;
            }
            res.status(200).json(ids);
        })
        .catch(function (error) {});
});

// getAllByStartDate
router.get("/getAllByStartDate", (req, res) => {
    Shift.find({})
        .populate({
            path: "creator"
        })
        .exec(function (err, shifts) {
            if (err) {
                res.send(err);
            } else {
                res.json(shifts);
            }
        });
});

router.put("/:id", checkAuth, (req, res, next) => {
    const shift = new Shift({
        _id: req.body.id,
        qube: req.body.qube,
        day: req.body.day,
        typeShift: req.body.typeShift,
        isAvilable: req.body.isAvilable,
        creator: req.userData.userId,
        dateShift: req.body.dateShift,
    });
    Shift.updateOne({
            _id: req.params.id,
            creator: req.userData.userId
        },
        post
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
    Shift.find().then((documents) => {
        res.status(200).json({
            message: "Shifts fetched successfully!",
            shifts: documents,
        });
    });
});

router.get("/getMyShifts/:start/:end", checkAuth, (req, res) => {
    Shift.find({
        creator: req.userData.userId,
        dateShift: {
            $gte: new Date(req.params.start),
            $lte: new Date(req.params.end),
        },
    }).exec(function (err, shifts) {
        if (err) {
            res.json({
                message: "err" + err
            })
        } else {
            res.status(200).json(shifts);
        }
    });
});

router.delete("/deleteAllReq", checkAuth, (req, res, next) => {
    Shift.deleteMany({
        creator: req.userData.userId
    }).then((result) => {
        if (result.n > 0) {
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

module.exports = router;