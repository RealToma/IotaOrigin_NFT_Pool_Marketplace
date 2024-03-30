import styles from './Loading.module.css';

const LoadingEffectMain = ({ text }: any) => {
  return (
    <div className={styles.content_loading}>
      <div className={styles.ring_loading}>
        {text}
        <span className={styles.page_loading_spin}></span>
      </div>
    </div>
  );
};

export default LoadingEffectMain;
