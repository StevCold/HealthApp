import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases} from "@/lib/appwrite.config";

export const createAppointment = async () => {
    try {
        // aici trebuie ceva const newPatient din patient.action.ts -> 2:55:14
    }catch (error){
        console.log(error);
    }
}

export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId
        )
        
        return parseStringify(appointment);
    }catch (error){
        console.log(error);
    }
}