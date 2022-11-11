import { useCallback, useMemo } from "react";
import { useAuthenticatedFetch, useAuthenticatedQuery } from "./Authenticator";
import { BigNumber } from "ethers";
type Oracle = {
  name: string;
  address: string;
  chainId: string;
  jobId: string;
  fee: string;
};
export const useOracles = () => {
  const fetch = useAuthenticatedFetch();
  const { data, error, loading, refresh } = useAuthenticatedQuery<Oracle[]>(
    "/oracles",
    {
      method: "GET",
    }
  );
  const oracles: Oracle[] = useMemo(() => {
    if (data) return data;
    else return [];
  }, [data]);
  const create = useCallback(
    async (options: {
      name: string;
      address?: string;
      webhookUrl: string;
      chainId: string;
      fee?: BigNumber;
    }) => {
      const body = {
        name: options.name,
        address: options.address,
        webhookUrl: options.webhookUrl,
        chainId: options.chainId,
        fee: options.fee ? BigNumber.from(options.fee) : undefined,
      };
      const response = await fetch("/oracles", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
        refresh();
        const json: { id: string } = await response.json();
        return json;
      } else throw new Error(response.statusText);
    },
    [fetch, refresh]
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

  return { oracles, error, loading, create, refresh, validate, remove };
};

export const useOracle = (id: string) => {
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

  return { oracle, error, loading, update, refresh, remove };
};
