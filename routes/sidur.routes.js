const express = require("express");

const Sidur = require("../models/sidur");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.post("", checkAuth, (req, res) => {
    const sidur = new Sidur({
        creator: req.userData.userId,
        start: req.body.start,
        end: req.body.end,
        qubes: req.body.qubes,
    });
    sidur.save().then((createdSidur) => {
        res.status(201).json({
            message: "Sidur added successfully",
            data: createdSidur,
        });
    });
});

router.get("/getSidurByDate/:start/:end", checkAuth, (req, res) => {
    Sidur.find({
        start: {
            $gte: new Date(req.params.start),
            $lte: new Date(req.params.end),
        },
    }).exec(function (err, sidur) {
        if (err) {
            // console.log(err);
        } else {
            res.json(sidur);
        }
    });
});

router.get("/allSidurs", checkAuth, (req, res) => {
    Sidur.find({}).exec(function (err, sidur) {
        if (err) {
            // console.log(err);
        } else {
            res.json(sidur);
        }
    });
});




router.get("/getLastSidur/:start/:end", checkAuth, (req, res) => {
    var d = new Date(req.params.start);
    // console.log(d);
    Sidur.findOne({
        start: d
    }).exec(function (err, sidur) {
        if (err) {
            res.json({
                message: "err" + err
            })
        } else {
            res.json(sidur);
        }
    });
});

module.exports = router;