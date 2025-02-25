export const StepStatus=({step}:{step:number})=>{
    return <div className="absolute z-20 flex gap-1 justify-center items-center bottom-2 w-full">
        <div className={`rounded-full  ${step==1?"bg-blue-700 p-2":"p-1 bg-slate-700"}`}></div>
        <div className={`rounded-full  ${step==2?"bg-blue-700 p-2":"p-1 bg-slate-700"}`}></div>
        <div className={`rounded-full  ${step==3?"bg-blue-700 p-2":"p-1 bg-slate-700"}`}></div>
        <div className={`rounded-full  ${step==4?"bg-blue-700 p-2":"p-1 bg-slate-700"}`}></div>
    </div>
}