const express = require('express');
const router = express.Router();
const reportController =require('../controllers/ReportController')
const authMiddleware=require('../middlewares/authMiddleware')


router.get('/monthly-report/:month/:year',authMiddleware, async (req, res) => {
    const { month, year } = req.params;
    const userId = req.user.id; 

    try {
        const report = await reportController.generateMonthlyReport(month, year, userId);
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/yearly-report/:year', authMiddleware,async (req, res) => {
    const { year } = req.params;
    const userId = req.user.id; 

    try {
        const report = await reportController.generateYearlyReport(year, userId);
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/monthly-report/csv/:month/:year', authMiddleware,async (req, res) => {
    const { month, year } = req.params;
    const userId = req.user.id; 

    try {
        const result = await reportController.generateMonthlyReportCsv(month, year, userId);
        res.download(result.filePath);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/yearly-report/csv/:year',authMiddleware, async (req, res) => {
    const { year } = req.params;
    const userId = req.user.id;

    try {
        const result = await reportController.generateYearlyReportCsv(year, userId);
        res.download(result.filePath);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

