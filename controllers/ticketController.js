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

exports.getAllTicket = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    let sql = "";
    let values = [];

    if (userRole === "it_support" || userRole === "admin") {
      sql = "SELECT * FROM tickets ORDER BY created_at DESC";
      values = [];
    } else {
      sql =
        "SELECT * FROM tickets WHERE requester_id = ? ORDER BY created_at DESC";
      values = [userId];
    }

    const [tickets] = await db.query(sql, values);

    res.status(200).json({
      message: "ดึงข้อมูลสำเร็จ",
      total_tickets: tickets.length,
      tickets: tickets,
    });
  } catch (error) {
    console.error("ระบบดึงข้อมูลแจ้งซ่อมขัดข้อง:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticketId = req.params.id;

    const sql = "SELECT * FROM tickets WHERE id = ?";

    const [tickets] = await db.query(sql, [ticketId]);

    if (tickets.length === 0) {
      return res.status(404).json({ message: "ไม่พบใบแจ้งซ่อมที่ระบุ" });
    }

    res.status(200).json({
      message: "ดึงข้อมูลสำเร็จ",
      ticket: tickets[0],
    });
  } catch (error) {
    console.error("ระบบดึงข้อมูลรายบุคคลขัดข้อง:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
};
