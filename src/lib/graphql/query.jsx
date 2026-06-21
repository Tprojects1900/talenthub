import { gql } from '@apollo/client';
export const GETAUTH=gql`
query GetAuth {
  getAuth {
    token
    user {
      email
      createdAt
      fullname
      id
      updatedAt
      username
    }
  }
}

`;

export const TEAMS=gql`
query GetAllTeams {
  getAllTeams {
    id
    logo
    nom
    quartier
    slogan
    code
    members {
      nom
      logo
      id
      createdAt
      type
      updatedAt
      team {
        id
        logo
        nom
        quartier
        slogan
        code
      }
    }
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
  }
}
`;

export const GROUPS=gql`
query GetGroups {
  getGroups {
    id
    createdAt
    name
    updatedAt
    teams {
      code
      id
      logo
      quartier
      nom
      slogan
      members {
        nom
        createdAt
        id
        logo
        type
        updatedAt
        team {
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
        }
      }
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
    }
    teamIds
  }
}
`;

export const SCHEDULESMATCH=gql`
query GetScheduledMatches {
  getScheduledMatches {
    id
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

export const EACHMATCHROSTER=gql`
query GetMatchRosters($matchId: ID) {
  getMatchRosters(matchId: $matchId) {
    id
    isSaved
    matchId
    side
    teamId
    actors {
      dorsa
      matchStatus
      nom
      playerId
      role
    }
  }
}

`;

export const SCHEDULELIVE=gql`
query GetLastLiveMatch {
  getLastLiveMatch {
    id
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

export const TEAMSTATS=gql`
query GetTeamStat($teamId: ID!) {
  getTeamStat(teamId: $teamId) {
    bc
    bp
    code
    db
    g
    id
    listOfScorers {
      id
      nom
      dorsa
      goals
    }
    logo
    mj
    n
    nom
    p
    pts
    quartier
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
    slogan
    topScorer {
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
  }
}
`;

export const GETMATCHBYID=gql`
query GetMatchById($getMatchByIdId: ID) {
  getMatchById(id: $getMatchByIdId) {
    awayId
    date
    id
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
    createdAt
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
    groupId
    groupName
    homeId
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
    pitch
    status
    time
    typeConfrontation
    updatedAt
  }
}
`;