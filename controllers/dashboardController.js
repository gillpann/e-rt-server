const dashboardService = require("../services/dashboardService");

const getDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboardData();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };