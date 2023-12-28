import { Loader } from "react-feather"
import styles from '../Animations.module.scss';

export const LoadingIcon = () => {
  return <Loader size={16} className={styles.rotate_center}  />
}
