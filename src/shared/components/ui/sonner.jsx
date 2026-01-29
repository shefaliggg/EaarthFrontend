import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group shadow-2xl"
      toastOptions={{
        classNames: {
          toast: "border rounded-lg shadow-md relative",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
