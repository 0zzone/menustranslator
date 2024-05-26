import { useEffect, useState } from "react"
import styles from "./Etablissement.module.css"
import { useParams } from "react-router-dom"
import axios from "axios"
import Skeleton from '@mui/material/Skeleton';
import { useForm } from "react-hook-form"
import {toast} from "react-toastify"

const Etablissement = () => {

    const {id} = useParams()
    const [data, setData] = useState(null)
    const [isAddSection, setAddSection] = useState(false)
    const [addLine, setAddLine] = useState(null)
    const [edit, setEdit] = useState(null)
    const [editSection, setEditSection] = useState(null)
    const [change, setChange] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm()

    useEffect(() => {
        (async () => {
            const data = await axios.get(`${import.meta.env.VITE_API_URL}/etablissements/${id}`)
            setData(data.data.data)
        })()
    }, [isAddSection, addLine, change, edit, editSection])

    const addSection = (data) => {

        if(data.name.length < 5){
            toast("La section doit au moins avoir 5 caractères", {type: "error"})
            return
        }

        const obj = {
            name: data.name,
            id_etablissement: id,
            price: data.price.length > 0 ? data.price : null
        }
        axios.post(`${import.meta.env.VITE_API_URL}/sections/create`, obj).then(res => {
            toast("Section ajoutée !", {type: "success"})
            setAddSection(false)
        }).catch(e => {
            toast(e.data.response.error, {type: "error"})
        })
    }

    const addLineFunction = (data) => {

        if(data.name.length < 5){
            toast("La section doit au moins avoir 5 caractères", {type: "error"})
            return
        }

        const obj = {
            name: data.name,
            id_section: addLine,
            price: data.price.length > 0 ? data.price : null
        }
        axios.post(`${import.meta.env.VITE_API_URL}/lines/create`, obj).then(res => {
            toast("Ligne ajoutée !", {type: "success"})
            setAddLine(null)
        }).catch(e => {
            toast(e.data.response.error, {type: "error"})
        })

    }

    const editLine = (data, id_line) => {
        axios.post(`${import.meta.env.VITE_API_URL}/lines/update/${id_line}`, data).then(res => {
            toast("Ligne modifiée !", {type: "success"})
            setEdit(null)
        }).catch(e => {
            toast(e.data.response.error, {type: "error"})
        })
    }

    const deleteLine = (id_line) => {
        axios.post(`${import.meta.env.VITE_API_URL}/lines/delete/${id_line}`).then(res => {
            toast("Ligne supprimée !", {type: "success"})
            setChange(!change)
        }).catch(e => {
            toast(e.data.response.error, {type: "error"})
        })
    }

    const editSectionFunc = (data, id_section) => {
        axios.post(`${import.meta.env.VITE_API_URL}/sections/update/${id_section}`, data).then(res => {
            toast("Section modifiée !", {type: "success"})
            setEditSection(null)
        }).catch(e => {
            toast(e.data.response.error, {type: "error"})
        })
    }

    const deleteSection = (id_section) => {
        axios.post(`${import.meta.env.VITE_API_URL}/sections/delete/${id_section}`).then(res => {
            toast("Section supprimée !", {type: "success"})
            setChange(!change)
        }).catch(e => {
            toast(e.data.response.error, {type: "error"})
        })
    }

    return(
        <div className={styles.container}>

            <a href="/etablissements" className={styles.aucun}>&#x2190; Retour</a>

            {data ? <h1>{data.name}</h1> : <Skeleton variant="rectangular" width={210} height={30} style={{borderRadius: "5px"}} />}
            <div className={styles.tools}>
                <p onClick={() => setAddSection(true)}>Ajouter une section</p>
            </div>

            {data ? data.sections.length > 0 ? <div className={styles.sections}>
                {data.sections.map((section, index) => (
                    <div key={index} style={{marginTop: "50px"}}>

                        <div className={styles.line} key={index}>
                            {section.id_section === editSection ? <form onSubmit={handleSubmit((data) => editSectionFunc(data, section.id_section))}>
                                <input type="text" defaultValue={section.name} {...register("name")} placeholder="Nom ..." />
                                <input type="text" defaultValue={section.price} {...register("price")} placeholder="Prix ..." />
                                <input type="submit" value="Enregistrer" />
                                <p onClick={() => {setEditSection(null);reset({})}}>Annuler</p>
                            </form> : <h2>{section.name} {section.price && `- ${section.price}€`}</h2>}
                            <div className={styles.right}>
                                <p className={styles.edit} onClick={() => setEditSection(section.id_section)}>Modifier</p>
                                <p className={styles.delete} onClick={() => deleteSection(section.id_section)}>Supprimer</p>
                            </div>
                        </div>


                        <p className={styles.addLine} onClick={() => setAddLine(section.id_section)}>Ajouter une ligne</p>
                        {section.lines.length > 0 ? section.lines.map((line, index) => (
                            <div className={styles.line} style={{marginLeft: "25px"}} key={index}>
                                {line.id_line === edit ? <form onSubmit={handleSubmit((data) => editLine(data, line.id_line))}>
                                    <input type="text" defaultValue={line.name} {...register("name")} />
                                    <input type="text" defaultValue={line.price} {...register("price")} placeholder="Prix ..." />
                                    <input type="submit" value="Enregistrer" />
                                    <p onClick={() => {setEdit(null);reset({})}}>Annuler</p>
                                </form> : <p>{line.name} {line.price && `- ${line.price}€`}</p>}
                                <div className={styles.right}>
                                    <p className={styles.edit} onClick={() => setEdit(line.id_line)}>Modifier</p>
                                    <p className={styles.delete} onClick={() => deleteLine(line.id_line)}>Supprimer</p>
                                </div>
                            </div>
                        )) : null}
                        {section.id_section === addLine && <form className={styles.addLineStyle} onSubmit={handleSubmit(addLineFunction)}>
                            <input type="text" {...register('name')} placeholder="Nom de la section ..." />
                            <input type="text" {...register("price")} placeholder="Prix ..." />
                            <input type="submit" value="Ajouter" />
                            <p onClick={() => {setAddLine(null); reset({})}}>Annuler</p>
                        </form>}
                    </div>
                ))}
            </div> : <p className={styles.aucune}>Aucune section</p> : <div className={styles.liste}>
                <Skeleton variant="rectangular" width={210} height={30} style={{borderRadius: "5px"}} />   
                <Skeleton variant="rectangular" width={210} height={30} style={{borderRadius: "5px"}} />  
                <Skeleton variant="rectangular" width={210} height={30} style={{borderRadius: "5px"}} />  
                <Skeleton variant="rectangular" width={210} height={30} style={{borderRadius: "5px"}} />  
                <Skeleton variant="rectangular" width={210} height={30} style={{borderRadius: "5px"}} />   
            </div>}

            {isAddSection && <form className={styles.addLineStyle} style={{marginLeft: "0px"}} onSubmit={handleSubmit(addSection)}>
                <input type="text" {...register('name')} placeholder="Nom de la section ..." />
                <input type="text" {...register("price")} placeholder="Prix ..." />
                <input type="submit" value="Ajouter" />
                <p onClick={() => {setAddSection(false); reset({})}}>Annuler</p>
            </form>}
        </div>
    )
}

export default Etablissement