import Link from "next/link";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        <div className={styles.column}>
          <h3 className={styles.title}>FruitFacts</h3>
          <p>Cùng khám phá những thông tin bổ ích về trái cây!</p>
          <p>Email: contact@fruitfacts.com</p>
          <p>Phone: +84 123 456 789</p>
        </div>

        
        <div className={styles.column}>
          <h3 className={styles.title}>Liên kết nhanh</h3>
          <Link href="/" className={styles.link}>
            Trang chủ
          </Link>
          <Link href="/about" className={styles.link}>
            Giới thiệu
          </Link>
          <Link href="/fruit-filter" className={styles.link}>
            Các loại trái cây
          </Link>
          <Link href="/contact" className={styles.link}>
            Liên hệ
          </Link>
        </div>

        {/* Cột 3: Mạng xã hội */}
        <div className={styles.column}>
          <h3 className={styles.title}>Theo dõi chúng tôi</h3>
          <a href="https://facebook.com" className={styles.link}>
            Facebook
          </a>
          <a href="https://instagram.com" className={styles.link}>
            Instagram
          </a>
          <a href="https://twitter.com" className={styles.link}>
            Twitter
          </a>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; 2025 FruitFacts. All rights reserved.</p>
      </div>
    </footer>
  );
}