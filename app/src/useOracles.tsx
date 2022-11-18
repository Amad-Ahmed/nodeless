import { useCallback, useMemo } from "react";
import { useAuthenticatedFetch, useAuthenticatedQuery } from "./Authenticator";
import { BigNumber } from "ethers";
export type Oracle = {
  name: string;
  contractAddress: string;
  chainId: string;
  jobId: string;
  fee: string;
  webhookUrl: string;
  id: number;
  confirmed: boolean;
  inputs: Record<string, string>;
  outputType: string;
  async: boolean;
};
export const useOracles = () => {
  const fetch = useAuthenticatedFetch();
  const { data, error, loading, refresh } =
    useAuthenticatedQuery<Oracle[]>("/oracles");
  const oracles: Oracle[] = useMemo(() => {
    if (data) return data;
    else return [];
  }, [data]);
  const createOracle = useCreateOracle();
  const create = useCallback(
    async (options: {
      name: string;
      address?: string;
      webhookUrl: string;
      chainId: string;
      fee?: BigNumber;
      confirmed?: boolean;
      inputs?: Record<string, string>;
      outputType?: string;
      async?: boolean;
    }) => {
      await createOracle(options);
      refresh();
    },
    [createOracle, refresh]
  );

  const validate = useCallback(
    async (options: { address: string; chainId?: string }) => {
      const response = await fetch("/oracles/validate", {
        method: "POST",
        body: JSON.stringify(options),
      });
      if (response.status === 200) {
        const json: { valid: boolean } = await response.json();
        return json.valid;
      } else {
        throw new Error(response.statusText);
      }
    },
    [fetch]
  );
  const remove = useCallback(
    async (id: string) => {
      const response = await fetch(`/oracles/${id}`, {
        method: "DELETE",
      });
      if (response.status === 200) {
        refresh();
      } else {
        throw new Error(response.statusText);
      }
    },
    [fetch, refresh]
  );

  return useMemo(
    () => ({ oracles, error, loading, create, refresh, validate, remove }),
    [oracles, error, loading, create, refresh, validate, remove]
  );
};

export const useCreateOracle = () => {
  const fetch = useAuthenticatedFetch();
  const create = useCallback(
    async (options: {
      name: string;
      address?: string;
      webhookUrl: string;
      chainId: string;
      fee?: BigNumber;
      confirmed?: boolean;
      inputs?: Record<string, string>;
      outputType?: string;
      async?: boolean;
      createContract?: boolean;
    }) => {
      if (!options.createContract && !options.address)
        throw new Error("address or create contract is required");
      const body = {
        name: options.name,
        contractAddress: options.address,
        webhookUrl: options.webhookUrl,
        chainId: options.chainId,
        async: typeof options.async === "undefined" ? false : options.async,
        confirmed:
          typeof options.confirmed === "undefined" ? false : options.confirmed,
        inputs: options.inputs,
        outputType: options.outputType,
        fee: options.fee ? BigNumber.from(options.fee) : undefined,
        createContract: options.createContract,
      };
      const response = await fetch("/oracles", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
        const json: { id: string } = await response.json();
        return json;
      } else throw new Error(response.statusText);
    },
    [fetch]
  );
  return create;
};

export const useOracle = (id: number) => {
  const fetch = useAuthenticatedFetch();
  const { data, error, loading, refresh } = useAuthenticatedQuery<Oracle>(
    `/oracles/${id}`,
    {
      method: "GET",
    }
  );
  const oracle: Oracle | undefined = useMemo(() => {
    if (data) return data;
    else return undefined;
  }, [data]);
  const update = useCallback(
    async (options: {
      name?: string;
      address?: string;
      webhookUrl?: string;
      chainId?: string;
      confirmed?: boolean;
      async?: boolean;
      inputs?: Record<string, string>;
      outputType?: string;
      fee?: BigNumber;
    }) => {
      const response = await fetch(`/oracles/${id}`, {
        method: "POST",
        body: JSON.stringify(options),
      });
      if (response.status === 200) {
        refresh();
      } else {
        throw new Error(response.statusText);
      }
    },
    [fetch, id, refresh]
  );
  const remove = useCallback(async () => {
    const response = await fetch(`/oracles/${id}`, {
      method: "DELETE",
    });
    if (response.status === 200) {
      //We're done - one should navigte out of the page at that point
    } else {
      throw new Error(response.statusText);
    }
  }, [fetch, id]);

  return useMemo(
    () => ({ oracle, error, loading, update, refresh, remove }),
    [oracle, error, loading, update, refresh, remove]
  );
};

export type Request = {
  id: number;
  requester: string;
  requestId: string;
  payment: string;
  status: "remitting" | "complete" | "pending" | "error";
  _oracle: Oracle;
  created_at: number;
  transaction: string;
};
export const useRequests = (id?: number) => {
  const fetch = useAuthenticatedFetch();
  const { data, error, loading, refresh } = useAuthenticatedQuery<Request[]>(
    `/requests?oracleId=${id || 0}`
  );
  const remove = useCallback(
    async (id: number) => {
      await fetch(`/requests/${id}`, {
        method: "DELETE",
      });
      refresh();
    },
    [fetch, refresh]
  );
  return useMemo(
    () => ({ data, error, loading, refresh, remove }),
    [data, error, loading, refresh, remove]
  );
};
