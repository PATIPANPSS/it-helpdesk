const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { employee_id, name, password } = req.body;

    if (!employee_id || !name || !password) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql =
      "INSERT INTO users (employee_id, name, password) VALUES (?, ?, ?)";

    const values = [employee_id, name, hashedPassword];

    await db.query(sql, values);

    res.status(201).json({ message: "ลงทะเบียนสำเร็จ!" });
  } catch (error) {
    console.error("ระบบลงทะเบียนขัดข้อง:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
};

exports.login = async (req, res) => {
  try {
    const { employee_id, password } = req.body;

    if (!employee_id || !password) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const sql = 'SELECT * FROM users WHERE employee_id = ?';
    const [users] = await db.query(sql, [employee_id]);

    if(users.length === 0){
        return res.status(400).json({ message: 'ไม่พบรหัสพนักงานในระบบ'});
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง'});
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
        {id: user.id, employee_id: user.employee_id, role: user.role},
        'SECRET_KEY_COMPANY',
        {expiresIn: '8h'}
    );

    res.status(200).json({
        message: 'เข้าสู่ระบบสำเร็จ',
        token: token,
        role: user.role
    });
  } catch (error) {
    console.error("ระบบล็อกอินขัดข้อง:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
};
