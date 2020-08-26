import { gql } from 'apollo-boost'

const createUser = gql `
    mutation($data: CreateUserInput!) {
        createUser(
            data: $data
        ) {
            token,
            user {
                id
                name
                email
            }
        }
    }
`
const getUsers = gql`
    query {
        users {
            id
            name
            email
        }
    }
`

const login = gql`
    mutation($data: LoginUserInput!) {
        login(
            data: $data
        ){
            token
        }
    }
`

const getProfile = gql`
    query {
        me {
            id
            name
            email
        }
    }
`

const getSoirees = gql`
    query {
        soirees {
            id
            title
            body
            published
        }
    }
`

const getSoiree = gql`
    query($id: ID!) {
        soiree(id: $id) {
            id
            title
            body
            published
            comments {
                text
            }
        }
    }
`

const mySoirees = gql`
    query {
        mySoirees {
            id
            title
            body
            published
        }
    }
`

const updateSoiree = gql`
    mutation($id: ID!, $data: UpdateSoireeInput!) {
        updateSoiree(
            id: $id,
            data: $data
        ){
            id
            title
            body
            published
        }
    }
`

const createSoiree = gql`
    mutation($data: CreateSoireeInput!) {
        createSoiree(
            data: $data
        ){
            id
            title
            body
            published
        }
    }
`

const deleteSoiree = gql`
    mutation($id: ID!) {
        deleteSoiree(
            id: $id
        ){
            id
            title
        }
    }
`

const createComment = gql`
    mutation($data: CreateCommentInput!) {
        createComment(
            data: $data
        ){
            id
            text
            author {
                name
            }
            soiree {
                title
            }
        }
    }
`

const updateComment = gql`
    mutation($id: ID!, $data: UpdateCommentInput!) {
        updateComment(
            id: $id,
            data: $data
        ){
            id
            text
            author {
                name
            }
            soiree {
                title
            }
        }
    }
`

const deleteComment = gql`
    mutation($id: ID!) {
        deleteComment(
            id: $id
        ){
            id
            text
        }
    }
`

const subscribeToComments = gql`
    subscription($soireeId: ID!) {
        comment(soireeId: $soireeId) {
            mutation
            node {
                id
                text
            }
        }
    }
`

const subscribeToSoirees = gql`
    subscription {
        soiree {
            mutation
        }
    }
`

export { createUser, getUsers, login, getProfile, getSoirees, getSoiree, mySoirees, updateSoiree, createSoiree, deleteSoiree, createComment, updateComment, deleteComment, subscribeToComments, subscribeToSoirees }