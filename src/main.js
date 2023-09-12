(async () => {
  if (self.WorkerGlobalScope) initWorker();
  else initWindow();
})();