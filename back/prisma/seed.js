const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient()

const users = async () => {
    const users_to_add = [
        {
            email: "mb.matteobonnett@gmail.com",
            firstName: "Mattéo",
            lastName: "BONNET",
            password: "$2a$10$ZWIbAzqh51TkxKz44.B7jeF6XS7YfVkjhf0YPS8R0/Cjrpo1P8ha.",
            subscription: null,
            role: "ADMIN"
        },
        {
            email: "restaurantleradisbeurre@gmail.com",
            firstName: "Jérôme",
            lastName: "BONNET",
            password: "$2a$10$NcLo15gDAv133fzAEhM77.EQqOpTy9ISmH2mTe7R/WQpCXancy.mC",
            subscription: null,
            role: "FREE"
        }
    ]

    for(let i=0; i<users_to_add.length; i++) {
        try {
            await prisma.user.create({
                data: users_to_add[i]
            })
        } catch (e) {
            console.log("User cannot be created")
        }
}

const langs = async () => {
    const langs_to_add = [
        {
            name: "Français",
            code: "FR"
        },
        {
            name: "Anglais",
            code: "GB"
        },
        {
            name: "Espagnol",
            code: "ES"
        },
        {
            name: "Chinois",
            code: "CN"
        },
        {
            name: "Coréen",
            code: "KR"
        },
        {
            name: "Japonais",
            code: "JP"
        },
        {
            name: "Allemand",
            code: "DE"
        },
        {
            name: "Portugais",
            code: "PT"
        },
        {
            name: "Italien",
            code: "IT"
        },
        {
            name: "Ukrainien",
            code: "UA"
        },
        {
            name: "Russe",
            code: "RU"
        }
    ]

    for(let i=0; i<langs_to_add.length; i++) {
        await prisma.lang.create({
            data: langs_to_add[i]
        })
    }
}

const main = async () => {
    await users()
    await langs()
}

main()