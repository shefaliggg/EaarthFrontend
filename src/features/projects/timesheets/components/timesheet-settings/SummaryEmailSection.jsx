import { RecipientItem } from "./RecipientItem";
import CardWrapper from "../../../../../shared/components/wrappers/CardWrapper";
import { cn } from "../../../../../shared/config/utils";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_KEYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
];

export function SummaryEmailSection({
    title,
    recipients,
}) {
    return (
        <CardWrapper
            title={title}
            icon={"CalendarMail"}
        >
            {recipients.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">None</p>
            ) : (
                <div className="space-y-4">
                    {recipients.map((recipient) => (
                        <RecipientItem
                            key={recipient.id}
                            name={recipient.name}
                            email={recipient.email}
                        >
                            <div className="flex items-center gap-2 ml-7">
                                {DAYS.map((day, index) => {
                                    const key = DAY_KEYS[index];
                                    const active = recipient.days[key];

                                    return (
                                        <button
                                            key={day}
                                            className={cn(
                                                "w-8 h-8 rounded-md text-xs font-bold transition-all",
                                                active
                                                    ? "bg-primary text-primary-foreground shadow"
                                                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                                            )}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </RecipientItem>
                    ))}
                </div>
            )}
        </CardWrapper>
    );
}
