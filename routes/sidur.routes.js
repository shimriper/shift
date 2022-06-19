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
    Sidur.find({})
        .limit(5)
        .sort({
            start: -1
        })
        .exec(function (err, sidur) {
            if (err) {
                // console.log(err);
            } else {
                res.json(sidur);
            }
        });
});



// Get single sidur
router.get('/getSidurById/:id', checkAuth, (req, res, next) => {
    Sidur.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

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

// getAllByStartDate
router.get("/getAllByStartDate", checkAuth, (req, res) => {
    Sidur.find({})
        .populate({
            path: "creator"
        })
        .populate({
            path: "shifts"
        })
        .exec(function (err, weeks) {
            if (err) {
                return next(err)
            } else {
                // console.log(weeks);
                res.json(weeks);
            }
        });
});

// getAllByStartDate
router.get("/getLastInsert", checkAuth, (req, res) => {
    Sidur.find({})
        .sort({
            "_id": -1
        }).limit(1)
        .populate({
            path: "creator"
        })
        .populate({
            path: "shifts"
        })
        .exec(function (err, weeks) {
            if (err) {
                return next(err)
            } else {
                // console.log(weeks);
                res.json(weeks);
            }
        });
});

// Update User
router.put('/update/:id', checkAuth, (req, res, next) => {
    Sidur.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data)
        }
    })
})

module.exports = router;
