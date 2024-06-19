import styles from "./Etablissements.module.css"
import { useEffect, useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import {toast} from "react-toastify"
import Skeleton from '@mui/material/Skeleton';
import { loadStripe } from '@stripe/stripe-js';
import clsx from "clsx"
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
import { MdEdit } from "react-icons/md";
import bcrypt from "bcryptjs-react";
var salt = bcrypt.genSaltSync(10);


const Etablissements = () => {

    if(!localStorage.getItem("session")) window.location.href = "/login"
    if(window.innerWidth < 1024) window.location.href = "/mobile"

    const [user, setUser] = useState(null)
    const [change, setChange] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm()

    useEffect(() => {
        (async () => {
            try {
                const session = JSON.parse(localStorage.getItem("session"))
                const userDB = await axios.get(`${import.meta.env.VITE_API_URL}/users/get/${session.user.email}`, {
                    headers: {
                        Authorization: `Bearer ${session.token}`
                    }
                })
                console.log(userDB)
                setUser(userDB.data.data)
                setLoading(false)
            } catch(e) {
                localStorage.removeItem('session')
                window.location.href = "/"
            }
        })()
    }, [change])


    const onSubmit = (data) => {

        if(data.name.length > 1){
            const obj = {
                name: data.name,
                owner_id: user.id_user
            }
    
            const session = JSON.parse(localStorage.getItem("session"))
            axios.post(`${import.meta.env.VITE_API_URL}/etablissements/create`, obj, {
                headers: {
                    Authorization: `Bearer ${session.token}`
                }
            }).then(res => {
                toast("Restaurant ajouté !", {type: "success"})
                setChange(!change)
                reset()
            }).catch(e => {
                toast(e.response.data.error, {type: "error"})
            })
        } else {
            toast("Le champ doit être rempli !", {type: "error"})
        }
        
    }

    const paySubscription = async () => {

        const session = JSON.parse(localStorage.getItem("session"))
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/stripe/create-checkout-session`, {
            price_id: selectedPlan,
            id_user: user.id_user
        }, {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
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

    const updateInformations = (data) => {
        if(data.firstName === "" || data.lastName === ""){
            toast("Informations non complètes !", {type: "error"})
            return
        }

        if(data.old_password !== ""){
            if(!bcrypt.compareSync(data.old_password, user.password)){
                toast("L'ancien mot de passe n'est pas correct", {type: "error"})
                return
            }
    
            if(data.new_password.length < 8){
                toast("Le mot de passe doit faire au moins 8 caractères", {type: "error"})
                return
            }

            if(data.new_password !== data.confirmation_new_password){
                toast("Les deux mots de passes ne correspondent pas", {type:"error"})
                return
            }

        }

        let obj = {
            id_user: user.id_user,
            firstName: data.firstName,
            lastName: data.lastName,
        }

        if(data.old_password !== ""){
            obj = {...obj, password: bcrypt.hashSync(data.new_password, salt)}
        }

        const session = JSON.parse(localStorage.getItem("session"))
        axios.post(`${import.meta.env.VITE_API_URL}/users/update`, obj, {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        }).then(res => {
            toast("Informations mises à jour !", {type:"success"})
            setIsOpen(false)
            setChange(!change)
        }).catch(e => {
            toast(e.response.data.error, {type: "error"})
        })
        

    }


    return(
        <div className={styles.container}>

            {isOpen && <>
                <div className={styles.shadow} onClick={() => setIsOpen(false)}></div>
                <div className={styles.must}>
                    <h2>Mes informations</h2>
                    <form onSubmit={handleSubmit(updateInformations)} className={styles.formUpdate}>
                        <input {...register("firstName")} type="text" placeholder="Prénom" defaultValue={user.firstName} />
                        <input {...register("lastName")} type="text" placeholder="Nom" defaultValue={user.lastName} />
                        <input {...register("email")} type="email" placeholder="Adresse email" defaultValue={user.email} disabled />
                        <input {...register("old_password")} type="password" placeholder="Ancien mot de passe" />
                        <input {...register("new_password")} type="password" placeholder="Nouveau mot de passe" />
                        <input {...register("confirmation_new_password")} type="password" placeholder="Confirmation du nouveau mot de passe" />
                        <input type="submit" value="Enregister" />
                    </form>
                </div>
            </>}

            {user ? <div className={styles.top}>
                <h1>Bonjour, {user.firstName} 👋</h1>
                <div>
                    <p onClick={logout}>Déconnexion</p>
                    <MdEdit className={styles.settings} onClick={() => setIsOpen(true)} />
                </div>
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