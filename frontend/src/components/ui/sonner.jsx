import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group z-[100]"
      position="top-right"
      offset={24}
      duration={1000}
      closeButton={true}
      expand={true}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border group-[.toaster]:rounded-xl group-[.toaster]:shadow-lg group-[.toaster]:px-4 group-[.toaster]:py-3.5 transition-all max-w-sm w-full flex items-start gap-3 text-sm border-l-4",
          title: "group-[.toast]:font-medium group-[.toast]:text-slate-900",
          description: "group-[.toast]:text-slate-500 group-[.toast]:text-xs mt-0.5",
          actionButton:
            "group-[.toast]:bg-brand-primary group-[.toast]:text-white font-medium rounded-md px-3 py-1.5",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-600 font-medium rounded-md px-3 py-1.5",
          success:
            "group-[.toaster]:border-emerald-500 group-[.toaster]:bg-emerald-50/90 group-[.toaster]:text-emerald-900",
          error:
            "group-[.toaster]:border-red-500 group-[.toaster]:bg-red-50/90 group-[.toaster]:text-red-900",
          warning:
            "group-[.toaster]:border-amber-500 group-[.toaster]:bg-amber-50/90 group-[.toaster]:text-amber-900",
          info:
            "group-[.toaster]:border-blue-500 group-[.toaster]:bg-blue-50/90 group-[.toaster]:text-blue-900",
          closeButton:
            "group-[.toast]:!bg-transparent group-[.toast]:!text-slate-400 group-[.toast]:!border-none hover:group-[.toast]:!text-slate-900 hover:group-[.toast]:!bg-slate-900/5 transition-colors !absolute !right-2 !top-2 !h-7 !w-7 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-5 text-emerald-600 flex-shrink-0 mt-0.5" />,
        info: <InfoIcon className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />,
        warning: <TriangleAlertIcon className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />,
        error: <OctagonXIcon className="size-5 text-red-600 flex-shrink-0 mt-0.5" />,
        loading: <Loader2Icon className="size-5 animate-spin text-brand-primary flex-shrink-0 mt-0.5" />,
      }}
      {...props} />
  );
}

export { Toaster }
