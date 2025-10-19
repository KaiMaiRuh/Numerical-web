import { useState, useCallback } from "react";

/**
 * useProblems(service)
 * service should expose: get..., save..., delete... (functions returning Promises)
 */
export default function useProblems(service) {
  const [problems, setProblems] = useState([]);
  const [removingIds, setRemovingIds] = useState(new Set());

  const refresh = useCallback(async () => {
    if (!service || typeof service.get !== 'function') {
      // try common names
      const getter = service?.getBisectionProblems || service?.getFalsePositionProblems || service?.getProblems || service?.get;
      if (!getter) return;
      const data = await getter();
      setProblems(data);
      return;
    }
    const data = await service.get();
    setProblems(data);
  }, [service]);

  const saveProblem = useCallback(async (problem) => {
    if (!service) throw new Error('service required');
    const saver = service.saveBisectionProblem || service.saveFalsePositionProblem || service.save || service.add;
    if (!saver) throw new Error('save method not found on service');
    await saver(problem);
    await refresh();
  }, [service, refresh]);

  const deleteProblem = useCallback(async (id) => {
    if (!service) throw new Error('service required');
    const deleter = service.deleteBisectionProblem || service.deleteFalsePositionProblem || service.delete || service.remove;
    if (!deleter) throw new Error('delete method not found on service');
    await deleter(id);
    await refresh();
  }, [service, refresh]);

  // helper to trigger fade-out: returns a function that marks id then deletes after timeout
  const deleteWithAnimation = useCallback((id, timeout = 480) => {
    setRemovingIds((s) => new Set(s).add(id));
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await deleteProblem(id);
          resolve(true);
        } catch (e) {
          reject(e);
        } finally {
          setRemovingIds((s) => {
            const n = new Set(s);
            n.delete(id);
            return n;
          });
        }
      }, timeout);
    });
  }, [deleteProblem]);

  return {
    problems,
    removingIds,
    refresh,
    saveProblem,
    deleteProblem: deleteWithAnimation,
  };
}
