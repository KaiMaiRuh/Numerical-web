import { useState, useCallback } from "react";

// useProblems(service): tiny, flexible CRUD hook for local problem lists
export default function useProblems(service) {
  const [problems, setProblems] = useState([]);
  const [removingIds, setRemovingIds] = useState(new Set());

  const pick = (...fns) => fns.find((fn) => typeof fn === "function");

  const refresh = useCallback(async () => {
    const getter = pick(
      service?.get,
      service?.getProblems,
      service?.getBisectionProblems,
      service?.getFalsePositionProblems
    );
    if (!getter) return;
    setProblems(await getter());
  }, [service]);

  const makeCaller = useCallback(
    (names) => async (...args) => {
      if (!service) throw new Error("service required");
      const fn = pick(...names.map((n) => service?.[n]));
      if (!fn) throw new Error(`${names[0]} method not found on service`);
      await fn(...args);
      await refresh();
    },
    [service, refresh]
  );

  const saveProblem = useCallback(
    makeCaller(["save", "add", "saveBisectionProblem", "saveFalsePositionProblem"]),
    [makeCaller]
  );
  const deleteProblem = useCallback(
    makeCaller(["delete", "remove", "deleteBisectionProblem", "deleteFalsePositionProblem"]),
    [makeCaller]
  );

  // fade-out then delete (Promise-based for .then/.catch chains)
  const deleteWithAnimation = useCallback(
    (id, timeout = 480) => {
      setRemovingIds((s) => new Set(s).add(id));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          deleteProblem(id)
            .then(() => resolve(true))
            .catch(reject)
            .finally(() =>
              setRemovingIds((s) => {
                const n = new Set(s);
                n.delete(id);
                return n;
              })
            );
        }, timeout);
      });
    },
    [deleteProblem]
  );

  return { problems, removingIds, refresh, saveProblem, deleteProblem: deleteWithAnimation };
}
