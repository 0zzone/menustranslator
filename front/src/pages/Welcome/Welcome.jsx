import styles from "./Welcome.module.css"
import { IoSpeedometerOutline } from "react-icons/io5";
import { RiTranslate } from "react-icons/ri";


const Welcome = () => {
    return(
        <div className={styles.container}>
            <h1>MenuMaster</h1>

            <div className={styles.first}>
                <div className={styles.left}>
                    <h1>Traduire son menu n{"'"}aura jamais été aussi simple.</h1>
                    <p>Éditez vos menus, nous nous chargeons de les traduire.</p>
                    <a href="/register">J{"'"}y vais !</a>
                </div>
                <img src="/resto.jpg" alt="Illustration" className={styles.img} />
            </div>

            <div className={styles.avantages}>
                <h1>Pourquoi utiliser MenuMaster pendant les <b>Jeux-Olympiques </b>?</h1>
                <div className={styles.card}>
                    <IoSpeedometerOutline className={styles.icon} />
                    <h2>Publiez rapidement</h2>
                    <p>Publiez les mises à jour de votre menu instantanément pour les clients.</p>
                </div>
                <div className={styles.card}>
                    <RiTranslate className={styles.icon} />
                    <h2>Traduction automatique</h2>
                    <p>Chaque client peut traduire son menu parmi une sélection de langages.</p>
                </div>
            </div>

            <div className={styles.mobileDiv}>
                <img src="/phone.png" className={styles.phone} />
                <div className={styles.left}>
                    <h1>Le menu est déjà dans leur poche.</h1>
                    <p>Générez automatiquement un QR code pour accéder à votre menu en ligne, exposez le à vos clients et laissez la magie opérer.</p>
                </div>
            </div>

        </div>
    )
}

export default Welcome