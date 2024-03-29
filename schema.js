//https://docs.spacexdata.com/?version=latest
const axios = require('axios')

const {
    GraphQLObjectType, 
    GraphQLInt, 
    GraphQLString, 
    GraphQLBoolean,
    GraphQLList,
    GraphQLSchema
} = require('graphql')


const LauchType = new GraphQLObjectType({
    name: 'Lauch',
    fields: () => ({
        flight_number: { type: GraphQLInt },
        mission_name: { type: GraphQLString },
        launch_year: { type: GraphQLString },
        launch_date_local: { type: GraphQLString },
        launch_success: { type: GraphQLBoolean },
        rocket: { type: RocketType },
    })
});


const RocketType = new GraphQLObjectType({
    name: 'Rocket',
    fields: () => ({
        rocket_id: { type: GraphQLString },
        rocket_name: { type: GraphQLString },
        rocket_type: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        lauchers: {
            type: new GraphQLList(LauchType),
            resolve(parent, args) {
                return axios.get('https://api.spacexdata.com/v3/launches')
                .then(res => res.data)
            }
        },
        launch: {
            type: LauchType,
            args:{
                flight_number: { type: GraphQLInt}
            },
            resolve(parent, args) {
                return axios.get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`)
                .then(res => res.data);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
});