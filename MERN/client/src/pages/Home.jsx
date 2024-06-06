import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import styles from '../styles/home.module.css';

export default function Home() {
  const [selectedImageLLM, setSelectedImageLLM] = useState('');
  const [selectedImageDL, setSelectedImageDL] = useState('');
  const [predictionLLM, setPredictionLLM] = useState('');
  const [predictionDL, setPredictionDL] = useState('');

  const handleImageChangeLLM = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImageLLM(imageUrl);
    }
  };

  const handleImageChangeDL = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImageDL(imageUrl);
    }
  };

  const uploadImage = async (imageUrl, predictUrl, setPrediction) => {
    const toastID = toast.loading('Uploading Image and Predicting...');
    try {
      const formData = new FormData();
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      formData.append('image', blob, 'image.jpg');
      const predictResponse = await fetch(predictUrl, {
        method: 'POST',
        body: formData,
      });
      const data = await predictResponse.json();
      setPrediction(data.prediction);
      toast.dismiss(toastID);
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image');
      toast.dismiss(toastID);
    }
  };

  const uploadImageLLM = () => {
    if (selectedImageLLM) {
      setPredictionLLM('');
      uploadImage(selectedImageLLM, 'http://127.0.0.1:5000//predict_llm', setPredictionLLM);
    } else {
      toast.error('Please upload an image');
    }
  };

  const uploadImageDL = () => {
    if (selectedImageDL) {
      setPredictionDL('');
      uploadImage(selectedImageDL, 'http://127.0.0.1:5000//predict_dl', setPredictionDL);
    } else {
      toast.error('Please upload an image');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-52 h-full" >
      <h1 className="text-3xl font-bold mb-8">Breast Cancer Segmentation and Classification with LLM and DL</h1>
      <div className="flex flex-wrap w-full max-w-5xl mx-auto">
        <div className="w-full md:w-1/2 px-2">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full">
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Predict with LLM</div>
              <div className="flex flex-col mt-4">
                <input type="file" accept="image/*" onChange={handleImageChangeLLM} style={{ marginBottom: '10px' }} />
                {selectedImageLLM && (
                  <div>
                    <img src={selectedImageLLM} alt="Selected" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                  </div>
                )}
                {predictionLLM && <div className={styles.pred_msg}>Our LLM predicts: {predictionLLM}</div>}
                <div className="flex mt-2">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2" onClick={uploadImageLLM}>Predict with LLM</button>
                  <button className="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2" >Send to Unreal</button>
                  <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => {setSelectedImageLLM(''); setPredictionLLM('')}}>Clear</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 px-2">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full">
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Predict with DL</div>
              <div className="flex flex-col mt-4">
                <input type="file" accept="image/*" onChange={handleImageChangeDL} style={{ marginBottom: '10px' }} />
                {selectedImageDL && (
                  <div>
                    <img src={selectedImageDL} alt="Selected" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                  </div>
                )}
                {predictionDL && <div className={styles.pred_msg}>Our Deep Learning model predicts: {predictionDL}</div>}
                <div className="flex mt-2">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2" onClick={uploadImageDL}>Predict with DL</button>
                  <button className="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2" >Send to Unreal</button>
                  <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => {setPredictionDL(''); setSelectedImageDL('')}}>Clear</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
