import search_service from "../../service/search/search_service.js";
const search_controller = async (req, res) => {
  try {
    const { keyword = "", limit = 20, page = 1 } = req.query;
    const results = await search_service.search_service(keyword, limit, page);
    return res.status(200).json({
      status: "success",
      data: results,
    });
  } catch (error) {
    console.error("❌ Lỗi khi:", error);
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

export default { search_controller };
