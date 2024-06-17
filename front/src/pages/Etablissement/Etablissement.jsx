import { useEffect, useState, useRef } from "react"
import styles from "./Etablissement.module.css"
import { useParams } from "react-router-dom"
import axios from "axios"
import Skeleton from '@mui/material/Skeleton';
import { useForm } from "react-hook-form"
import {toast} from "react-toastify"
import { MuiColorInput } from 'mui-color-input'
import { IoQrCodeOutline } from "react-icons/io5";
import QRCode from "react-qr-code";
import html2canvas from 'html2canvas';
import { FaLink } from "react-icons/fa6";
import { CiSettings } from "react-icons/ci";

const Etablissement = () => {

    const {id} = useParams()
    const [data, setData] = useState(null)
    const [isAddSection, setAddSection] = useState(false)
    const [addLine, setAddLine] = useState(null)
    const [edit, setEdit] = useState(null)
    const [editSection, setEditSection] = useState(null)
    const [change, setChange] = useState(false)
    const [color, setColor] = useState('#ffffff')
    const [settings, setSettings] = useState(false)
    const [displayQRCode, setDisplayQRCode] = useState(false)

    if(!localStorage.getItem("session")) window.location.href = "/login"
    if(window.innerWidth < 1024) window.location.href = "/mobile"

    const {
        register,
        handleSubmit,
        reset
    } = useForm()

    useEffect(() => {
        (async () => {
            const data = await axios.get(`${import.meta.env.VITE_API_URL}/etablissements/${id}`)
            setData(data.data.data)
            setColor(data.data.data.theme)
        })()
    }, [isAddSection, addLine, change, edit, editSection])

    const addSection = (data) => {

        if(data.name.length < 5){
            toast("La section doit au moins avoir 5 caractères", {type: "error"})
            return
        }

        if(data.rank == "") {
            toast("La section doit contenir un ordre d'apparition", {type: "error"})
            return
        }

        const obj = {
            name: data.name,
            id_etablissement: id,
            price: data.price.length > 0 ? data.price : null,
            rank: data.rank
        }
        const session = JSON.parse(localStorage.getItem("session"))
        axios.post(`${import.meta.env.VITE_API_URL}/sections/create`, obj, {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        }).then(res => {
            toast("Section ajoutée !", {type: "success"})
            setAddSection(false)
            reset({})
        }).catch(e => {
            toast(e.response.data.error, {type: "error"})
        })
    }

    const addLineFunction = (data) => {

        if(data.name.length < 5){
            toast("La section doit au moins avoir 5 caractères", {type: "error"})
            return
        }

        if(data.rank == "") {
            toast("La section doit contenir un ordre d'apparition", {type: "error"})
            return
        }

        const obj = {
            name: data.name,
            id_section: addLine,
            price: data.price.length > 0 ? data.price : null,
            rank: data.rank
        }
        const session = JSON.parse(localStorage.getItem("session"))
        axios.post(`${import.meta.env.VITE_API_URL}/lines/create`, obj, {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        }).then(res => {
            toast("Ligne ajoutée !", {type: "success"})
            setAddLine(null)
            reset({})
        }).catch(e => {
            toast(e.response.data.error, {type: "error"})
        })

    }

    const editLine = (data, id_line) => {
        const session = JSON.parse(localStorage.getItem("session"))
        axios.post(`${import.meta.env.VITE_API_URL}/lines/update/${id_line}`, data, {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        }).then(res => {
            toast("Ligne modifiée !", {type: "success"})
            setEdit(null)
            reset({})
        }).catch(e => {
            toast(e.response.data.error, {type: "error"})
        })
    }

    const deleteLine = (id_line) => {
        const session = JSON.parse(localStorage.getItem("session"))
        axios.post(`${import.meta.env.VITE_API_URL}/lines/delete/${id_line}`,{}, {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        }).then(res => {
            toast("Ligne supprimée !", {type: "success"})
            setChange(!change)
        }).catch(e => {
            toast(e.response.data.error, {type: "error"})
        })
    }

    const editSectionFunc = (data, id_section) => {

        if(data.name.length < 5){
            toast("La section doit au moins avoir 5 caractères", {type: "error"})
            return
        }

        if(data.rank == "") {
            toast("La section doit contenir un ordre d'apparition", {type: "error"})
            return
        }

        const session = JSON.parse(localStorage.getItem("session"))
        axios.post(`${import.meta.env.VITE_API_URL}/sections/update/${id_section}`, data, {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        }).then(res => {
            toast("Section modifiée !", {type: "success"})
            setEditSection(null)
            reset({})
        }).catch(e => {
            toast(e.response.data.error, {type: "error"})
        })
    }

    const deleteSection = (id_section) => {
        const session = JSON.parse(localStorage.getItem("session"))
        axios.post(`${import.meta.env.VITE_API_URL}/sections/delete/${id_section}`, {}, {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        }).then(res => {
            toast("Section supprimée !", {type: "success"})
            setChange(!change)
        }).catch(e => {
            toast(e.response.data.error, {type: "error"})
        })
    }

    const updateParams = (data) => {
        const session = JSON.parse(localStorage.getItem("session"))
        axios.post(`${import.meta.env.VITE_API_URL}/etablissements/update/${id}`, {logo: data.logo, theme: color}, {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        }).then(res => {
            toast("Établissement mis à jour !", {type: "success"})
            setChange(!change)
            setSettings(false)
            reset({})
        }).catch(e => {
            toast(e.response.data.error, {type: "error"})
        })
    }

    const captureRef = useRef();
    const saveQRCode = async () => {
        const element = captureRef.current;
        if (element) {
            const canvas = await html2canvas(element);
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = 'qrcode.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    return(
        <div className={styles.container}>

            <a href="/etablissements" className={styles.aucun}>&#x2190; Retour</a>


            {settings || displayQRCode ? <div className={styles.shadow} onClick={() => settings ? setSettings(false) : setDisplayQRCode(false)}></div> : null}
            {settings && <div className={styles.popup}>
                <h2>Paramètres</h2>
                <MuiColorInput value={color} onChange={(theme) => setColor(theme)} className={styles.colorPicker} />
                <form onSubmit={handleSubmit(updateParams)}>
                    <input type="text" defaultValue={data ? data.logo : null} {...register("logo")} placeholder="Lien de votre logo ..."/>
                    <input type="submit" value="Enregistrer" style={{backgroundColor: data ? data.theme : color}} />
                </form>
            </div>}

            {displayQRCode && <div className={styles.popup}>
                <div ref={captureRef}><QRCode value={`${import.meta.env.VITE_APP_URL}/menu/${id}`} className={styles.qrcode} /></div>
                <p onClick={saveQRCode}>Télécharger le QR code</p>
            </div>}

            {data ? <div className={styles.top}>
                {data.logo ? <img src={data.logo} alt="Logo" /> : <h1>{data.name}</h1>}
                <div className={styles.right}>
                    <p style={{backgroundColor: data ? data.theme : color}} onClick={() => setAddSection(true)}>Ajouter une section</p>
                    <IoQrCodeOutline className={styles.icon} onClick={() => setDisplayQRCode(true)} />
                    <FaLink className={styles.icon} onClick={() => window.open(`${import.meta.env.VITE_APP_URL}/menu/${id}`, '_blank')} />
                    <CiSettings className={styles.icon} onClick={() => setSettings(true)} />
                </div>
            </div>
            : <Skeleton variant="rectangular" width={210} height={30} style={{borderRadius: "5px"}} />}
            

            {isAddSection && <form className={styles.addLineStyle} style={{marginLeft: "0px"}} onSubmit={handleSubmit(addSection)}>
                <input type="text" {...register('name')} placeholder="Nom de la section ..." />
                <input type="text" {...register("price")} placeholder="Prix ..." />
                <input type="number" {...register("rank")} placeholder="Ordre d'apparition ..." />
                <input style={{backgroundColor: data ? data.theme : color}} type="submit" value="Ajouter" />
                <p onClick={() => {setAddSection(false); reset({})}}>Annuler</p>
            </form>}

            {data ? data.sections.length > 0 ? <div className={styles.sections}>
                {data.sections.map((section, index) => (
                    <div key={index} style={{margin: "0px"}}>

                        <div className={styles.line} key={index}>
                            {section.id_section === editSection ? <form onSubmit={handleSubmit((data) => editSectionFunc(data, section.id_section))}>
                                <input type="text" defaultValue={section.name} {...register("name")} placeholder="Nom ..." />
                                <input type="text" defaultValue={section.price} {...register("price")} placeholder="Prix ..." />
                                <input type="number" defaultValue={section.rank} {...register("rank")} placeholder="Ordre d'apparition ..." />
                                <input style={{backgroundColor: data ? data.theme : color}} type="submit" value="Enregistrer" />
                                <p onClick={() => {setEditSection(null);reset({})}}>Annuler</p>
                            </form> : 
                            <>
                                <h2>{section.name} <b style={{color: data ? data.theme : color}}>{section.price && `- ${section.price}€`}</b></h2>
                                <div className={styles.right}>
                                    <p className={styles.edit} onClick={() => setEditSection(section.id_section)}>Modifier</p>
                                    <p className={styles.delete} onClick={() => deleteSection(section.id_section)}>Supprimer</p>
                                </div>
                            </>}
                        </div>


                        <p style={{color: data ? data.theme : color}} className={styles.addLine} onClick={() => setAddLine(section.id_section)}>Ajouter une ligne</p>
                        {section.lines.length > 0 ? section.lines.map((line, index) => (
                            <div className={styles.line2} style={{marginLeft: "25px"}} key={index}>
                                {line.id_line === edit ?
                                    <form onSubmit={handleSubmit((data) => editLine(data, line.id_line))}>
                                        <input type="text" defaultValue={line.name} {...register("name")} />
                                        <input type="text" defaultValue={line.price} {...register("price")} placeholder="Prix ..." />
                                        <input type="number" defaultValue={line.rank} {...register("rank")} placeholder="Prix ..." />
                                        <input type="submit" value="Enregistrer" style={{backgroundColor: data ? data.theme : color}} />
                                        <p onClick={() => {setEdit(null);reset({})}}>Annuler</p>
                                    </form>
                                : 
                                    <>
                                        <p>{line.name} <b style={{color: data ? data.theme : color}}>{line.price && `- ${line.price}€`}</b></p>
                                        <div className={styles.right}>
                                            <p className={styles.edit} onClick={() => setEdit(line.id_line)}>Modifier</p>
                                            <p className={styles.delete} onClick={() => deleteLine(line.id_line)}>Supprimer</p>
                                        </div>
                                    </>
                                }
                            </div>
                        )) : null}
                        {section.id_section === addLine && <form className={styles.addLineStyle} onSubmit={handleSubmit(addLineFunction)}>
                            <input type="text" {...register('name')} placeholder="Nom de la ligne ..." />
                            <input type="text" {...register("price")} placeholder="Prix ..." />
                            <input type="number" {...register("rank")} placeholder="Ordre d'apparition ..." />
                            <input type="submit" value="Ajouter" style={{backgroundColor: data ? data.theme : color}} />
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

        </div>
    )
}

export default Etablissement