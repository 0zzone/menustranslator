import styles from "../Login/Login.module.css"
import { useForm } from "react-hook-form"
import axios from "axios"
import { toast } from "react-toastify"
import bcrypt from "bcryptjs-react";
import { useState } from "react";
import clsx from "clsx"
var salt = bcrypt.genSaltSync(10);

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Register = () => {

    if(localStorage.getItem("session")) window.location.href = "/etablissements"

    const {
        register,
        handleSubmit,
    } = useForm()

    const onSubmit = async (data) => {

        if(data.password != data.confirmPassword) {
            toast("Mots de passe différents !", {type: "error"})
            return
        }

        if(data.password.length < 8){
            toast("Votre mot de passe doit faire au moins 8 caractères", {type: "error"})
            return;
        }

        try {

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/stripe/create-checkout-session`, {
                price_id: selectedPlan
            });

            const sessionId = response.data.id;

            const obj = {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                password: bcrypt.hashSync(data.password, salt),
                subscription: selectedPlan
            }

            axios.post(`${import.meta.env.VITE_API_URL}/users/create`, obj).then(res => {
                localStorage.setItem("session", JSON.stringify(res.data))
                // window.location.href = "/etablissements"
            }).catch(e => {
                toast(e.response.data.error, {type: "error"})
            })
      
            const stripe = await stripePromise;
            const result = await stripe.redirectToCheckout({ sessionId });

            if (result.error) {
              toast(result.error.message, {type: "error"});
              return
            }


          } catch (error) {
            console.error('Error:', error);
          }

    }

    const [selectedPlan, setSelectedPlan] = useState(import.meta.env.VITE_SILVER_PRICE)
    const plans = [
        {name: "Silver", price: "39", description: "Si vous avez un seul établissement", price_id: import.meta.env.VITE_SILVER_PRICE},
        {name: "Gold", price: "69", description: "Si vous avez plusieurs établissements", price_id: import.meta.env.VITE_GOLD_PRICE}
    ]

    return(
        <div className={styles.container}>
            <div>
                <h1>Inscription</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="text" {...register("firstName")} placeholder="Prénom ..." required />
                    <input type="text" {...register("lastName")} placeholder="Nom ..." required />
                    <input type="email" {...register("email")} placeholder="Adresse e-mail ..." required />
                    <input type="password" {...register("password")} placeholder="Mot de passe ..." required />
                    <input type="password" {...register("confirmPassword")} placeholder="Confirmer le mot de passe ..." required />
                    {plans.map((plan, index) => (
                        <div className={clsx(styles.plan, plan.price_id === selectedPlan && styles.selected)} onClick={() => setSelectedPlan(plan.price_id)} key={index}>
                            <div>
                                <h3>{plan.name}</h3>
                                <p>{plan.description}</p>
                            </div>
                            <h2>{plan.price}€ <b>/mois</b></h2>
                        </div>
                    ))}
                    <input type="submit" value="S'inscrire" />
                </form>
                <a href="/login">{"J'"}ai déjà un compte ?</a>
            </div>
        </div>
    )
}

export default Register