import styles from "./Success.module.css"

const Success = () => {
    return(
        <div>
            <div className={styles.container}>
                <img src="/payment.jpg" alt="Payment successful"/>
                <h1>Merci pour votre commande !</h1>
                <a href="/etablissements">Accéder à mon dashboard &#x2192;</a>
            </div>
        </div>
    )
}

export default Success