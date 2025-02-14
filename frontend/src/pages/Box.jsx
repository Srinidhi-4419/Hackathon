export function Box({label,onClick}){
    return <div className="text-md text-center text-black font-normal hover:bg-slate-200 hover:rounded-md px-4 py-2"  onClick={onClick}  >
        {label}
    </div>
}