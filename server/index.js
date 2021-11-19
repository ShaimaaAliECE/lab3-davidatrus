const express = require('express')
const app = express()
const mysql= require('mysql')
const cors = require('cors')

app.use(cors())
app.use(express.json());

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'appointmentSystem',
});
//post req to create an appointment req name, email and the date of appoint
app.post('/create', (req, res) =>{
        const name = req.body.name;
        const email = req.body.email;
        const appointmentDate = req.body.appointmentDate;

        db.query('INSERT INTO appointments (name, email, appointmentDate) VALUES (?,?,?)',
        [name,email,appointmentDate], (err, result) =>{
             if(err){
                 console.log(err)
             } else{
                 res.send("Values inserted")
             }
        }
         );
});

app.get('/appointments', (req, res) =>{
    db.query("SELECT * FROM appointments",(err, result )=> {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    });
});

app.put('/update', (req, res) => { // put req allowing admin to update oppointment dates.
    const id = req.body.id;
    const appointmentDate= req.body.appointmentDate;
    db.query(
        "UPDATE appointments SET  appointmentDate = ? WHERE id = ?",
        [appointmentDate,id], 
        (err,result)=> {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
});

app.delete('/delete/:id', (req, res) => {
    const id=  req.params.id
    db.query("DELETE FROM appointments WHERE id = ?", id, (err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result);
        }
    });
});

app.listen(3001,()=>{
    console.log("Yessir server is running on port 3001");
});