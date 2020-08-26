import ApolloBoost,{ gql } from "apollo-boost";

const client = new ApolloBoost({
    uri: 'http://localhost:4000'
})

const getUsers = gql`
    query {
        users {
            id
            name
        }
    }
`

const getSoirees = gql`
    query {
        soirees {
            title            
            author {
                name
            }
        }
    }
`

client.query({
    query: getUsers
}).then((response) => {
    let html = ''

    response.data.users.forEach(user => {
        html += `
            <div>
                <h3>${user.name}</h3>
            </div>
        `
    });

    document.getElementById('users').innerHTML = html
})

client.query({
    query: getSoirees
}).then((response) => {
    let html = ''

    response.data.soirees.forEach(soiree => {
        html += `
            <div>
                <h3>${soiree.title}</h3>
                <h4>${soiree.author.name}</h4>
            </div>
        `
    });

    document.getElementById('soirees').innerHTML = html
})