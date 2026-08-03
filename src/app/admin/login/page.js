// src/app/admin/login/page.js

import LoginForm from '@/app/admin/login/LoginForm';

export const metadata = {
  title: 'Admin Login – EcomHutt',
  description: 'Secure admin sign‑in for managing the EcomHutt store',
};

export default function AdminLoginPage() {
  return <LoginForm />;
}
