import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'


export default function View() {
    useEffect(() => {
        axios.get('/students').then((response) => {
          setStudents(response.data)
        }, [])
      }, [])
      const [students, setStudents] = useState([{}])
  return (
    <div class="min-h-screen flex items-center justify-center">
  <div class="w-100 bg-white rounded-lg shadow-lg p-6">
    <div class="overflow-x-auto">
      <table class="table-auto w-full">
        <thead class="sticky top-0 bg-gray-200 border-b">
          <tr>
            <th class="px-4 py-2">Index</th>
            <th class="px-4 py-2">Roll No</th>
            <th class="px-4 py-2">Name</th>
            <th class="px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index} class="border-b">
              <td class="px-4 py-2">{index + 1}</td>
              <td class="px-4 py-2">{student.rollno}</td>
              <td class="px-4 py-2">{student.name}</td>
              <td class="px-4 py-2">{student.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

  )
}
