const db = require("../config/db");

exports.createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;

    const requester_id = req.user.id;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "กรุณากรอกหัวข้อและรายละเอียดให้ครบถ้วน" });
    }

    const ticket_no = `REQ-${Date.now()}`;

    const sql =
      "INSERT INTO tickets (ticket_no, title, description, requester_id) VALUES (?, ?, ?, ?)";

    const values = [ticket_no, title, description, requester_id];

    await db.query(sql, values);

    res.status(201).json({
      message: "ส่งเรื่องแจ้งซ่อมสำเร็จ",
      ticket_no: ticket_no,
    });
  } catch (error) {
    console.error("ระบบแจ้งซ่อมขัดข้อง:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
};
