const express = require('express')
const app = express()
const mysql= require('mysql')
const cors = require('cors')
const path = require('path');

app.use(cors())
app.use(express.json());
app.use(express.static(path.join(__dirname, './build')));



function createDbConnection(){
    return mysql.createConnection({
        user: 'root',
        host: 'localhost',
        password: '',
        database: 'appointmentSystem',
    });
}

//post req to create an appointment req name, email and the date of appoint
app.post('/create', (req, res) =>{
        const name = req.body.name;
        const email = req.body.email;
        const appointmentDate = req.body.appointmentDate;
        const db = createDbConnection();

        db.connect();

        db.query('INSERT INTO appointments (name, email, appointmentDate) VALUES (?,?,?)',
        [name,email,appointmentDate], (err, result) =>{
             if(err){
                 console.log('HEEEEEEEEERRRRRRRRREEEEEEEE')
                 console.log(err)
             } else{
                 res.send("Values inserted")
             }
             db.end();
            }
        );   
});

app.get('/appointments', (req, res) =>{

    const db = createDbConnection();

    db.connect();
    db.query("SELECT * FROM appointments",(err, result )=> {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    });
    db.end();
});

app.put('/update', (req, res) => { // put req allowing admin to update oppointment dates.
    const id = req.body.id;
    const appointmentDate= req.body.appointmentDate;
    const db = createDbConnection();

    db.connect();
    
    db.query(
        "UPDATE appointments SET  appointmentDate = ? WHERE id = ?",
        [appointmentDate,id], 
        (err,result)=> {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
        db.end();
    }
    );
});

app.delete('/delete/:id', (req, res) => {
    const id=  req.params.id
    const db = createDbConnection();

    db.connect();
    db.query("DELETE FROM appointments WHERE id = ?", id, (err,result) => { //ability to delete reqs
        if(err){
            console.log(err)
        }else{
            res.send(result);
        }
        db.end();
    });
});

app.listen(80,()=>{
    console.log("Yessir server is running on port 3001");
    const db = createDbConnection();

    db.connect((err)=> {
        if(!err)
        {
            console.log("Connected");
        }
        else
        {
            console.log(err);
        }
    });

  db.query("DROP TABLE IF EXISTS appointments", function (err, result) {
    if (err) throw err;
    console.log(result);
  });

    db.query(`CREATE TABLE appointments (
        id int,
        name varchar(255),
        email varchar(255),
        appointmentDate DATE
    );
    `
    ,(err, result) =>{
        if(err){
            console.log(err);
        }else{
            console.log("success");
        }
        db.end()
    });  

});
