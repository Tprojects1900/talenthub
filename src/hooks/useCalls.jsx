import { useGetTeams,useGetGroups,useGetSchedules ,useEachMatchRosters, useScheduleLive,useTeamStats,useGetMatchById,useGetToggleSettings, useToggleSettings} from "../lib/graphql.service";
export const useTeams = () => {
  const { data, loading, error, refetch } = useGetTeams();

  // Extraction et sécurisation des données pour éviter les "undefined" au premier rendu
  const teams = data?.getAllTeams || [];

  return {
    teams,
    refetchTeams: refetch, // Renommage à la volée de refetch en refetchTeams
    loading,               // Optionnel : pratique si vous voulez afficher un spinner au front
    error                  // Optionnel : pratique pour gérer les erreurs d'API
  };
};


export const useGroups = () => {
  const { data:api_groups, loading:grouping, error:group_error, refetch:group_refetch } = useGetGroups();

  // Extraction et sécurisation des données pour éviter les "undefined" au premier rendu
  const groups = api_groups?.getGroups || [];

  return {
    groups,
    refetchGroups: group_refetch, // Renommage à la volée de refetch en refetchTeams
    group_loaded:grouping,               // Optionnel : pratique si vous voulez afficher un spinner au front
    group_error                  // Optionnel : pratique pour gérer les erreurs d'API
  };
};

export const useSchedules = () => {
  const { data:api_sche, loading:scing, error:sch_error, refetch:sch_refetch } = useGetSchedules();

  // Extraction et sécurisation des données pour éviter les "undefined" au premier rendu
  const schedules = api_sche?.getScheduledMatches || [];

  return {
    schedules,
    refetchSchedules: sch_refetch, // Renommage à la volée de refetch en refetchTeams
    loaded_schedule:scing,               // Optionnel : pratique si vous voulez afficher un spinner au front
    sch_error                  // Optionnel : pratique pour gérer les erreurs d'API
  };
};

export const useMatchRosters = (matchId) => {
  const {
    data,
    loading: roster_loaded,
    refetch: refetchRosters
  } = useEachMatchRosters(matchId);

  const rosters = data?.getMatchRosters || [];

  return {
    rosters,
    roster_loaded,
    refetchRosters
  };
};

export const useCurrentSchedule = () => {
  // 1. Déstructuration et renommage clair pour éviter les conflits
  const { 
    data, 
    loading: isLoadingCurrentSchedule, 
    error: scheduleError, 
    refetch: refetchCurrentSchedule 
  } = useScheduleLive();

  // 2. Extraction sécurisée du dernier match (aligné sur ta Query 'getLastMatch')
  const currentSchedule = data?.getLastLiveMatch || {};

  // 3. Retour d'un objet propre avec des clés sémantiques pour ton Front
  return {
    currentSchedule,
    refetchCurrentSchedule,
    isLoadingCurrentSchedule, // Nom plus standard que scing / loaded_...
    scheduleError
  };
};

export const useTeamStat = (teamId) => {
  const {
    data,
    loading: t_loaded,
    refetch: reftechTeamStat
  } = useTeamStats(teamId);

  const teamStats = data?.getTeamStat || [];

  return {
    teamStats,
    t_loaded,
    reftechTeamStat
  };
};

export const useSingleMatch = (matchId) => {
  const {
    data,
    loading: match_loaded,
    refetch: refetchMatch
  } = useGetMatchById(matchId);

  const match = data?.getMatchById || [];

  return {
    match,
    match_loaded,
    refetchMatch
  };
};

export const useGetToggle=()=>{
  const {data,loading:load_settings,refetch:refetchSettings} = useGetToggleSettings();

  const settings =data?.getTopSettings || {};

  return { settings,load_settings,refetchSettings }
}