import React, { useState, useEffect, useMemo } from "react";
import { useCurrentSchedule } from "../../hooks/useCalls";
import MatchTimerSettings from "../../components/settings/MatchTimerSettings";
import AdminLayout from "../../layouts/AdminLayout";
import Loader from "../../components/Loader";
import { useAddHalfTime } from "../../lib/graphql.service";
export default function MatchTimerSettingsPage() {
const [addHalf,{loading:adding}]=useAddHalfTime()
    
    const { currentSchedule, isLoadingCurrentSchedule, scheduleError } = useCurrentSchedule()
 
    const globalLoaded = isLoadingCurrentSchedule && !currentSchedule;
  
    return (
        <AdminLayout>

            {
                globalLoaded ?
                    (
                        <div className="min-h-screen bg-[#070708] text-zinc-100 p-6 md:p-10 font-sans flex flex-col items-center justify-center">
                            <Loader />

                        </div>


                    ) : !currentSchedule ? (

                        <div className="min-h-screen bg-[#070708] text-zinc-100 p-6 md:p-10 flex flex-col justify-center items-center">
                            <div className="bg-[#0c0c0e] border border-zinc-900 rounded-2xl p-8 text-center max-w-md">
                                <Timer className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                                <p className="text-sm font-bold text-zinc-400">Aucun match programmé à l'affiche</p>
                                <p className="text-xs text-zinc-600 mt-1">Tous les matchs sont en cours, terminés, ou aucun match n'est planifié pour le moment.</p>
                            </div>
                        </div>
                    ) : (
                        <MatchTimerSettings
                            currentSchedule={currentSchedule}
                            adding={adding}
                            onSaveEachHalf={addHalf}

                        />
                    )
            }





        </AdminLayout >
    )
}