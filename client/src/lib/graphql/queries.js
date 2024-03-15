import { ApolloClient, ApolloLink, concat, createHttpLink, gql, InMemoryCache } from "@apollo/client";
// import { GraphQLClient } from "graphql-request";
import { getAccessToken } from "../auth";

// AplloClient
const httpLink = createHttpLink({ uri: "http://localhost:9000/graphql" });

const authLink = new ApolloLink((operation, forward) => {
    const accessToken = getAccessToken();
    if (accessToken) {
        operation.setContext({
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    }
    return forward(operation);
});

// GraphQlClient
// const client = new GraphQLClient("http://localhost:9000/graphql", {
//     headers: () => {
//         const accessToken = getAccessToken();
//         if (accessToken) {
//             return { Authorization: `Bearer ${accessToken}` };
//         }
//         return {};
//     },
// });

// AplloClient - caching data
export const apolloClient = new ApolloClient({
    link: concat(authLink, httpLink),
    cache: new InMemoryCache(),
});

const jobDetailFragment = gql`
    fragment JobDetail on Job {
        id
        date
        title
        company {
            id
            name
        }
        description
    }
`;

export const jobByIdQuery = gql`
    query JobById($id: ID!) {
        job(id: $id) {
            ...JobDetail
        }
    }
    ${jobDetailFragment}
`;

export const createJobMutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
        job: createJob(input: $input) {
            ...JobDetail
        }
    }
    ${jobDetailFragment}
`;

// GraphQl - function was used in CreateJobPage
// export async function createJob({ title, description }) {
//     const mutation = gql`
//         mutation CreateJob($input: CreateJobInput!) {
//             job: createJob(input: $input) {
//                 ...JobDetail
//             }
//         }
//         ${jobDetailFragment}
//     `;
//     // GraphQlClient
//     // const { job } = await client.request(mutation, {
//     //     input: { title, description },
//     // });
//     // return job;

//     // ApolloClient
//     const { data } = await apolloClient.mutate({
//         mutation,
//         variables: { input: { title, description } },
//         update: (cache, { data }) => {
//             cache.writeQuery({
//                 query: jobByIdQuery,
//                 variables: { id: data.job.id },
//                 data,
//             });
//         },
//     });
//     return data.job;
// }

// use in CompanyPage with React useQuery
export const companyByIdQuery = gql`
    query CompanyById($id: ID!) {
        company(id: $id) {
            id
            name
            description
            jobs {
                id
                date
                title
            }
        }
    }
`;
// use in CompanyPage with React state
// GraphQl - function was used in CompanyPage with commentent code with state
// export async function getCompany(id) {
//     const query = gql`
//         query CompanyById($id: ID!) {
//             company(id: $id) {
//                 id
//                 name
//                 description
//                 jobs {
//                     id
//                     date
//                     title
//                 }
//             }
//         }
//     `;
//     // AplloClient
//     const { data } = await apolloClient.query({
//         query,
//         variables: { id },
//     });
//     return data.company;

//     // GraphQlClient
//     // destructuring
//     // const { company } = await client.request(query, { id });
//     // return company;
//     // not destructuring
//     // const data = await client.request(query, { id });
//     // return data.company;
// }

// use in JobPage and HomePage with React useQuery
export const jobsQuery = gql`
    query Jobs {
        jobs {
            id
            date
            title
            company {
                id
                name
            }
        }
    }
`;

// use in JobPage with React state
// GraphQl - function was used in CompanyPage with commentent code with state
// export async function getJob(id) {
//     // AplloClient
//     const { data } = await apolloClient.query({
//         query: jobByIdQuery,
//         variables: { id },
//     });
//     return data.job;

//     // GraphQlClient
//     // destructuring
//     // const { job } = await client.request(query, { id });
//     // return job;
//     // not destructuring
//     // const data = await client.request(query, { id });
//     // return data.job;
// }

// export async function getJobs() {
//     const query = gql`
//         query {
//             jobs {
//                 id
//                 date
//                 title
//                 company {
//                     id
//                     name
//                 }
//             }
//         }
//     `;

//     // AplloClient
//     // destructuring
//     const { data } = await apolloClient.query({
//         query,
//         fetchPolicy: "network-only",
//     });
//     return data.jobs;
//     // not destructuring
//     // const result = await apolloClient.query({ query });
//     // return result.data.jobs;

//     // GraphQlClient
//     // destructuring
//     // const { jobs } = await client.request(query);
//     // return jobs;
//     // not destructuring
//     // const data = await client.request(query);
//     // return data.job;
// }
