import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useEffect } from 'react'
import styles from '../styles/home.module.css'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState('');
  const[prediction, setPrediction] = useState('');

  const [flag, setFlag] = useState('');

  const handleImageChange = (e) => {
    // Set the selected image file to the state
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };
  const uploadImage = async () => {
    if (selectedImage) {
      try {
        const formData = new FormData();
        
        // Fetch the image data from the blob URL
        const response = await fetch(selectedImage);
        const blob = await response.blob();
  
        // Append the blob data to FormData
        formData.append('image', blob, 'image.jpg'); // 'image.jpg' is the filename, you can adjust it as needed
  
       if(flag === 'DL'){
         // Send the FormData containing the image file to your Flask server
          var predictResponse = await fetch('http://127.0.0.1:5000/predict_DL', {
          method: 'POST',
          body: formData, // Send the FormData containing the image file
        });
       }
       else{
         // Send the FormData containing the image file to your Flask server
          var predictResponse = await fetch('http://127.0.0.1:5000/predict_llm', {
          method: 'POST',
          body: formData, // Send the FormData containing the image file
        });
       }
  
        // Handle response from the server
        const data = await predictResponse.json();
        console.log(data.prediction);
        // setSelectedImage(null);
        setPrediction(data.prediction);
        // toast.success('Image uploaded successfully');
      } catch (error) {
        console.error(error);
        toast.error('Failed to upload image');
      }
    }
  };

  const clearClicked = () => {
    setPrediction('');
    setSelectedImage(null);
    setFlag('');
    
  }
  
  return (
    <div class="flex justify-center mt-60 h-full">
      <div class="max-w-lg mx-auto bg-white rounded-xl overflow-hidden shadow-lg">
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">Welcome to Student Portal!</div>
          <div class="flex flex-wrap justify-between items-center mt-4">
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: '10px'}}/>
            {selectedImage && (
              <div>
                <img src={selectedImage} alt="Selected" style={{ maxWidth: '200px', maxHeight: '200px' }} />
              </div>
              
            )}
            {prediction && flag==='LLM' && <div className={styles.pred_msg}>Our LLM predicts: {prediction}</div>}
            {prediction && flag==='DL' && <div className={styles.pred_msg}>Our Deep Learning model predicts: {prediction}</div>}
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2" onClick={() => {uploadImage(); setFlag('LLM');}}>Predict with LLM</button>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2" onClick={() => {uploadImage(); setFlag('DL');}}>Predict with DL</button>

            <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2" onClick={clearClicked}>Clear</button>
          </div>
        </div>
      </div>
    </div>
  );
}
