const express = require('express');
const router = express.Router();

// @route   GET /health
router.get("/", async (req, res) => {
    try {
        res.status(200).send('OK');
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
});
  
module.exports = router;