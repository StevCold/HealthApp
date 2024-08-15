import { ID, Query } from "node-appwrite";
import { PATIENT_COLLECTION_ID, DATABASE_ID, databases, users } from "../appwrite.config"
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams)=> {
    try {
        const newUser = await users.create(
            ID.unique(), 
            user.email, 
            user.phone, 
            undefined, 
            user.name
        )
    }catch(error: any) {
        if (error && error?.code === 409){
            const documents = await users.list([
                Query.equal('email', [user.email])
            ])
            
            return documents?.users[0]
        }
    }
}

export const getPatient = async (userId: string) => {
    try {
        const patients = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [Query.equal('userId', userId)]
        );
        return parseStringify(patients.documents[0]);
    } catch (error) {
        console.log(error)
    }
}

