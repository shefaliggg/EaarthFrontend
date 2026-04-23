import * as FramerMotion from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Lock } from "lucide-react";

function NavigationFooter({ activeIndex, goPrev, goNext, tabs }) {
  return (
    <>
      <div className="flex items-center justify-between p-4 rounded-3xl border bg-background shadow-sm">
        <FramerMotion.motion.button
          onClick={goPrev}
          disabled={activeIndex === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[0.7rem] bg-card text-foreground border border-border transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Previous
        </FramerMotion.motion.button>
        <div className="flex items-center gap-2">
          <FramerMotion.motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[0.7rem] font-medium bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Lock className="w-3.5 h-3.5" />
            Lock & Continue
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </FramerMotion.motion.button>
          <FramerMotion.motion.button
            onClick={goNext}
            disabled={activeIndex === tabs.length - 1}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[0.7rem] bg-card text-foreground border border-border transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </FramerMotion.motion.button>
        </div>
      </div>
    </>
  );
}

export default NavigationFooter;
