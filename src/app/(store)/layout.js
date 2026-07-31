import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function StoreLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
