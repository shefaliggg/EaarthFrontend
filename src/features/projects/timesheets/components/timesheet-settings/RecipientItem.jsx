import { Mail, Edit2, Trash2 } from "lucide-react";

export function RecipientItem({
    name,
    email,
    isDefault = false,
    actions,
    children,
}) {
    return (
        <div className="p-4 rounded-xl border bg-muted/30 space-y-3">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Mail className="size-4 text-muted-foreground mt-1" />
                    <div>
                        <p className="text-sm font-medium">{name}</p>
                        <p className="text-xs text-muted-foreground">{email}</p>
                    </div>
                </div>

                {!isDefault && (
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded hover:bg-primary/10">
                            <Edit2 className="size-3.5 text-primary" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-destructive/10">
                            <Trash2 className="size-3.5 text-destructive" />
                        </button>
                    </div>
                )}
            </div>

            {children}
        </div>
    );
}
