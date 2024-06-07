import styles from "./Etablissements.module.css"
import { useEffect, useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import {toast} from "react-toastify"
import Skeleton from '@mui/material/Skeleton';
import { loadStripe } from '@stripe/stripe-js';
import clsx from "clsx"
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


const Etablissements = () => {

    if(!localStorage.getItem("session")) window.location.href = "/login"

    const [user, setUser] = useState(null)
    const [change, setChange] = useState(false)
    const [loading, setLoading] = useState(true)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    useEffect(() => {
        (async () => {
            const user = JSON.parse(localStorage.getItem("session"))
            setLoading(true)
            const userDB = await axios.get(`${import.meta.env.VITE_API_URL}/users/get/${user.data.email}`)
            setUser(userDB.data.data)
            setLoading(false)
        })()
    }, [change])


    const onSubmit = (data) => {

        if(data.name.length > 1){
            const obj = {
                name: data.name,
                owner_id: user.id_user
            }
    
            axios.post(`${import.meta.env.VITE_API_URL}/etablissements/create`, obj).then(res => {
                toast("Restaurant ajouté !", {type: "success"})
                setChange(!change)
            }).catch(e => {
                toast(e.data.response.error, {type: "error"})
            })
        } else {
            toast("Le champ doit être rempli !", {type: "error"})
        }
        
    }

    const paySubscription = async () => {


        const response = await axios.post(`${import.meta.env.VITE_API_URL}/stripe/create-checkout-session`, {
            price_id: selectedPlan,
            id_user: user.id_user
        });
        
        const sessionId = response.data.id;

        const stripe = await stripePromise;
        const result = await stripe.redirectToCheckout({ sessionId });
        
        if (result.error) {
            return
        }

        
    }

    const [selectedPlan, setSelectedPlan] = useState(import.meta.env.VITE_SILVER_PRICE)
    const plans = [
        {name: "Silver", price: "39", description: "Si vous avez un seul établissement", price_id: import.meta.env.VITE_SILVER_PRICE},
        {name: "Gold", price: "69", description: "Si vous avez plusieurs établissements", price_id: import.meta.env.VITE_GOLD_PRICE}
    ]

    const getPlanByPriceId = (priceId) => {
        for(let i in plans){
            if(plans[i].price_id === priceId) return plans[i].name
        }
    }

    const logout = () => {
        localStorage.removeItem("session")
        window.location.href = "/"
    }


    return(
        <div className={styles.container}>

            {user ? <div className={styles.top}>
                <h1>Bonjour, {user.firstName} 👋</h1>
                <p onClick={logout}>Déconnexion</p>
            </div>
            : <Skeleton variant="rectangular" width={210} height={30} style={{borderRadius: "5px"}} />}
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" {...register("name")} placeholder="Nom du restaurant ..." />
                <input type="submit" value="Ajouter" /> 
            </form>

            <h2>Mes restaurants</h2>
            <div className={styles.liste}>
                {user && user.etablissements && user.etablissements.length > 0 ? user.etablissements.map((etablissement, index) => (
                    <a href={`/admin/etablissement/${etablissement.id_etablissement}`} key={index} className={styles.card}>
                        <h2>{etablissement.name}</h2>
                    </a>
                )) : loading ? <div className={styles.liste}>
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                    <Skeleton variant="rectangular" width={210} height={60} style={{borderRadius: "5px"}} />
                </div> : user.subscription ? <p className={styles.aucun}>Aucun restaurant</p>
                    : <>
                        <div className={styles.shadow}></div>
                        <div className={styles.must}>
                            <h2>Souscrivez dès à présent, promis ça dure 3 minutes</h2>
                            <div>
                                {plans.map((plan, index) => (
                                    <div className={clsx(styles.plan, plan.price_id === selectedPlan && styles.selected)} onClick={() => setSelectedPlan(plan.price_id)} key={index}>
                                        <div>
                                            <h1>{plan.name}</h1>
                                            <p>{plan.description}</p>
                                        </div>
                                        <h2>{plan.price}€ <b>/mois</b></h2>
                                    </div>
                                ))}
                            </div>
                            <p onClick={paySubscription}>Opter pour le plan {getPlanByPriceId(selectedPlan)} &#x2192;</p>
                        </div>
                    </>}
            </div>
        </div>
    )
}

export default Etablissements