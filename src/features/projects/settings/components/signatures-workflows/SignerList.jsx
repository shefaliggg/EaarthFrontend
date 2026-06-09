import { Plus } from "lucide-react";
import * as FramerMotion from "framer-motion";
import SignerCard from "./SignerCard";
import { AutoHeight } from "@/shared/components/wrappers/AutoHeight";

function SignerList({ signers, isEditing, onChange, emptySigner }) {
  const addSigner = () => {
    const nextOrder =
      signers.length > 0
        ? Math.max(...signers.map((s) => s.order || 0)) + 1
        : 1;

    onChange([
      ...signers,
      {
        ...emptySigner(),
        order: nextOrder,
      },
    ]);
  };

  const updateSigner = (id, data) => {
    onChange(signers.map((signer) => (signer.id === id ? data : signer)));
  };

  const removeSigner = (id) => {
    onChange(signers.filter((signer) => signer.id !== id));
  };

  return (
    <>
      <div className="space-y-4">
        <AutoHeight className="flex flex-col gap-3">
          {signers.map((signer) => (
            <SignerCard
              key={signer.id}
              data={signer}
              isEditing={isEditing}
              onChange={(data) => updateSigner(signer.id, data)}
              onDelete={() => removeSigner(signer.id)}
            />
          ))}
        </AutoHeight>
        {isEditing && (
          <button
            onClick={addSigner}
            className="w-full border-2 border-dashed border-border text-primary py-5 rounded-lg flex items-center justify-center gap-2 hover:bg-muted/20"
          >
            <Plus size={16} />
            Add Signer
          </button>
        )}
      </div>
    </>
  );
}

export default SignerList;
