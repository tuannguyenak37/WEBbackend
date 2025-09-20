import khoCheck from "../service/utils/KhoCheck.js";
import Kho_Service from "../service/kho_Service.js";
const addKho_Controller = async (req, res) => {
  const role = req.user.role;

  const { ten_kho, dia_chi, nha_cung_cap } = req.body;

  console.log(">>>>> Role:", role);
  console.log(">>>>> Role:", req.body);
  if (!role) {
    return res.status(400).json({
      status: "fail",
      message: "Không tìm thấy quyền người dùng",
    });
  }

  try {
    await Kho_Service.addKho_service(ten_kho, dia_chi, nha_cung_cap);
    return res.status(200).json({
      status: "success",
      message: "Thêm kho thành công",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: `Lỗi database: ${error.message}`,
    });
  }
};

const suaKho = async (req, res) => {
  const { kho_id } = req.params;
  const { so_luong_ton, nha_cung_cap } = req.body;

  try {
    const is_Kho = await khoCheck.check_kho(kho_id); // cần await

    if (!is_Kho) {
      return res.status(400).json({
        status: "fail",
        message: "Kho không tồn tại",
      });
    }

    await Kho_Service.SuaKho_service(kho_id, so_luong_ton, nha_cung_cap);

    return res.status(200).json({
      status: "success",
      message: "Sửa kho thành công",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: `Lỗi database: ${error.message}`,
    });
  }
};

const xem_kho = async (req, res) => {
  const user_id = req.user.user_id;
};

const Kho_Controllers = { addKho_Controller, suaKho };

export default Kho_Controllers;
