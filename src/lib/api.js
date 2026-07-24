import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchProducts = async () => {
  try {
    const res = await apiClient.get('/products');
    return res.data.map(p => ({
      ...p,
      id: String(p._id),
      image: getImageUrl(p.image || (p.images && p.images[0])),
      images: (p.images || []).map(img => getImageUrl(img)),
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchHeroBanners = async () => {
  try {
    const res = await apiClient.get('/herobanners');
    return res.data
      .filter(b => b.isActive)
      .map(b => ({
        ...b,
        image: getImageUrl(b.image),
      }));
  } catch (error) {
    console.error('Error fetching hero banners:', error);
    return [];
  }
};

export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/uploads')) {
    return `${BACKEND_URL}${url}`;
  }
  if (url.startsWith('uploads/')) {
    return `${BACKEND_URL}/${url}`;
  }
  return url;
};
