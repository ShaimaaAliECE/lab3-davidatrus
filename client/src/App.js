import { useState } from 'react';
import './App.css';
import Axios from 'axios'





function App() {

  const[name, setName] = useState("");
  const[email, setEmail]= useState("");
  const[appointmentDate,setAppointment]= useState("");

  const [appointmentList, setAppointmentList] = useState([]);

  const [newAppointment, setNewAppointment] = useState("");

const addAvailability= () => { //function to add availibitly 
  Axios.post ('http://localhost:3001/create', {
    name: name, 
    email: email, 
    appointmentDate: appointmentDate
 }).then(()=> {
   console.log("success");
 });
};

const getAppointments = () =>{ //when you click on show appointments button it will list out all appointments for admin and guest to see.
  Axios.get("http://localhost:3001/appointments").then((response) =>{
    setAppointmentList(response.data);
  });
};

const updateAppointments = (id) => { //function to update already set up appointments
  Axios.put("http://localhost:3001/update",
  {appointmentDate: newAppointment, 
    id: id}).then((response) => {
      setAppointmentList(appointmentList.map((val)=>{
        return val.id== id ? {id: val.id, name: val.name, email: val.email, appointmentDate: newAppointment} : val
      }))
    });
};

const deleteAppointment = (id) =>{ //function to delete appointments once the delete button is clicked
  Axios.delete(`http://localhost:3001/delete/${id}`).then((response)=>{
    setAppointmentList(appointmentList.filter((val)=> {
      return val.id != id;
      })
    );
  });
};

  return (
    <div className="App">
    <div className="information">
      <label>Name:</label>
      <input 
       type='text' 
      onChange={(event) => {
        setName(event.target.value);
      }}   
      />
      <label>Email:</label>
      <input type='text'
      onChange={(event) => {
        setEmail(event.target.value);
      }}   />
      <label>Appointment Date:</label>
      <input type='date'
        onChange={(event) => {
        setAppointment(event.target.value);
        //creating labels and input types for Name, email and appointment date. Then creating a button that on click calls the add availabilty function
      }}   
      />
      <button onClick= {addAvailability} >Add availability</button>
      </div>

      <div className="appointments">
        <button onClick ={getAppointments}>Show Appointments</button>

        {appointmentList.map((val, key) =>{
          return (
          <div className="appointment"> 
          <div>
          <h3>Name: {val.name}</h3> 
          <h3>Email: {val.email}</h3>
          <h3>Appointment date:{val.appointmentDate}</h3> 
          </div>
            <div> 
          <input type ="date"
             onChange={(event) => {
        setNewAppointment(event.target.value);
      }}  
          />
          <button onClick={() => {updateAppointments(val.id)} }> Update</button>

          <button onClick = {()=> {deleteAppointment(val.id)}}>Delete</button>
          
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
}

export default App;
