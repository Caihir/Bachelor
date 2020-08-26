import { extractFragmentReplacements } from 'prisma-binding'
import Query from './Query'
import Mutation from './Mutation'
import Subscription from './Subscription'
import User from './User'
import Soiree from './Soiree'
import Comment from './Comment'

const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Soiree,
    Comment
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export { resolvers, fragmentReplacements }