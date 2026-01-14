import { Bell } from "lucide-react";
import { RecipientItem } from "./RecipientItem";
import CardWrapper from "../../../../../shared/components/wrappers/CardWrapper";

export function NotificationSection({
  title,
  description,
  recipients,
}) {
  return (
    <CardWrapper
      title={title}
      icon={Bell}
      description={description}
    >
      <div className="space-y-3">
        {recipients.map((recipient) => (
          <RecipientItem
            key={recipient.id}
            name={recipient.name}
            email={recipient.email}
            isDefault={recipient.isDefault}
          />
        ))}
      </div>
    </CardWrapper>
  );
}
