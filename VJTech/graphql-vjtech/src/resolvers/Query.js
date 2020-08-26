import getUserId from '../utils/getUserId'

const Query = {
    users(parent, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        }

        if (args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }]
            }
        }

        return prisma.query.users(opArgs, info)
    },
    mySoirees(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                author: {
                    id: userId
                }
            }
        }

        if (args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }]
        }

        return prisma.query.soirees(opArgs, info)
    },
    soirees(parent, args, { prisma }, info) {
        // const userId = getUserId(request)
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {                
                published: true                
            }
        }

        if (args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }]
        }

        return prisma.query.soirees(opArgs, info)
    },
    comments(parent, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        }

        return prisma.query.comments(opArgs, info)
    },
    me(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        
        return prisma.query.user({
            where: {
                id: userId
            }
        })
    },
    async soiree(parent, args, { prisma, request }, info) {
        const userId = getUserId(request, false)

        const soirees = await prisma.query.soirees({
            where: {
                id: args.id,
                OR: [{
                    published: true
                }, {
                    author: {
                        id: userId
                    }
                }]
            }
        }, info)

        if (soirees.length === 0) {
            throw new Error('Soiree not found')
        }

        return soirees[0]
    }
}

export { Query as default }