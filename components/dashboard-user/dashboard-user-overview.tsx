import styles from "./dashboard-user-page.module.scss";

const DashboardUserOverview = () => {
  return (
    <div>
      <h1 className={styles.title}>Dashboard</h1>
      <p className={styles.subtitle}>Welcome to your dashboard.</p>
    </div>
  );
};

export default DashboardUserOverview;
