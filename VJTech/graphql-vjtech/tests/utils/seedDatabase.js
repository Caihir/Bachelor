import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../src/prisma'

const userOne = {
    input: {
        name: "Jean",
        email: "Jean@gmail.com",
        password: bcrypt.hashSync("JeanBonn"),
        isVJ: true,
        isOrga: true
    },
    user: undefined,
    jwt: undefined
}

const userTwo = {
    input: {
        name: "Jean2",
        email: "Jean2@gmail.com",
        password: bcrypt.hashSync("JeanBonn"),
        isVJ: true,
        isOrga: true
    },
    user: undefined,
    jwt: undefined
}

const soireeOne = {
    input: {
        title: "Soirée fatigue",
        body: "J irais bien me coucher",
        published: true
    },
    soiree: undefined
}

const soireeTwo = {
    input: {
        title: "Soirée teuf après taff",
        body: "TB TERMINE !!!",
        published: false
    },
    soiree: undefined
}

const commentOne = {
    input: {
        text: "C'est de nouveau la journee jsuis en forme"
    },
    comment: undefined
}

const commentTwo = {
    input: {
        text: "Hate d'avoir fini !"
    },
    comment: undefined
}

const seedDatabase = async () => {
    // Delete test data
    await prisma.mutation.deleteManyComments()
    await prisma.mutation.deleteManySoirees()
    await prisma.mutation.deleteManyUsers()

    // Create user one
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })
    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

    // Create user two
    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    })
    userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)

    // Create soiree one    
    soireeOne.soiree = await prisma.mutation.createSoiree({
        data: {
            ...soireeOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    // Create soiree two
    soireeTwo.soiree = await prisma.mutation.createSoiree({
        data: {
            ...soireeTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    // Create comment one    
    commentOne.comment = await prisma.mutation.createComment({
        data: {
            ...commentOne.input,
            author: {
                connect: {
                    id: userTwo.user.id
                }
            },
            soiree: {
                connect: {
                    id: soireeOne.soiree.id
                }
            }
        }
    })

    // Create comment two    
    commentTwo.comment = await prisma.mutation.createComment({
        data: {
            ...commentTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            },
            soiree: {
                connect: {
                    id: soireeOne.soiree.id
                }
            }
        }
    })
}

export { seedDatabase as default, userOne, userTwo, soireeOne, soireeTwo, commentOne, commentTwo }