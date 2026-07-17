import {gql} from "graphql-tag"

export const LIVEMATCHEVENTS= gql`
subscription GetLiveMatch {
  getLiveMatch {
    id
    typeConfrontation
    groupId
    groupName
    homeId
    awayId
    timer
    eachHalf
    currentHalf
    
    homeTeam {
      id
      nom
      slogan
      code
      quartier
      logo
       stat {
      id
      nom
      slogan
      code
      quartier
      logo
      mj
      g
      n
      p
      bp
      bc
      db
      pts
      topScorer {
        id
        nom
        dorsa
        goals
      }
      listOfScorers {
        id
        nom
        dorsa
        goals
      }
      yellowCards {
        player {
          id
          nom
          dorsa
          goals
        }
        time
        
        matchId
      }
      redCards {
        player {
          id
          nom
          dorsa
          goals
        }
        time
        
        matchId
      }
    }
      members {
        id
        nom
        type
        logo
        team {
          id
          nom
          slogan
          code
          quartier
          logo
        }
        createdAt
        updatedAt
      }
    }
    awayTeam {
      id
      nom
      slogan
      code
      quartier
      logo
       stat {
      id
      nom
      slogan
      code
      quartier
      logo
      mj
      g
      n
      p
      bp
      bc
      db
      pts
      topScorer {
        id
        nom
        dorsa
        goals
      }
      listOfScorers {
        id
        nom
        dorsa
        goals
      }
      yellowCards {
        player {
          id
          nom
          dorsa
          goals
        }
        time
        
        matchId
      }
      redCards {
        player {
          id
          nom
          dorsa
          goals
        }
        time
        
        matchId
      }
    }
      members {
        id
        nom
        type
        logo
        team {
          id
          nom
          slogan
          code
          quartier
          logo
          members {
            id
            nom
            type
            logo
            createdAt
            updatedAt
          }
        }
        createdAt
        updatedAt
      }
    }
    date
    time
    
    pitch
    status
    createdAt
    updatedAt
    events {
      id
      matchId
      time
      
      eventType
      teamSide
      player {
        id
        name
        dorsa
      }
      isSubstitution
      playerIn {
        id
        name
        dorsa
      }
      playerOut {
        id
        name
        dorsa
      }
    }
  }
}
`;


export const SCHEDULESMATCHLive=gql`
query GetScheduledMatchesLive {
  getScheduledMatchesLive {
    id
    timer
    currentHalf
    eachHalf
    typeConfrontation
    groupId
    groupName
    homeId
    awayId
    homeTeam {
      id
      nom
      slogan
      code
      quartier
      logo
      members {
        id
        nom
        type
        logo
        team {
          id
          nom
          slogan
          code
          quartier
          logo
        }
        createdAt
        updatedAt
      }
    }
    awayTeam {
      id
      nom
      slogan
      code
      quartier
      logo
      members {
        id
        nom
        type
        logo
        createdAt
        updatedAt
        team {
          id
          nom
          slogan
          code
          quartier
          logo
        }
      }
    }
    date
    time
    
    pitch
    status
    createdAt
    updatedAt
    events {
      id
      eventType
      isSubstitution
      matchId
      player {
        id
        name
        dorsa
      }
      playerIn {
        id
        name
        dorsa
      }
      playerOut {
        id
        name
        dorsa
      }
      teamSide
      time
      
    }
  }
}
`;