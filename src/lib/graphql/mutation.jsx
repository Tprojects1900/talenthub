import {gql} from "@apollo/client"

export const LOGIN =gql`
mutation Login($identifiant: String!, $password: String!) {
  login(identifiant: $identifiant, password: $password) {
    token
    user {
      id
      fullname
      email
      createdAt
      updatedAt
      username
    }
  }
}
`;

export const REMOVETEAM=gql`
mutation RemoveTeam($removeTeamId: ID!) {
  removeTeam(id: $removeTeamId) {
    message
    success
  }
}
`;

export const ADDTEAM =gql`
mutation RegisterTeam($input: RegisterTeamInput!, $file: Upload) {
  registerTeam(input: $input, file: $file) {
    id
    logo
    nom
    code
    quartier
    slogan
    members {
      createdAt
      id
      logo
      nom
      type
      updatedAt
    }
  }
}
`;

export const ADDPLAYER = gql`
mutation CreatePlayer($file: Upload, $input: CreatePlayerInput) {
  createPlayer(file: $file, input: $input) {
    id
    createdAt
    logo
    nom
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
    type
    updatedAt
  }
}

`;

export const UPDATETEAM =gql`
mutation UpdateTeamInfo($updateTeamInfoId: ID!, $input: UpdateTeamInput, $file: Upload) {
  updateTeamInfo(id: $updateTeamInfoId, input: $input, file: $file) {
    id
    code
    nom
    logo
    slogan
    quartier
    members {
      createdAt
      id
      logo
      nom
      type
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
}
`;

export const UPDATEPLAYER=gql`
mutation UpdatePlayerInfo($updatePlayerInfoId: ID!, $input: UpdatePlayerInput, $file: Upload) {
  updatePlayerInfo(id: $updatePlayerInfoId, input: $input, file: $file) {
    createdAt
    id
    logo
    nom
    type
    updatedAt
    team {
      code
      id
      logo
      nom
      quartier
      slogan
      members {
        createdAt
        id
        logo
        nom
        type
        updatedAt
      }
    }
  }
}
`;

export const REMOVEPLAYER =gql`
mutation RemovePlayer($removePlayerId: ID!) {
  removePlayer(id: $removePlayerId) {
    message
    success
  }
}
`;

export const ADDGROUP=gql`
mutation CreateGroup($input: CreateGroupInput) {
  createGroup(input: $input) {
    message
    success
    group {
      id
      name
      teamIds
      teams {
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
      updatedAt
    }
  }
}
`;



export const EDITGROUPTEAMS=gql`
mutation UpdateGroupTeams($input: UpdateGroupTeamsInput) {
  updateGroupTeams(input: $input) {
    message
    success
    group {
      id
      name
      teamIds
      teams {
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
      updatedAt
    }
  }
}
`;

export const REMOVEGROUP=gql`
mutation DeleteGroup($deleteGroupId: ID) {
  deleteGroup(id: $deleteGroupId) {
    message
    success
    group {
      id
      createdAt
      name
      teamIds
      updatedAt
    }
  }
}
`;

export const SCHEDULEMATCH=gql`
mutation SaveMatchSchedule($input: ScheduleMatchInput) {
  saveMatchSchedule(input: $input) {
    message
    success
    match {
      awayId
      createdAt
      date
      groupId
      groupName
      homeId
      id
      pitch
      status
      time
      typeConfrontation
      updatedAt
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
    }
  }
}

`;

export const REMOVESCHEDULE=gql`
mutation DeleteScheduledMatch($deleteScheduledMatchId: ID) {
  deleteScheduledMatch(id: $deleteScheduledMatchId) {
    message
    success
  }
}
`;

export const SAVEMATCHROSTER=gql`
mutation SaveMatchRoster($matchId: ID!, $teamId: ID!, $side: SideType, $actors: [RosterActorInput]) {
  saveMatchRoster(matchId: $matchId, teamId: $teamId, side: $side, actors: $actors) {
    id
    isSaved
    side
    matchId
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

export const REMOVEMATCHROSTER=gql`
mutation ClearMatchRoster($matchId: ID, $teamId: ID) {
  clearMatchRoster(matchId: $matchId, teamId: $teamId)
}
  
`;

export const DROPACTOR=gql`
mutation DeleteActorFromRoster($matchId: ID, $teamId: ID, $playerId: ID) {
  deleteActorFromRoster(matchId: $matchId, teamId: $teamId, playerId: $playerId) {
    actors {
      playerId
      nom
      dorsa
      matchStatus
      role
    }
    id
    isSaved
    matchId
    side
    teamId
  }
}
`;

export const CHANGEEVENTSTATUS=gql`
mutation ChangeActorMatchStatus($matchId: ID, $teamId: ID, $playerId: ID, $newStatus: String) {
  changeActorMatchStatus(matchId: $matchId, teamId: $teamId, playerId: $playerId, newStatus: $newStatus) {
    teamId
    side
    matchId
    isSaved
    id
    actors {
      playerId
      nom
      dorsa
      matchStatus
      role
    }
  }
}
`;

export const SWITCHMATCHMODE=gql`
mutation SwitchMatchMode($matchId: ID, $mode: String) {
  switchMatchMode(matchId: $matchId, mode: $mode) {
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
      }
    }
    date
    time
    pitch
    status
    createdAt
    updatedAt
  }
}
`;

export const STANDAREVENT=gql`
mutation CreateStandardEvent($matchId: ID, $time: String, $eventType: String, $teamSide: String, $player: PlayerEventInput) {
  createStandardEvent(matchId: $matchId, time: $time, eventType: $eventType, teamSide: $teamSide, player: $player) {
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
`;

export const ADDSUB=gql`
mutation CreateSubstitutionEvents($matchId: ID, $time: String, $teamSide: String, $playersOut: [PlayerEventInput], $playersIn: [PlayerEventInput]) {
  createSubstitutionEvents(matchId: $matchId, time: $time, teamSide: $teamSide, playersOut: $playersOut, playersIn: $playersIn) {
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
`;

export const DROPEVENT =gql`
mutation DeleteMatchEvent($eventId: ID) {
  deleteMatchEvent(eventId: $eventId)
}
`;

export const UPDATETIMERORPLAYER=gql`
mutation UpdateMatchEventTimeOrPlayer($eventId: ID, $newTime: String, $newPlayer: PlayerEventInput) {
  updateMatchEventTimeOrPlayer(eventId: $eventId, newTime: $newTime, newPlayer: $newPlayer) {
    eventType
    id
    isSubstitution
    matchId
    time
    teamSide
    playerOut {
      id
      name
      dorsa
    }
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
  }
}
`;