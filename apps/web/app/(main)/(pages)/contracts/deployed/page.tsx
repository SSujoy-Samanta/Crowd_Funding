import { GetDeployedContracts } from "@/components/GetDepolyedContracts";

export default async function ContractsDeployed() {
    return <div className="min-h-screen w-full ">
        <GetDeployedContracts/>
    </div>
}