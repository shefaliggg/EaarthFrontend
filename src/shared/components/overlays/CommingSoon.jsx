import { convertToPrettyText } from "../../config/utils"

function CommingSoon({feature = "feature"}) {
    return (
        <div className={`absolute top-0 left-0 z-5 w-full rounded-2xl overflow-hidden h-full flex flex-col justify-center items-center bg-background/50`}>
        <h1 className="text-xl text-muted-foreground font-bold mb-4 muted">{convertToPrettyText(feature)} Coming Soon!</h1>
        </div>
    )
}

export default CommingSoon