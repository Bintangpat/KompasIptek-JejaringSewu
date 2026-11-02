"use client";

import { useApiQuery } from "@/hooks/use-api-query";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { commuterApi } from "./api";
import { StartRoutePayload, NearbyRoutesParams, CreateJastipOrderPayload } from "./types";
import { CommuterRoute, JastipOrder } from "@/types";

export function useNearbyRoutes(params: NearbyRoutesParams, enabled = true) {
  return useApiQuery<CommuterRoute[]>("/commuters/routes/nearby", {
    enabled,
    params,
    fallbackData: [],
  });
}

export function useCommuterActions() {
  const startRouteMutation = useApiMutation<CommuterRoute, StartRoutePayload>(
    (vars) => commuterApi.startRoute(vars),
    {
      successMessage: "Rute perjalanan tebeng-jastip aktif dibuka.",
    }
  );

  const createOrderMutation = useApiMutation<JastipOrder, CreateJastipOrderPayload>(
    (vars) => commuterApi.createOrder(vars),
    {
      successMessage: "Pesanan titipan barang berhasil dikirimkan ke kurir komuter.",
    }
  );

  const acceptOrderMutation = useApiMutation<any, string>(
    (orderId) => commuterApi.acceptOrder(orderId),
    {
      successMessage: "Pesanan jastip berhasil diterima oleh kurir komuter.",
    }
  );

  return {
    startRoute: startRouteMutation.mutate,
    isStartingRoute: startRouteMutation.isLoading,
    createOrder: createOrderMutation.mutate,
    isCreatingOrder: createOrderMutation.isLoading,
    acceptOrder: acceptOrderMutation.mutate,
    isAcceptingOrder: acceptOrderMutation.isLoading,
  };
}
