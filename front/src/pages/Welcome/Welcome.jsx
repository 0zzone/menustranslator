import styles from "./Welcome.module.css"
import { IoSpeedometerOutline } from "react-icons/io5";
import { RiTranslate } from "react-icons/ri";
import { FaRegCheckCircle } from "react-icons/fa";


const Welcome = () => {
    return(
        <div className={styles.container}>
            <header>
                <img src="/logo.png" alt="Logo" />
                <h1>Menufy</h1>
            </header>

            <div className={styles.first}>
                <div className={styles.left}>
                    <h1>Traduire son menu n{"'"}aura jamais été aussi simple</h1>
                    <p>Éditez vos menus, une Intelligence Artificielle se charge de les traduire !</p>
                    <div>
                        <a href="/register" className={styles.try}>Essayer dès maintenant !</a>
                        <a href="/demo" className={styles.demo}>Demander une démo</a>
                    </div>
                </div>
                <img src="/resto.jpg" alt="Illustration" className={styles.img} />
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className={styles.svg}>
                <path fill="#F1F1F1" fillOpacity="1" d="M0,224L40,229.3C80,235,160,245,240,240C320,235,400,213,480,186.7C560,160,640,128,720,112C800,96,880,96,960,122.7C1040,149,1120,203,1200,208C1280,213,1360,171,1400,149.3L1440,128L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
            </svg>

            <div className={styles.avantages}>
                <h1>Pourquoi utiliser Menufy pendant les <b>Jeux-Olympiques </b>?</h1>
                <div className={styles.card}>
                    <IoSpeedometerOutline className={styles.icon} />
                    <h2>Publiez rapidement</h2>
                    <p>Publiez les mises à jour de votre menu instantanément pour vos clients.</p>
                </div>
                <div className={styles.card}>
                    <RiTranslate className={styles.icon} />
                    <h2>Traduction automatique</h2>
                    <p>Chaque client peut traduire son menu parmi une large sélection de langages.</p>
                </div>
            </div>

            <div className={styles.mobileDiv}>
                <img src="/phone.png" className={styles.phone} />
                <div className={styles.left}>
                    <h1>Le menu est déjà dans la poche de vos clients</h1>
                    <p className={styles.step}>
                        <FaRegCheckCircle className={styles.tick} />
                        Générez un QR code
                    </p>
                    <p className={styles.step}>
                        <FaRegCheckCircle className={styles.tick} />
                        Exposez-le à vos clients
                    </p>
                    <p className={styles.step}>
                        <FaRegCheckCircle className={styles.tick} />
                        Laissez la magie opérer
                    </p>
                </div>
            </div>

            <div className={styles.pricingContainer}>
                <h1>Deux offres, rien que ça</h1>
                <div className={styles.pricing}>
                    <div>
                        <h1>Silver</h1>
                        <h2>49€ <b>/mois</b></h2>
                        <p>Vous avez <b>un seul</b> établissement ? Cette offre est faite pour vous !</p>
                        <a href="/register">J{"'"}y vais</a>
                    </div>
                    <div>
                        <h1>Gold</h1>
                        <h2>59€ <b>/mois</b></h2>
                        <p>Vous avez <b>plusieurs</b> établissements ? Cette offre est faite pour vous !</p>
                        <a href="/register">J{"'"}y vais</a>
                    </div>
                </div>
            </div>

            <footer>
                <a target="_blank" href="https://matteo-bonnet.fr/">Made with ❤️ by Mattéo Bonnet</a>
            </footer>

        </div>
    )
}

export default Welcome