import styles from './Footer.module.css';

const Footer = ({color}) => {
    return (
        <footer>
            <a
                target="_blank"
                className={color === "light" ? styles.light : styles.dark}
                href="https://matteo-bonnet.fr"
            >
                Made with ❤️ by Mattéo BONNET
            </a>
        </footer>
    );
}

export default Footer;