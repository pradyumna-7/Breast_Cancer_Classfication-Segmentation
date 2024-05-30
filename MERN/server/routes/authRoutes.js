const express = require('express')
const router = express.Router()
const cors = require('cors')
const { registerUser, loginUser, createStudent, getStudents, findStudent, updateStudent, deleteStudent, deleteAll, verified} = require('../controllers/authControllers')

//middleware
router.use(cors(
    {
        credentials: true,
        origin: 'http://localhost:5173'
    }
))

// router.get('/', test)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/create', createStudent)
router.get('/students', getStudents)
router.put('/verify/:id', verified)
// router.post('/sendotp', sendOTP)
// router.post('/verifyotp', verifyOTP)
// router.post('/upload-image', uploadImage)
module.exports = router 
