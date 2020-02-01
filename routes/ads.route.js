const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const { Thread } = require("../models/thread.model.js");
const { Message } = require("../models/message.model.js");

const JsonService = require('../services/db');

const getRandomFloat = (min, max) => Math.random() * (max - min) + min;
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const getRandomBool = () => Math.random() >= 0.5;

// get ads
router.get("/:period", auth, async (req, res, next) => {
    const { period } = req.params;

    try {
        let data = []
        for (let i = 1 ; i < 10 ; i++) {
            let campaign = {
                "_id": '_' + Math.random().toString(36).substr(2, 9),
                "name": `Campaign ${i}`,
                "time": "7 days",
                "ctr": "25%",
                "cpc": getRandomFloat(1, 100),
                "cpv": getRandomFloat(1, 100),
                "cpm": getRandomFloat(1, 100),
                "status": getRandomBool() ? "disable" : "active",
                "daily_stats": [],
                "views": 0,
                "visitors": 0,
                "impressions": 0,
            }

            const limit = period === "month" ? 28 : period === "week" ? 7 : 1
            for (let i = 1 ; i <= limit ; i++) {
                const views = getRandomInt(5000, 10000)
                const visitors = getRandomInt(1000, 5000)
                const impressions = getRandomInt(10000, 20000)
                campaign["daily_stats"].push({
                    "weekday": i,
                    "views": views,
                    "visitors": visitors,
                    "impressions": impressions,
                })

                campaign["views"] += views
                campaign["visitors"] += visitors
                campaign["impressions"] += impressions
            }
            data.push(campaign)
        }
        res.jsonp(data);
    } catch(err) {
        next(err);
    }
});

module.exports = router;
