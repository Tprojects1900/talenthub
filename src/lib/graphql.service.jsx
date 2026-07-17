import { useLazyQuery, useQuery, useSubscription, useMutation } from "@apollo/client";

import { GETAUTH ,TEAMS,GROUPS, SCHEDULESMATCH, EACHMATCHROSTER, SCHEDULELIVE, TEAMSTATS, GETMATCHBYID, GETTOGGLEDISABLE,TEAMDETAILS,CAISSEDASHBOARD} from "./graphql/query";
import { ADDGROUP,ADDHALFTIME, ADDPLAYER, ADDSUB, ADDTEAM, ADDLABEL,UPDATELABEL, CHANGEEVENTSTATUS, DROPACTOR, DROPEVENT, EDITGROUPTEAMS, LOGIN,REMOVEGROUP,REMOVEMATCHROSTER,REMOVEPLAYER,REMOVESCHEDULE,REMOVETEAM, SAVEMATCHROSTER, SCHEDULEMATCH, STANDAREVENT, SWITCHMATCHMODE, TOGGLEDISABLE, UPDATEPLAYER, UPDATETEAM, UPDATETIMERORPLAYER } from "./graphql/mutation";

import { LIVEMATCHEVENTS } from "./graphql/subscription";

//SUBSCRIPTIONS EVENTS MATCH

export const useGetLiveAlert=(matchId)=>{
  return useSubscription(LIVEMATCHEVENTS)
}

//LAZY QUERIES
export const useGetAuth = () => {
    return useLazyQuery(GETAUTH, {
    fetchPolicy: "network-only", // ignore le cache
  });
}

//QUERIES

export const useGetTeams=()=>{
   return useQuery(TEAMS,{
     fetchPolicy: "network-only",
   });
}

export const useGetGroups=()=>{
  return useQuery(GROUPS);
}

export const useGetSchedules = () => {
  return useQuery(SCHEDULESMATCH, {
    fetchPolicy: "network-only",
  });
};

export const useEachMatchRosters = (matchId) => {
  return useQuery(EACHMATCHROSTER, {
    variables: { matchId },
     fetchPolicy: "network-only",
    skip: !matchId,
  });
};
//commentaire sur
// // , {
//     pollInterval: 3000, // ou 5000
//     notifyOnNetworkStatusChange: true,
//     fetchPolicy: "network-only",
//   }
export const useScheduleLive = () => {
  return useQuery(SCHEDULELIVE);
};

export const useTeamStats=(teamId)=>{
//  return useQuery(TEAMSTATS);
    return useQuery(TEAMSTATS, {
    variables: { teamId },
    skip: !teamId,
  });
}

export const useGetMatchById=(matchId)=>{
//  return useQuery(TEAMSTATS);
    return useQuery(GETMATCHBYID, {
    variables: { getMatchByIdId:matchId },
    skip: !matchId,
  });
}

export const useGetTeamsDetails=(teamId)=>{
//  return useQuery(TEAMSTATS);
    return useQuery(TEAMDETAILS, {
    variables: { getTeamDetailsId:teamId },
    skip: !teamId,
  });
}


export const useGetToggleSettings=()=>{
  return useQuery(GETTOGGLEDISABLE)
}


export const useGetCaisseDashboard=()=>{
  return useQuery(CAISSEDASHBOARD)
}



//MUATIONS

export const useAddLabelToTeam=()=>{
  return useMutation(ADDLABEL)
}

export const useEditLabelToTeam=()=>{
  return useMutation(UPDATELABEL)
}

export const useToggleSettings=()=>{
  return useMutation(TOGGLEDISABLE)
}

export const useLogin = ()=>{
  return useMutation(LOGIN)
}

export const useRemoveTeam = ()=>{
  return useMutation(REMOVETEAM)
}

export const useAddTeam = ()=>{
  return useMutation(ADDTEAM)
}
export const useAddPlayer = ()=>{
  return useMutation(ADDPLAYER)
}
export const useEditTeam = ()=>{
  return useMutation(UPDATETEAM)
}
export const useEditPlayer = ()=>{
  return useMutation(UPDATEPLAYER)
}
export const useRemovePlayer = ()=>{
  return useMutation(REMOVEPLAYER)
}

export const useAddGroup = ()=>{
  return useMutation(ADDGROUP)
}

export const useAddHalfTime = ()=>{
  return useMutation(ADDHALFTIME)
}

export const useRemoveGroup=()=>{
  return useMutation(REMOVEGROUP)
}

export const useEditGroupTeams=()=>{
  return useMutation(EDITGROUPTEAMS)
}

export const useSaveSchedule=()=>{
  return useMutation(SCHEDULEMATCH)
}


export const useRemoveSchedule=()=>{
  return useMutation(REMOVESCHEDULE);
}

export const useAddMatchRoster=()=>{
  return useMutation(SAVEMATCHROSTER);
}

export const useRemoveMatchRoster=()=>{
  return useMutation(REMOVEMATCHROSTER);
}



export const useDropActor=()=>{
  return useMutation(DROPACTOR);
}

export const usechangeEventStatus=()=>{
  return useMutation(CHANGEEVENTSTATUS);
}

export const useSwitchMatchMode=()=>{
  return useMutation(SWITCHMATCHMODE);
}

export const useCreateStandarEvent=()=>{
  return useMutation(STANDAREVENT);
}

export const useCreateSub=()=>{
  return useMutation(ADDSUB);
}

export const useDropEvent=()=>{
  return useMutation(DROPEVENT);
}

export const useEditTimerOrPlayer=()=>{
  return useMutation(UPDATETIMERORPLAYER);
}
