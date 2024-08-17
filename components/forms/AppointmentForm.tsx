"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Form} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import {useState} from "react"
import {UserFormValidation} from "@/lib/validation"
import {useRouter} from "next/navigation"
import {createUser} from "@/lib/actions/patient.actions";
import {FormFieldType} from "@/components/forms/PatientForm";
import {create} from "node:domain";

const AppointmentForm = ({
    userId, patientId, type
    }:{
    userId: string;
    patientId: string;
    type: "create" | "cancel" | "schedule";
    
    }) => {
    const router = useRouter();
    const[isLoading, setIsLoading] = useState(false);
    
    const AppointmentFromValidation = getAppointmentSchema(type);
    
    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: "",
            schedule: new Date(),
            reason: "",
            note: "",
            cancellationReason: ""
        },
    })

    async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
        setIsLoading(true);
        
        let status;
        switch (type){
            case "schedule":
                status = "scheduled";
                break;
            case "cancel":
                status = "cancelled";
                break;
            default:
                status = "pending";
                break;
        }
        
        try{
            if (type === 'create' && patientId) {
                const appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    schedule: new Date(values.schedule),
                    reason: values.reason!,
                    note: values.note,
                    status: status as Status
                }
                
                // const appointment = await createAppointment(appointmentData)
                
                if (appointment){
                    form.reset();
                    router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    let buttonLabel;
    
    switch (type) {
        case 'cancel':
            buttonLabel='Cancel Appointment'
            break;
        case 'create':
            buttonLabel='Create Appointment'
            break;
        case 'schedule':
            buttonLabel='Schedule Appointment'
            break;
        default:
            break;
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-4">
                    <h1>
                        New Appointment
                    </h1>
                    <p className="text-dark-700">Request your next appointment in 10 seconds</p>
                </section>

                {type !== "cancel" && (
                    <>
                        <CustomFormField 
                            control={form.control} 
                            fieldType={FormFieldType.SELECT} 
                            name={"primaryPhysician"}
                            label={"Doctor"}
                            placeholder={"Select a doctor"}
                        >
                            
                            fieldType={FormFieldType.SELECT}
                            {/*de pus de la RegisterForm.tsx -> 2:46:32*/}
                            
                        </CustomFormField>
                        <CustomFormField 
                            control={form.control} 
                            fieldType={FormFieldType.DATE_PICKER} 
                            name={"schedule"}
                            label={"Expected appointment date"}
                            showTimeSelect
                            dateFormat={"dd/MM/yyyy - h:mm aa"}/>
                            
                        <div className="flex flex-col gap-6 xl:flex-row">
                            <CustomFormField 
                                control={form.control} 
                                fieldType={FormFieldType.TEXTAREA} 
                                name={"reason"}
                                label={"Reason for appointment"}
                                placeholder={"Enter reason for appointment"}
                            />
                            <CustomFormField
                                control={form.control}
                                fieldType={FormFieldType.TEXTAREA}
                                name={"note"}
                                label={"Notes"}
                                placeholder={"Enter notes"}
                            />
                        </div>
                        
                    </>
                )}

                {type === "cancel" &&(
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.TEXTAREA}
                        name={"cancellationReason"}
                        label={"Reason for cancellation"}
                        placeholder={"Enter reason for cancellation"}
                    />
                )}
                
                <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shad-danger-btn' : 'shadow-primary-btn'} w-full`}>{buttonLabel}</SubmitButton>
            </form>
        </Form>
    )
}

export default AppointmentForm