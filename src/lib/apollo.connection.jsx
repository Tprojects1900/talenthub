import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'; 
import { createClient } from 'graphql-ws'; 
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'; // 🚀 IMPORTATION DU LIEN OFFICIEL COMPATIBLE VITE
import Cookies from 'js-cookie';

const isProd = typeof window !== "undefined" && window.location.hostname.includes("talent-hubapp.com");
const api_url = isProd ? "https://topfoot-api.vercel.app/graphql" : "http://localhost:4000/graphql";
const api_wss_url = isProd ? "wss://topfoot-api.vercel.app/graphql" : "ws://localhost:4000/graphql";

// Le lien d'authentification reste identique
const authLink = setContext((_, { headers }) => {
    const token = Cookies.get('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `${token}` : '',
        },
    };
});

// Le lien WebSocket reste identique
const wsLink = new GraphQLWsLink(
  createClient({
    url: api_wss_url,
    connectionParams: () => ({
      authToken: Cookies.get('token') || '',
    }),
  })
);

// 🚀 REFACTION ICI : On remplace toute la fonction fetch maison par createUploadLink.
// Ce lien intercepte les fichiers *avant* qu'Apollo ne les transforme en chaîne JSON (et donc en {}).
const uploadLink = createUploadLink({
  uri: api_url,
});

// Séparation des flux (identique)
const link = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,  
    authLink.concat(uploadLink) // authLink va ajouter le token aux requêtes HTTP/Upload
);

export const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Offre: {
        keyFields: ["id"], 
        fields: {
          recommendationScore: {
            merge(existing, incoming) {
              return incoming ?? existing ?? 0;
            },
          },
        },
      },
    },
  }),
  link,
});