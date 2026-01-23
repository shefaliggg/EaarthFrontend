import { useState } from "react";
import { Stepper } from "./Stepper";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeftCircle, ArrowRightCircle, CheckCircle } from "lucide-react";

export function StepperWrapper({ steps, children }) {
    const [activeStep, setActiveStep] = useState(0);

    const next = () =>
        setActiveStep((s) => Math.min(s + 1, steps.length - 1));

    const back = () =>
        setActiveStep((s) => Math.max(s - 1, 0));

    return (
        <div className="w-full space-y-8">
            <Stepper
                steps={steps}
                activeStep={activeStep}
                onStepChange={setActiveStep}
            />

            {/* STEP CONTENT */}
            <div className="min-h-[200px]">
                {children[activeStep]}
            </div>

            {/* CONTROLS */}
            <div className="flex justify-end gap-3">
                <Button
                    variant="outline"
                    onClick={back}
                    disabled={activeStep === 0}
                >
                    <ArrowLeftCircle />
                    Previous Step
                </Button>

                <Button
                    onClick={next}
                    disabled={activeStep === steps.length - 1}
                >
                    {activeStep === steps.length - 1 ?
                        <>
                            <CheckCircle />
                            Finish
                        </>
                        : <>
                            <ArrowRightCircle />
                            Next Step
                        </>
                    }
                </Button>
            </div>
        </div>
    );
}
