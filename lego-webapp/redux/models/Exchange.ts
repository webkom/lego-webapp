import { EntityId } from "@reduxjs/toolkit";
import { PublicUser } from "./User";

export interface Exchange {
    id: EntityId;
    student: PublicUser;
    university: {
        name: string,
        country: string
    };
    year: number;
    semester: string;
}