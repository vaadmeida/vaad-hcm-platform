import { useQuery } from "@tanstack/react-query"
import { getCountries } from "../api/location.api"


export const useGetCountries = ()=>{
     return useQuery({
        queryKey : ["countries"],
        queryFn: getCountries
     })
}