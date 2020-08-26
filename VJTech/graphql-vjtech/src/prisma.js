import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers/index'

const prisma = new Prisma ({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    fragmentReplacements
})

export { prisma as default }

// prisma.query.users(null, '{ id name soirees { id title } }').then((data) => {

// })

// prisma.mutation.createSoiree({
//     data: {
//         title: "GraphQL 101",
//         body: "",
//         published: false,
//         author: {
//             connect: {
//                 id: "cjjybkwx5006h0822n32vw7dj"
//             }
//         }
//     }
// }, '{ id title body published }').then((data) => {
//     console.log(data)
// })