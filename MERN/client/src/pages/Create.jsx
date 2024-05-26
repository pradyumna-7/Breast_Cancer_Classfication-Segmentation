import React from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'


export default function Create() {

  const navigate = useNavigate()
  
  const [data, setData] = useState({
    name:'',
    email:'',
    rollno:''
  })

  const createStudent = async (e) => {
    e.preventDefault()
    const {name, email, rollno} = data
    try {
      const {data} = await axios.post('/create', {
        name, email, rollno
      })
      if(data.error){
        toast.error(data.error)
      }
      else{
        toast.success('Student created successfully!')
        navigate('/home')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div style={{ position: 'fixed', left: '0', right: '0', bottom: '0', display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'blue', zIndex:'1'}}>
    <div className='w-50 bg-white rounded p-3'>
      <form action="" onSubmit={createStudent}>
        <h2 style={{textAlign: 'left', fontWeight: 'bold', fontSize: '25px'}}>Add Student</h2>
        <div className="mb-2" style={{textAlign: 'left'}}>
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" placeholder='Enter Name'  
          onChange={(e)=> setData({...data, name:e.target.value})} required/>
        </div>
        <div className="mb-2" style={{textAlign: 'left'}}>
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" placeholder='Enter Email' 
          onChange={(e)=> setData({...data, email:e.target.value})} required/>
        </div>
        <div className="mb-2" style={{textAlign: 'left'}}>
          <label htmlFor="rollno" className="form-label">Roll No</label>
          <input type="text" className="form-control" id="rollno" placeholder='Enter Roll No'
          onChange={(e)=> setData({...data, rollno:e.target.value})} required/>
        </div >
        <button type="submit" className="btn btn-success">Submit</button>
        {/* <button type="submit" className="btn btn-danger">Cancel</button> */}
      </form>
    </div>
      </div> 

  )
}
