// jestjs.io/docs/en/expect
// Should not signup a user with email that is already in use
// Should login and provide authentication token
// Should reject me query without authentication

import 'cross-fetch/polyfill'
import { gql } from 'apollo-boost'
import prisma from '../src/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { createUser, getUsers, login, getProfile } from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('Should create a new user', async () => {
    const variables = {
        data: {
            name: "Bruno",
            email: "bruno@gmail.com",
            password: "seb12345",
            isVJ: true,
            isOrga: true
        }
    }
    const response = await client.mutate({
        mutation: createUser,
        variables
    })

    const exists = await prisma.exists.User({ id: response.data.createUser.user.id })
    expect(exists).toBe(true)
})

test('Should expose public author profiles', async () => {
    const response = await client.query({ query: getUsers })

    expect(response.data.users.length).toBe(2)
    expect(response.data.users[0].email).toBe(null)
    expect(response.data.users[0].name).toBe('Jean')
})

test('Should not login with bad u/p', async () => {
    const variables = {
        data: {
            email: "hackerman@hck.hk",
            password: "IisBestHacker"
        }
    }

    await expect(
        client.mutate({ mutation: login, variables })
    ).rejects.toThrow()
})

test('Should not create a new user if password invalid', async () => {
    const variables = {
        data: {
            name: "Bruno2",
            email: "bruno2@gmail.com",
            password: "pass",
            isVJ: true,
            isOrga: true
        }
    }    

    await expect(
        client.mutate({ mutation: createUser, variables })
    ).rejects.toThrow()
})

test('Should fetch user profile', async () => {
    const client = getClient(userOne.jwt)    
    const { data } = await client.query({ query: getProfile })

    expect(data.me.id).toBe(userOne.user.id)
    expect(data.me.name).toBe(userOne.user.name)
    expect(data.me.email).toBe(userOne.user.email)
})

test('Should not signup a user with email that is already in use', async () => {
    const variables = {
        data: {
            name: "Bruno2",
            email: "Jean@gmail.com",
            password: "pass1234",
            isVJ: true,
            isOrga: true
        }
    }    

    await expect(
        client.mutate({ mutation: createUser, variables })
    ).rejects.toThrow()
})

test('Should login and provide authentication token', async () => {
    const variables = {
        data: {
            email: "Jean@gmail.com",
            password: "JeanBonn"
        }
    }
   
    const { data } = await client.mutate({ mutation: login, variables })
    expect(data.login.token).toBeDefined()
    console.log(data.login.token);
})

test('Should reject me query without authentication', async () => {    
    await expect(
        client.query({ query: getProfile })
    ).rejects.toThrow()
})