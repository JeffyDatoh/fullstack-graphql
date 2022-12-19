// If you want to use a import go to 'package.json' and add "type": "module",' before 'scripts'
//import { ApolloServer } from '@apollo/server';
//import { startStandaloneServer } from '@apollo/server/standalone';

const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

async function main() {
    // get the client
    const mysql = require('mysql2/promise');
    // create the connection
    const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'graphqltest'});

    const typeDefs = `#graphql
        type Attraction {
            id: Int
            name: String
            detail: String
            coverimage: String
            latitude: Float
            longitude: Float

        }

        type Query {
            attractions: [Attraction]
            attraction(id: Int!): Attraction
        }
    `;

    const resolvers = {
        Query: {
            attractions: async () => {
                // query database
                const [rows, fields] = await connection.execute('SELECT * FROM `attractions`');
                return rows
            },
            attraction: async (parent, {id}) => {
                const [rows, fields] = await connection.execute('SELECT * FROM `attractions` WHERE id=?', [id]);
                if (rows.length > 0) {
                    return rows[0]
                }else {
                    return []
                }
            }
        },
    };

    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });


    const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
}

main();