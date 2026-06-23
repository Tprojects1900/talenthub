import fs from 'fs';
import path from 'path';
import { SitemapStream, streamToPromise } from 'sitemap';

// URL de votre application cliente
const BASE_URL = 'https://talent-hubapp.com'; 
// URL de votre API GraphQL unique
const GRAPHQL_ENDPOINT = 'https://topfoot-api.vercel.app/graphql'; 

// Requête GraphQL convertie en chaîne brute pour être parfaitement compatible Node.js au build
const TEAMS_QUERY = `
query GetAllTeams {
  getAllTeams {
    id
    nom
    members {
      id
      nom
    }
  }
}
`;

async function generateSitemap() {
  try {
    const smStream = new SitemapStream({ hostname: BASE_URL });

    // 1. Routes Statiques fondamentales du Tournoi
    smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
    smStream.write({ url: '/dashboard', changefreq: 'daily', priority: 0.8 });

    console.log('📡 Récupération des données depuis l\'API GraphQL...');

    // 2. Appel POST sur l'unique route GraphQL
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer VOTRE_TOKEN_ICI' // À décommenter si besoin
      },
      body: JSON.stringify({ query: TEAMS_QUERY }),
    });

    const json = await response.json();
    
    // Aligné sur le nom exact de votre query GraphQL : getAllTeams
    const teams = json?.data?.getAllTeams || [];

    if (teams.length === 0) {
      console.warn('⚠️ Attention: Aucune équipe n\'a été retournée par l\'API GraphQL. Vérifiez l\'URL de votre endpoint.');
    }

    // 3. Boucle sur les données pour injecter les routes dans le Sitemap
    teams.forEach(team => {
      const teamId = team.id || team._id;
      
      if (teamId) {
        // Route pour le détail de l'équipe
        smStream.write({
          url: `/#/matches/${teamId}/details`, 
          changefreq: 'weekly',
          priority: 0.7
        });
      }

      // Traitement des joueurs de la structure (members)
      if (team.members && Array.isArray(team.members)) {
        team.members.forEach(player => {
          const playerId = player.id || player._id;
          if (playerId) {
            // Route pour le détail du joueur
            smStream.write({
              url: `/#/players/${playerId}/details`,
              changefreq: 'weekly',
              priority: 0.6
            });
          }
        });
      }
    });

    smStream.end();

    // Génération et écriture du fichier physique dans /public
    const sitemapOutput = await streamToPromise(smStream);
    const outputPath = path.resolve('./public/sitemap.xml');
    
    fs.writeFileSync(outputPath, sitemapOutput);
    console.log(` sitemap.xml généré avec succès dans /public (${teams.length} équipes indexées) !`);
  } catch (error) {
    console.error('❌ Erreur lors de la génération du sitemap:', error);
  }
}

generateSitemap();