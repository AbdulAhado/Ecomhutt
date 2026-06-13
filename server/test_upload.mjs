import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

async function testUpload() {
  try {
    const formData = new FormData();
    // create a dummy image
    fs.writeFileSync('test.jpg', 'dummy content');
    formData.append('images', fs.createReadStream('test.jpg'));

    const config = {
      headers: {
        ...formData.getHeaders()
      }
    };
    
    console.log('Sending upload request via Vite proxy...');
    const { data } = await axios.post('http://localhost:5173/api/upload', formData, config);
    console.log('Success:', data);
  } catch (error) {
    console.error('Error:', error.response?.status, error.response?.data);
  }
}

testUpload();
