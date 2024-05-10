import { IndexableDocument } from "@backstage/plugin-search-common";

export interface IndianCitiesDocument extends IndexableDocument{
    city_name?:string,
    lat: number,
    long: number,
    population?:number
}