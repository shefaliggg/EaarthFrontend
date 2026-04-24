import LoadingScreen from "@/shared/components/LoadingScreen";
import { useLoaderStore } from "@/shared/stores/useLoaderStore";

export default function GlobalLoaderRenderer() {
  const { isLoading, variant } = useLoaderStore();

  if (!isLoading) return null;

  return <LoadingScreen variant={variant} />;
}
