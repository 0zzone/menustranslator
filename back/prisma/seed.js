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
        await prisma.user.create({
            data: users_to_add[i]
        })
    }
}

const main = async () => {
    await users()
}

main()