import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDatabase, { userOne, userTwo, commentOne, commentTwo, soireeOne, soireeTwo } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { createComment, updateComment, deleteComment, subscribeToComments, subscribeToSoirees } from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('Should create a comment', async () => {
    const client = getClient(userOne.jwt)
    const variables = {
        data: {
            soiree: soireeOne.soiree.id,
            text: "Test comment"
        }
    }
    const { data } = await client.mutate({ mutation: createComment, variables })

    expect(data.createComment.text).toBe('Test comment')
})

test('Should require authentication to create a comment', async () => {
    const variables = {
        data: {
            soiree: soireeOne.soiree.id,
            text: "Test comment auth"
        }
    }
    await expect(
        client.mutate({ mutation: createComment, variables })
    ).rejects.toThrow()
})

test('Should not create comment on draft post', async () => {
    const client = getClient(userOne.jwt)
    const variables = {
        data: {
            soiree: soireeTwo.soiree.id,
            text: "Test comment"
        }
    }
    await expect(
        client.mutate({ mutation: createComment, variables })
    ).rejects.toThrow()
})

test('Should update a comment', async () => {
    const client = getClient(userOne.jwt)
    const variables = {
        id: commentTwo.comment.id,
        data: {
            text: "Comment 2 update"
        }
    }
    const { data } = await client.mutate({ mutation: updateComment, variables })

    expect(data.updateComment.text).toBe('Comment 2 update')
})

test('Should not update another users comment', async () => {
    const client = getClient(userTwo.jwt)
    const variables = {
        id: commentTwo.comment.id,
        data: {
            text: "Comment 2 update should not work"
        }
    }
    await expect(
        client.mutate({ mutation: updateComment, variables })
    ).rejects.toThrow()
})

test('Should not delete another users comment', async() => {
    const client = getClient(userTwo.jwt)
    const variables = {
        id: commentTwo.comment.id       
    }    
    await expect(
        client.mutate({ mutation: deleteComment, variables })
    ).rejects.toThrow()
})

test('Should delete own comment', async() => {
    const client = getClient(userOne.jwt)
    const variables = {
        id: commentTwo.comment.id       
    }    
    await client.mutate({ mutation: deleteComment, variables })
    const exists = await prisma.exists.Comment({ id: commentTwo.comment.id })

    expect(exists).toBe(false)
})

test('Should not delete other comment', async () => {
    const client = getClient(userOne.jwt)
    const variables = {
        id: commentOne.comment.id       
    }    
    await expect(
        client.mutate({ mutation: deleteComment, variables })    
    ).rejects.toThrow()
})

test('Should subscribe to comments for a soiree', async (done) => {
    const variables = {
        soireeId: soireeOne.soiree.id
    }
    client.subscribe({ query: subscribeToComments, variables }).subscribe({ 
        next(response) {
            expect(response.data.comment.mutation).toBe('DELETED')
            done()
        }
     })

     await prisma.mutation.deleteComment({ where: { id: commentOne.comment.id }})
})

test('Should subscribe to changes for published soirees', async (done) => {
    client.subscribe({ query: subscribeToSoirees }).subscribe({
        next(response) {
            expect(response.data.soiree.mutation).toBe('DELETED')
            done()
        }
    })

    await prisma.mutation.deleteSoiree({ where: { id: soireeOne.soiree.id } })
})