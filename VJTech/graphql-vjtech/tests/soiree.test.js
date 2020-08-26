import 'cross-fetch/polyfill'
import { gql } from 'apollo-boost'
import prisma from '../src/prisma'
import seedDatabase, { userOne, userTwo, soireeOne, soireeTwo } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { getSoirees, getSoiree, mySoirees, updateSoiree, createSoiree, deleteSoiree } from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('Should expose published soirees', async () => {
    const response = await client.query({ query: getSoirees })

    expect(response.data.soirees.length).toBe(1)
    expect(response.data.soirees[0].published).toBe(true)
})

test('Should fetch user soirees', async () => {
    const client = getClient(userOne.jwt)    
    const { data } = await client.query({ query: mySoirees })

    expect(data.mySoirees.length).toBe(2)       
})

test('Should be able to update own soiree', async () => {
    const client = getClient(userOne.jwt)
    const variables = {
        id: soireeOne.soiree.id,
        data: {
            published: false
        }
    }    
    const { data } = await client.mutate({ mutation: updateSoiree, variables })
    const exists = await prisma.exists.Soiree({ id: soireeOne.soiree.id, published: false })

    expect(data.updateSoiree.published).toBe(false)
    expect(exists).toBe(true)
})

test('Should create a soiree', async () => {
    const client = getClient(userOne.jwt)
    const variables = {
        data: {
            title: "Test soiree",
            body: "",
            published: true
        }
    }
    const { data } = await client.mutate({ mutation: createSoiree, variables })

    expect(data.createSoiree.title).toBe('Test soiree')
    expect(data.createSoiree.body).toBe('')
    expect(data.createSoiree.published).toBe(true)
})

test('Should delete own soiree', async () => {
    const client = getClient(userOne.jwt)
    const variables = {
        id: soireeTwo.soiree.id       
    }    
    await client.mutate({ mutation: deleteSoiree, variables })
    const exists = await prisma.exists.Soiree({ id: soireeTwo.soiree.id })

    expect(exists).toBe(false)
})

test('Should not be able to update another users soiree', async () => {
    const client = getClient(userTwo.jwt)
    const variables = {
        id: soireeOne.soiree.id,
        data: {
            published: false
        }
    }    
    await expect(
        client.mutate({ mutation: updateSoiree, variables })
    ).rejects.toThrow()    
})

test('Should not be able to delete another users soiree', async () => {
    const client = getClient(userTwo.jwt)
    const variables = {
        id: soireeTwo.soiree.id       
    }    
    await expect(
         client.mutate({ mutation: deleteSoiree, variables })
    ).rejects.toThrow()    
})

test('Should require authentication to create a soiree', async () => {
    const variables = {
        data: {
            title: "Test soiree2",
            body: "",
            published: true
        }
    }
    await expect(
        client.mutate({ mutation: createSoiree, variables })
    ).rejects.toThrow()
})

test('Should fetch published soiree by id', async () => {
    const variables = {
        id: soireeOne.soiree.id       
    }
    const { data } = await client.query({ query: getSoiree, variables })

    expect(data.soiree.id).toBe(soireeOne.soiree.id)       
}) 

test('Should fetch own soiree by id', async () => {
    const client = getClient(userOne.jwt)
    const variables = {
        id: soireeTwo.soiree.id       
    }
    const { data } = await client.query({ query: getSoiree, variables })

    expect(data.soiree.id).toBe(soireeTwo.soiree.id)       
})

test('Should not fetch draft soiree from other user', async () => {
    const client = getClient(userTwo.jwt)
    const variables = {
        id: soireeTwo.soiree.id       
    }
    await expect(
        client.query({ query: getSoiree, variables })
    ).rejects.toThrow()
})