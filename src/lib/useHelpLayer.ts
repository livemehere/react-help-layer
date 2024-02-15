import { useEffect, useState } from "react";

interface Options {
  /**
   * @description shift + ? : show
   * @description Escape : hide
   */
  enableKeyboardShortcut?: boolean;
}

export const useHelpLayer = (options?: Options) => {
  const [step, setStep] = useState(1);
  const [show, setShow] = useState(false);

  const hideHelpLayer = () => {
    setShow(false);
  };

  const showHelpLayer = () => {
    setShow(true);
    setStep(1);
  };

  const goToNextStep = () => {
    setStep((prev) => prev + 1);
  };
  const goToPrevStep = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  useEffect(() => {
    if (!options?.enableKeyboardShortcut) return;
    function handleKeyDown(e: KeyboardEvent) {
      const key = e.key;
      if (key === "Escape") {
        hideHelpLayer();
        return;
      }

      if (key === "?" && e.shiftKey) {
        showHelpLayer();
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [options?.enableKeyboardShortcut]);

  return {
    hideHelpLayer,
    showHelpLayer,
    goToNextStep,
    goToPrevStep,
    currentStep: step,
    show,
    setShow,
  };
};
