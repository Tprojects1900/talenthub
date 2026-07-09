import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'; 
import { createClient } from 'graphql-ws'; 
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import Cookies from 'js-cookie';

const isProd = typeof window !== "undefined" && window.location.hostname.includes("talent-hubapp.com");
const api_url = isProd ? "https://topfoot-api.vercel.app/graphql" : "http://localhost:4000/graphql";

// ⚠️ ATTENTION : api_wss_url pointe vers le MÊME domaine que api_url (topfoot-api.vercel.app).
// Un websocket "wss://" a besoin d'une connexion PERSISTANTE et de LONGUE DURÉE côté serveur.
// Or Vercel (en tout cas les fonctions serverless "classiques", hors offre spécifique
// Edge/Fluid compute avec support WS explicite) ne maintient PAS de connexion WebSocket
// ouverte : chaque invocation est stateless et a une durée de vie limitée (quelques secondes
// à ~ quelques dizaines de secondes selon le plan).
// => Il est très probable que "wss://topfoot-api.vercel.app/graphql" échoue systématiquement
//    en production, car Vercel n'expose probablement pas de endpoint WS fonctionnel à cette URL.
const api_wss_url = isProd ? "wss://topfoot-api.vercel.app/graphql" : "ws://localhost:4000/graphql";

const authLink = setContext((_, { headers }) => {
    const token = Cookies.get('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `${token}` : '',
        },
    };
});

// ⚠️ PROBLÈME PRINCIPAL SUSPECTÉ ICI :
// `createClient(...)` de "graphql-ws" initie la tentative de connexion WebSocket
// DÈS L'IMPORT DE CE MODULE — donc AVANT même que React commence à monter l'app.
// Ce n'est pas "paresseux" (lazy) par défaut avec cette config minimale : le client se connecte
// immédiatement au chargement de la page, pour TOUS les utilisateurs, même ceux qui n'ouvrent
// aucune souscription (subscription) GraphQL dans leur session.
//
// Si la connexion échoue (ex: Vercel qui ne supporte pas les WS à cette URL), "graphql-ws"
// retente automatiquement en boucle (backoff/retry par défaut), ce qui peut :
//   1. Bloquer/saturer le thread principal sur des appareils avec moins de ressources (iPad)
//   2. Empêcher le rendu React de s'exécuter correctement si une exception non catchée
//      remonte durant l'initialisation du module (crash silencieux → écran noir, rien ne
//      s'affiche car React ne monte jamais l'arbre de composants)
//   3. Se comporter différemment selon les navigateurs : Safari est historiquement plus strict
//      sur les websockets échoués / contenu mixte / gestion mémoire, d'où le fait que ça casse
//      sur Safari iPad et pas forcément ailleurs.
//
// PISTES DE CORRECTION À TESTER :
//   a) Vérifier concrètement si "wss://topfoot-api.vercel.app/graphql" répond (ex: test avec
//      wscat ou un client WS en ligne). Si Vercel ne supporte pas les WS natifs, il faut héberger
//      les subscriptions ailleurs (service dédié, Railway, Render, un petit serveur Node classique,
//      ou passer en SSE/polling si les WS persistants ne sont pas possibles sur l'infra actuelle).
//   b) Rendre la connexion WS "lazy" : ne créer le wsLink / ne lancer createClient() que lorsque
//      la query en cours est réellement une subscription (via un split "paresseux" ou en
//      différant l'instanciation de wsLink après le premier rendu, pas au chargement du module).
//   c) Entourer l'app d'un <ErrorBoundary> pour éviter l'écran noir total en cas d'exception
//      pendant l'init, et au moins afficher un message d'erreur exploitable.
const wsLink = new GraphQLWsLink(
  createClient({
    url: api_wss_url,
    connectionParams: () => ({
      authToken: Cookies.get('token') || '',
    }),
  })
);

const uploadLink = createUploadLink({
  uri: api_url,
});

// Le split() décide, PAR REQUÊTE, si on utilise le wsLink (subscriptions) ou le uploadLink
// (queries/mutations classiques en HTTP). Mais comme wsLink est déjà instancié plus haut
// (donc déjà en train d'essayer de se connecter), ce split ne protège pas contre le problème
// décrit ci-dessus : la tentative de connexion WS a déjà eu lieu, indépendamment du fait
// qu'une subscription soit utilisée ou non dans cette session.
const link = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,  
    authLink.concat(uploadLink)
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