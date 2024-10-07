import styles from "./Menu.module.css"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Lang from "./Lang";
import { translate } from "../../functions/translator";
import {toast} from "react-toastify"
import {Helmet} from "react-helmet"
import Footer from "../../components/Footer/Footer";

const Menu = () => {

    const {id} = useParams()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [lang, setLang] = useState('FR')
    const [frenchData, setFrenchData] = useState([])

    useEffect(() => {
        (async () => {
            setLoading(true)
            axios.get(`${import.meta.env.VITE_API_URL}/etablissements/${id}`).then(async res => {
                if(lang !== "FR"){
                    setFrenchData(res.data.data.sections)
                    let tab = await translate(res.data.data, lang)
                    setData(tab)
                    setLoading(false)
                } else {
                    setData(res.data.data)
                    setLoading(false)
                }
            }).catch(e => {
                if(e.response.status === 404){
                    window.location.href = "/notFound"
                } else {
                    toast(e.response.data.error, {type: "error"})
                }
            })
        })()
    }, [lang])


    return(
        <>

            {data && <Helmet>
                <meta charSet="utf-8" />
                <title>{`Menu - ${data.name}`}</title>
                <link rel="canonical" href={window.location.pathname} />
            </Helmet>}

            {!loading ? <div className={styles.container}>
                {data.logo ? <img src={data.logo} alt="Logo" /> : <h1>{data.name}</h1>}

                <Lang lang={lang} setLang={setLang} />

                {data.sections.map((section, index) => (
                    <div key={index}>
                        <h2 style={{color: data ? data.theme : "#628f50"}}>{section.name} {section.price && `- ${section.price}€`}</h2>
                        {section.lines.map((line, index2) => (
                            <div key={`${index}_${index2}`}> 
                                {index2 > 0 && <div className={styles.ball}></div>}
                                <p>{line.name} {line.price && `- ${line.price}€`}</p>
                                {frenchData.length > 0 && lang != "FR" &&
                                    <p className={styles.littleNameFrench}>{frenchData[index].lines[index2].name}</p>
                                }
                            </div>
                        ))}
                    </div>
                ))}
                <p className={styles.credits}>Made by Mattéo Bonnet</p>
            </div> : <div className={styles.loading}>
                <p>Chargement ...</p>
                <Box sx={{ display: 'flex', justifyContent: "center", width: "100%", marginTop:"50px"}}>
                    <CircularProgress color="grey" />
                </Box>
            </div>}

            <Footer color={"light"} />

        </>
    )
}

export default Menu