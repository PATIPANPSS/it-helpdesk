const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'patipan110544',
    database: 'it_helpdesk'
});

db.getConnection((err, connection) => {
    if(err){
        console.error('เชื่อมต่อข้อมูลล้มเหลว:', err.message);
    }else{
        console.log('เชื่อมต่อฐานข้อมูล MySQL สำเร็จแล้ว!');
        connection.release();
    }
});

module.exports = db.promise();