import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast'

export default function Update() {
  const [student, setStudent] = useState({ name: '', email: '', rollno: '' });
  const { id } = useParams();
  // const history = useHistory();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/getstudent/${id}`)
      .then(response => {
        const { name, email, rollno } = response.data;
        setStudent({ name, email, rollno });
      })
      .catch(error => console.log(error));
  }, [id]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setStudent(prevStudent => ({
      ...prevStudent,
      [name]: value
    }));
  };

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      await axios.put(`/update/${id}`, student);
      toast.success('Student updated successfully!');
      navigate('/home');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ position: 'fixed', left: '0', right: '0', bottom: '0', display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'blue', zIndex:'1'}}>
      <div className='w-50 bg-white rounded p-3'>
        <form onSubmit={handleUpdate}>
          <h2 style={{textAlign: 'left', fontWeight: 'bold', fontSize: '25px'}}>Update Student</h2>
          <div className="mb-2" style={{textAlign: 'left'}}>
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" name="name" className="form-control" id="name" placeholder='Enter Name' value={student.name} onChange={handleInputChange}/>
          </div>
          <div className="mb-2" style={{textAlign: 'left'}}>
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" name="email" className="form-control" id="email" placeholder='Enter Email' value={student.email} onChange={handleInputChange}/>
          </div>
          <div className="mb-2" style={{textAlign: 'left'}}>
            <label htmlFor="rollno" className="form-label">Roll No</label>
            <input type="text" name="rollno" className="form-control" id="rollno" placeholder='Enter Roll No' value={student.rollno} onChange={handleInputChange}/>
          </div>
          <button type="submit" className="btn btn-success">Update</button>
          <Link to='/home'><button type="cancel" className="btn btn-danger">Cancel</button></Link>
        </form>
      </div>
    </div> 
  );
}
