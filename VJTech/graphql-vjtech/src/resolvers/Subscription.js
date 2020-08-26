import getUserId from '../utils/getUserId'

const Subscription = {
    comment: {
        subscribe(parent, { soireeId }, { prisma }, info){
            return prisma.subscription.comment({
                where: {
                    node: {
                        soiree: {
                            id: soireeId
                        }
                    }
                }
            }, info)
        }
    },
    soiree: {
        subscribe(parent, args, { prisma }, info) {
            return prisma.subscription.soiree({
                where: {
                    node: {
                        published: true
                    }
                }
            }, info)
        }
    },
    mySoiree: {
        subscribe(parent, args, { prisma, request }, info) {
            const userId = getUserId(request)

            return prisma.subscription.soiree({
                where: {
                    node: {
                        author: {
                            id: userId
                        }
                    }
                }
            }, info)
        }
    }
}

export { Subscription as default }