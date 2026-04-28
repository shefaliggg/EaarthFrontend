import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardWrapper from "../../../../shared/components/wrappers/CardWrapper";
import EditToggleButtons from "../../../../shared/components/buttons/EditToggleButtons";
import EditableTextDataField from "../../../../shared/components/wrappers/EditableTextDataField";
import ProfileCardLoadingSkelton from "../skeltons/ProfileCardLoadingSkelton";
import ProfileCardErrorSkelton from "../skeltons/ProfileCardErrorSkelton";
import {
  fetchProfileThunk,
  updateHealthDetailsThunk,
} from "../../store/crew/crewProfile.thunk";
import { healthDetailsSchema } from "../../config/profileValidationShemas";
import { toast } from "sonner";
import {
  arrayToText,
  convertToPrettyText,
  textToArray,
} from "../../../../shared/config/utils";
import { InfoPanel } from "../../../../shared/components/panels/InfoPanel";
import { Info } from "lucide-react";

export default function HealthDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState(null);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { crewProfile, isFetching, isUpdating, error } = useSelector(
    (state) => state.crewProfile,
  );

  useEffect(() => {
    if (!crewProfile && !isFetching) dispatch(fetchProfileThunk());
  }, []);

  const health = crewProfile?.health;
  const isSaving = isUpdating && isEditing;

  const hd = isEditing
    ? formState
    : {
        dietaryRequirements: health?.dietaryRequirements,
        allergies: health?.allergies,
      };

  const startEditing = () => {
    setErrors({});
    setFormState({
      dietaryRequirements: arrayToText(
        health?.dietaryRequirements?.map(convertToPrettyText),
      ),
      allergies: arrayToText(health?.allergies?.map(convertToPrettyText)),
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFormState(null);
    setErrors({});
  };

  const handleSave = async () => {
    setErrors({});

    const payload = {
      dietaryRequirements: textToArray(formState.dietaryRequirements),
      allergies: textToArray(formState.allergies),
    };

    const result = healthDetailsSchema.safeParse(payload);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    try {
      await dispatch(updateHealthDetailsThunk(result.data)).unwrap();
      toast.success("Health details updated successfully");
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update health details");
    }
  };

  if (isFetching) return <ProfileCardLoadingSkelton fields={2} columns={2} />;

  if (error) {
    return (
      <ProfileCardErrorSkelton
        message={
          typeof error === "string"
            ? error
            : error?.message || "Something went wrong"
        }
        onRetry={() => dispatch(fetchProfileThunk())}
      />
    );
  }

  return (
    <CardWrapper
      title="Health & Dietary"
      icon="Heart"
      actions={
        <EditToggleButtons
          isEditing={isEditing}
          isLoading={isSaving}
          onEdit={startEditing}
          onSave={handleSave}
          onCancel={cancelEditing}
        />
      }
    >
      {isEditing && (
        <InfoPanel
          title="How to enter details"
          icon={Info}
          variant="info"
          className="mb-4"
        >
          <p>
            Enter multiple values separated by{" "}
            <span className="text-primary">commas.</span>
          </p>
          <p>
            Example:{" "}
            <span className="font-medium">Vegetarian, Vegan, Halal</span>
          </p>
          <p className="text-xs opacity-80">
            Each item will be saved and displayed as a separate entry.
          </p>
          <p className="text-xs opacity-80">
            Extra spaces or commas will be cleaned automatically.
          </p>
        </InfoPanel>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-68">
        <EditableTextDataField
          label="DIETARY REQUIREMENTS"
          value={hd?.dietaryRequirements}
          displayType="list"
          onChange={(val) =>
            setFormState((prev) => ({ ...prev, dietaryRequirements: val }))
          }
          multiline
          placeholder="E.g. Vegetarian, Vegan, Halal, Kosher"
          isEditing={isEditing}
          inputClassName="min-h-[100px]"
          isRequired={false}
          error={errors?.dietaryRequirements?.[0]}
          disabled={isSaving}
        />

        <EditableTextDataField
          label="ALLERGIES"
          value={hd?.allergies}
          displayType="list"
          onChange={(val) =>
            setFormState((prev) => ({ ...prev, allergies: val }))
          }
          multiline
          placeholder="E.g. Peanuts, Shellfish, Pollen"
          isEditing={isEditing}
          inputClassName="min-h-[100px]"
          isRequired={false}
          error={errors?.allergies?.[0]}
          disabled={isSaving}
        />
      </div>
    </CardWrapper>
  );
}
