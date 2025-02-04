import NavBar from "./navBar";
import Footer from "./footer";
import styles from "../styles/Layout.module.css";

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <NavBar />
        <div className={styles.content}>{children}</div>
      <Footer />
    </div>
  );
}
