import styles from './Hatch.module.css';
import { Link } from 'react-router-dom';
type Props = {
    link:string,
    image: string
}






const Hatch = ({link, image}: Props) => {
    
    return (  
    <Link to={link} className={cx(styles.link, className)}>
        {children}
    </Link>
    );
};

export default Hatch;
