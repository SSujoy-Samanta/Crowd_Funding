"use client"
import { useState } from "react";
import { A } from "./A";
import B from "./B";
import { C } from "./C";
import { useSession } from "next-auth/react";
import { Loading2 } from "../Loading/Loading2";
import { D } from "./D";


export function CampaignForm() {
    const [step, setStep] = useState<number>(1);
    const [metadataId,setMetadataId]=useState<number|null>(null);

    const { data: session } = useSession();
    //@ts-ignore
    const userId = session?.user?.id ? parseInt(session.user.id) : null;

    // const handleNext = () => setStep((prev) => prev + 1);
    // const handleBack = () => setStep((prev) => prev - 1);

    if (!userId) return <div className="flex justify-center items-center w-full">
        <Loading2 />
    </div>;

    return (
        <div className="w-full pt-5 flex justify-center flex-col items-center">
            <div className="relative flex justify-center flex-col items-center rounded-md w-10/12 mt-24 p-1 mb-5">
                {step === 1 && (
                    <>
                        <A userId={userId} setStep={setStep} step={step} metadataId={metadataId} setMetadataId={setMetadataId}/>
                    </>
                )}

                {step === 2 && (
                    <>

                        <B userId={userId} metadataId={metadataId} step={step} setStep={setStep}/>
                        
                    </>
                )}

                {step === 3 && (
                    <div className="pt-10 w-full">
                        <C step={step} setStep={setStep} userId={userId} metadataId={metadataId}/>
                    </div>
                )}
                {
                    step === 4 &&(
                        <>
                            <D userId={userId} metadataId={metadataId} step={step} setStep={setStep}/>
                        </>
                    )
                }
            
            </div>
        </div>
    );
}
