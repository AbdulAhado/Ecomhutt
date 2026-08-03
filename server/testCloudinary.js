import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
  cloud_name: 'dwlbtg3yp',
  api_key: '593249536899935',
  api_secret: 'QZuJmUpV_vlDxBlqxgMKJ5EUT-0'
});
cloudinary.api.ping()
  .then(res => console.log('Ping success:', res))
  .catch(err => console.error('Ping error:', err));
