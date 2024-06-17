import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

const getCountryFromCode = (code) => {
    switch(code){
        case "GB":
            return "anglais"
        case "FR":
            return "français"
        case "ES":
            return "espagnol"
        case "CN":
            return "chinois mandarin"
        case "KR":
            return "coréen"
        case "JP":
            return "japonais"
        case "DE":
            return "allemand"
        case "IT":
            return "italien"
        default:
            return "portugais"
    }
}

export const translate = async (data, lang_dest) => {
    console.log(data)
    try{
        let tab = []
        for(let i=0; i<data.sections.length; i++){
            const newSectionName = await openai.chat.completions.create({
                messages: [{ role: 'user', content: `Tu dois traduire une ligne d'un menu d'un restaurant. Attention il faut que tu traduises de manière rigoureuse dans le domaine de la gastronomie. Pense bien à te placer dans la peau d'un chef cuisinier pour traduire correctement. Traduis moi en ${getCountryFromCode(lang_dest)} la ligne suivante : ${data.sections[i].name}. Renvoie uniquement la traduction sans ponctuation à la fin.` }],
                model: 'gpt-3.5-turbo',
            });
            let lines = []
            for(let k=0; k<data.sections[i].lines.length; k++){
                const newLine = await openai.chat.completions.create({
                    messages: [{ role: 'user', content: `Tu dois traduire une ligne d'un menu d'un restaurant. Attention il faut que tu traduises de manière rigoureuse dans le domaine de la gastronomie. Pense bien à te placer dans la peau d'un chef cuisinier pour traduire correctement. Traduis moi en ${getCountryFromCode(lang_dest)} la ligne suivante : ${data.sections[i].lines[k].name}. Renvoie uniquement la traduction sans ponctuation à la fin.` }],
                    model: 'gpt-3.5-turbo',
                });
                lines.push({name: newLine.choices[0].message.content, price: data.sections[i].lines[k].price})
            }
            tab.push({name: newSectionName.choices[0].message.content, price: data.sections[i].price, lines})
        }
        return {...data, sections: tab}
    } catch(e){
        localStorage.setItem('lang', 'FR')
        console.log(e)
        window.location.href = '/'
    }
}